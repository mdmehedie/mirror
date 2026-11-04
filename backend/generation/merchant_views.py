from django.db import transaction
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
import mimetypes
from PIL import Image as PILImage, UnidentifiedImageError
from rest_framework import serializers, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.api_keys import MerchantKeyAuthentication
from .models import Generation, Image
from .tasks import process_generation


class MerchantGenerationInput(serializers.Serializer):
    model_image = serializers.ImageField()
    garment_image = serializers.ImageField()
    name = serializers.CharField(max_length=200, required=False, default='Untitled Generation')
    quality_preset = serializers.ChoiceField(choices=['draft', 'standard', 'high'], default='standard')
    category = serializers.ChoiceField(choices=['upper_body', 'lower_body', 'dresses'], default='upper_body')
    garment_description = serializers.CharField(required=False, allow_blank=True, default='')

    def validate(self, attrs):
        for field in ('model_image', 'garment_image'):
            file = attrs[field]
            if file.size > 10 * 1024 * 1024:
                raise serializers.ValidationError({field: 'Maximum file size is 10 MB.'})
            if file.content_type not in ('image/jpeg', 'image/png', 'image/webp'):
                raise serializers.ValidationError({field: 'Use JPEG, PNG, or WebP.'})
            try:
                image = PILImage.open(file)
                width, height = image.size
                image.verify()
                file.seek(0)
            except (UnidentifiedImageError, OSError, ValueError):
                raise serializers.ValidationError({field: 'Invalid image file.'})
            if width < 512 or height < 512:
                raise serializers.ValidationError({field: 'Minimum image size is 512 x 512 pixels.'})
            attrs[f'{field}_dimensions'] = (width, height)
        return attrs


class MerchantApiView(APIView):
    authentication_classes = [MerchantKeyAuthentication]
    permission_classes = [IsAuthenticated]


def generation_data(request, generation):
    image_url = None
    if generation.status == 'completed' and generation.result_image_id:
        image_url = request.build_absolute_uri(
            reverse('merchant-generation-image', kwargs={'pk': generation.pk})
        )
    return {
        'id': generation.id,
        'status': generation.status,
        'name': generation.name,
        'quality_preset': generation.quality_preset,
        'category': generation.category,
        'result_image_url': image_url,
        'error_message': generation.error_message if generation.status == 'failed' else None,
        'created_at': generation.created_at,
        'completed_at': generation.completed_at,
    }


class MerchantGenerationCreateView(MerchantApiView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = MerchantGenerationInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        with transaction.atomic():
            images = []
            for field, image_type in (
                ('model_image', 'model_image'), ('garment_image', 'garment_image')
            ):
                file = data[field]
                width, height = data[f'{field}_dimensions']
                images.append(Image.objects.create(
                    user=request.user, file=file, image_type=image_type,
                    width=width, height=height, file_size=file.size
                ))
            generation = Generation.objects.create(
                user=request.user,
                model_image=images[0], garment_image=images[1],
                provider='replicate', name=data['name'],
                quality_preset=data['quality_preset'], category=data['category'],
                garment_description=data['garment_description'],
            )
            transaction.on_commit(lambda: process_generation.delay(str(generation.pk)))
        return Response(generation_data(request, generation), status=status.HTTP_202_ACCEPTED)


class MerchantGenerationDetailView(MerchantApiView):
    def get(self, request, pk):
        generation = get_object_or_404(
            Generation.objects.select_related('result_image'), pk=pk, user=request.user
        )
        return Response(generation_data(request, generation))


class MerchantGenerationImageView(MerchantApiView):
    def get(self, request, pk):
        generation = get_object_or_404(
            Generation.objects.select_related('result_image'), pk=pk,
            user=request.user, status='completed', result_image__isnull=False
        )
        content_type = mimetypes.guess_type(generation.result_image.file.name)[0] or 'application/octet-stream'
        return FileResponse(generation.result_image.file.open('rb'), content_type=content_type)
