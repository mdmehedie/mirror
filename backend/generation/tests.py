from unittest.mock import patch
from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.test.utils import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from PIL import Image as PILImage

from .models import Generation, Image
from .tasks import process_generation


class GenerationLifecycleTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='owner', email='owner@example.com', password='TestPass123!'
        )
        self.other_user = get_user_model().objects.create_user(
            username='other', email='other@example.com', password='TestPass123!'
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.model_image = Image.objects.create(
            user=self.user, file='images/model.jpg', image_type='model_image',
            width=512, height=512, file_size=100
        )
        self.garment_image = Image.objects.create(
            user=self.user, file='images/garment.jpg', image_type='garment_image',
            width=512, height=512, file_size=100
        )
        self.generation = Generation.objects.create(
            user=self.user, model_image=self.model_image,
            garment_image=self.garment_image, provider='replicate'
        )
        self.url = f'/api/generation/generations/{self.generation.id}/'

    def test_close_then_delete_running_generation(self):
        self.assertEqual(self.client.delete(self.url).status_code, 409)
        response = self.client.post(f'{self.url}close/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'closed')
        self.assertEqual(self.client.delete(self.url).status_code, 204)
        self.assertFalse(Generation.objects.filter(pk=self.generation.pk).exists())

    def test_completed_generation_can_be_deleted(self):
        result_image = Image.objects.create(
            user=self.user, file='images/result.jpg', image_type='result_image',
            width=512, height=512, file_size=100
        )
        self.generation.status = 'completed'
        self.generation.result_image = result_image
        self.generation.save()
        self.assertEqual(self.client.post(f'{self.url}close/').status_code, 409)
        self.assertEqual(self.client.delete(self.url).status_code, 204)
        self.assertFalse(Image.objects.filter(pk=result_image.pk).exists())
        self.assertTrue(Image.objects.filter(pk=self.model_image.pk).exists())

    def test_other_user_cannot_close_or_delete_generation(self):
        self.client.force_authenticate(self.other_user)
        self.assertEqual(self.client.post(f'{self.url}close/').status_code, 404)
        self.assertEqual(self.client.delete(self.url).status_code, 404)

    @patch('generation.tasks.get_provider')
    def test_worker_does_not_save_result_after_close(self, get_provider):
        def close_while_provider_runs(*args):
            Generation.objects.filter(pk=self.generation.pk).update(status='closed')
            return 'https://example.com/result.jpg'

        get_provider.return_value.name = 'Test provider'
        get_provider.return_value.generate.side_effect = close_while_provider_runs
        result = process_generation.run(str(self.generation.pk))
        self.generation.refresh_from_db()
        self.assertEqual(result['status'], 'closed')
        self.assertEqual(self.generation.status, 'closed')
        self.assertIsNone(self.generation.result_image)
        get_provider.return_value.get_status.assert_not_called()


class MerchantIntegrationTests(TestCase):
    def setUp(self):
        self.media_dir = TemporaryDirectory()
        self.addCleanup(self.media_dir.cleanup)
        media_override = override_settings(MEDIA_ROOT=self.media_dir.name)
        media_override.enable()
        self.addCleanup(media_override.disable)
        self.owner = get_user_model().objects.create_user(
            username='merchant', email='merchant@example.com', password='TestPass123!'
        )
        self.other = get_user_model().objects.create_user(
            username='othermerchant', email='othermerchant@example.com', password='TestPass123!'
        )
        self.portal = APIClient()
        self.portal.force_authenticate(self.owner)

    def image_file(self, name):
        buffer = BytesIO()
        PILImage.new('RGB', (512, 512), 'red').save(buffer, format='PNG')
        return SimpleUploadedFile(name, buffer.getvalue(), content_type='image/png')

    @patch('generation.merchant_views.process_generation.delay')
    def test_key_create_generation_status_and_revoke(self, queue):
        key_response = self.portal.post('/api/auth/api-keys/', {'name': 'Store backend'})
        self.assertEqual(key_response.status_code, 201)
        raw_key = key_response.data['key']
        self.assertNotIn('key', self.portal.get('/api/auth/api-keys/').data[0])

        merchant = APIClient()
        merchant.credentials(HTTP_X_ECOMPHO_KEY=raw_key)
        with self.captureOnCommitCallbacks(execute=True):
            response = merchant.post('/api/v1/generations/', {
                'model_image': self.image_file('person.png'),
                'garment_image': self.image_file('shirt.png'),
            }, format='multipart')
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.data['status'], 'pending')
        self.assertIsNone(response.data['result_image_url'])
        queue.assert_called_once()
        generation_id = response.data['id']
        self.assertEqual(merchant.get(f'/api/v1/generations/{generation_id}/').status_code, 200)
        self.assertEqual(self.portal.get('/api/generation/stats/').data['total'], 1)

        generation = Generation.objects.get(pk=generation_id)
        result_image = Image.objects.create(
            user=self.owner, file=self.image_file('result.png'), image_type='result_image',
            width=512, height=512, file_size=100
        )
        generation.status = 'completed'
        generation.result_image = result_image
        generation.save()
        detail = merchant.get(f'/api/v1/generations/{generation_id}/')
        self.assertIn('/image/', detail.data['result_image_url'])
        image_response = merchant.get(f'/api/v1/generations/{generation_id}/image/')
        self.assertEqual(image_response.status_code, 200)
        self.assertEqual(image_response['Content-Type'], 'image/png')

        other_client = APIClient()
        other_client.force_authenticate(self.other)
        other_key = other_client.post('/api/auth/api-keys/', {'name': 'Other store'}).data['key']
        other_client.force_authenticate(None)
        other_client.credentials(HTTP_X_ECOMPHO_KEY=other_key)
        self.assertEqual(other_client.get(f'/api/v1/generations/{generation_id}/').status_code, 404)
        self.assertEqual(other_client.get(f'/api/v1/generations/{generation_id}/image/').status_code, 404)

        key_id = key_response.data['id']
        self.assertEqual(self.portal.delete(f'/api/auth/api-keys/{key_id}/').status_code, 204)
        self.assertEqual(merchant.get(f'/api/v1/generations/{generation_id}/').status_code, 401)

    def test_missing_key_and_invalid_image(self):
        merchant = APIClient()
        self.assertEqual(merchant.get('/api/v1/generations/').status_code, 401)
        key = self.portal.post('/api/auth/api-keys/', {'name': 'Store'}).data['key']
        merchant.credentials(HTTP_X_ECOMPHO_KEY=key)
        response = merchant.post('/api/v1/generations/', {
            'model_image': self.image_file('person.png'),
            'garment_image': SimpleUploadedFile('bad.png', b'not an image', content_type='image/png'),
        }, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Generation.objects.count(), 0)
