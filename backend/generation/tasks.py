from celery import shared_task
from django.utils import timezone
from django.core.files.base import ContentFile
import httpx
import time
import logging
from PIL import Image as PILImage
from .models import Generation, Image
from .providers import get_provider

# Set up logging
logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def process_generation(self, generation_id):
    """
    Process a virtual try-on generation asynchronously.

    This task:
    1. Updates generation status to 'processing'
    2. Gets the appropriate AI provider
    3. Submits images to the provider
    4. Polls for completion (if async)
    5. Downloads and saves the result image
    6. Updates generation with results

    Args:
        generation_id: UUID string of the Generation record

    Returns:
        dict: Status and result information

    Raises:
        Retry: If generation fails and retries are available
    """
    logger.info(f"Starting generation processing for ID: {generation_id}")

    try:
        generation = Generation.objects.get(id=generation_id)
    except Generation.DoesNotExist:
        logger.error(f"Generation {generation_id} not found")
        return {'error': 'Generation not found'}

    start_time = time.time()

    try:
        # Update status to processing
        generation.status = 'processing'
        generation.save()
        logger.info(f"Generation {generation_id} status: processing")

        # Get provider
        provider = get_provider(generation.provider)
        logger.info(f"Using provider: {provider.name}")

        # Get file paths for images (for local file upload to Replicate)
        # Use file.path to get the actual file system path instead of URLs
        try:
            model_image_path = generation.model_image.file.path
            garment_image_path = generation.garment_image.file.path
            logger.info(f"Model image path: {model_image_path}")
            logger.info(f"Garment image path: {garment_image_path}")
        except Exception as e:
            logger.error(f"Failed to get image paths: {e}")
            # Fallback to URLs if path access fails
            model_image_path = generation.model_image.file.url
            garment_image_path = generation.garment_image.file.url

            # Make URLs absolute if they're relative (for localhost development)
            if model_image_path.startswith('/'):
                base_url = "http://localhost:8000"
                model_image_path = f"{base_url}{model_image_path}"
                logger.info(f"Using URL instead: {model_image_path}")

            if garment_image_path.startswith('/'):
                base_url = "http://localhost:8000"
                garment_image_path = f"{base_url}{garment_image_path}"
                logger.info(f"Using URL instead: {garment_image_path}")

        # Submit generation to provider
        logger.info(f"Submitting generation to {provider.name}")
        logger.info(f"Category: {generation.category}, Description: {generation.garment_description or 'None'}")
        job_id = provider.generate(
            model_image_path,
            garment_image_path,
            generation.quality_preset,
            generation.category,
            generation.garment_description or ''
        )
        logger.info(f"Provider job ID: {job_id[:50]}...")

        # Poll for completion (max 5 minutes = 60 attempts * 5 seconds)
        max_attempts = 60
        poll_interval = 5  # seconds

        for attempt in range(max_attempts):
            result_status = provider.get_status(job_id)
            logger.info(f"Attempt {attempt + 1}/{max_attempts}: Status = {result_status}")

            if result_status == 'completed':
                # Get result URL
                result_url = provider.get_result(job_id)
                logger.info(f"Result URL: {result_url[:50]}...")

                # Download result image
                try:
                    response = httpx.get(result_url, timeout=30.0, follow_redirects=True)
                    response.raise_for_status()
                    logger.info(f"Downloaded result image: {len(response.content)} bytes")

                except Exception as e:
                    logger.error(f"Failed to download result: {e}")
                    generation.status = 'failed'
                    generation.error_message = f"Failed to download result: {str(e)}"
                    generation.save()
                    return {'status': 'failed', 'error': generation.error_message}

                # Save result image
                result_image = Image.objects.create(
                    user=generation.user,
                    image_type='result_image',
                    width=0,  # Will be updated after saving
                    height=0,
                    file_size=len(response.content)
                )

                # Save file
                filename = f"result_{generation.id}.jpg"
                result_image.file.save(filename, ContentFile(response.content), save=False)

                # Update dimensions
                try:
                    pil_image = PILImage.open(result_image.file)
                    result_image.width, result_image.height = pil_image.size
                    result_image.save()
                    logger.info(f"Result image dimensions: {result_image.width}x{result_image.height}")

                except Exception as e:
                    logger.warning(f"Could not get image dimensions: {e}")
                    result_image.width = 0
                    result_image.height = 0
                    result_image.save()

                # Update generation
                end_time = time.time()
                processing_time = round(end_time - start_time, 2)

                generation.status = 'completed'
                generation.result_image = result_image
                generation.processing_time_seconds = processing_time
                generation.completed_at = timezone.now()
                generation.save()

                logger.info(
                    f"Generation {generation_id} completed successfully "
                    f"in {processing_time} seconds"
                )

                return {
                    'status': 'completed',
                    'generation_id': str(generation.id),
                    'processing_time': processing_time
                }

            elif result_status == 'failed':
                logger.error(f"Generation {generation_id} failed on provider side")
                generation.status = 'failed'
                generation.error_message = "Generation failed on provider side"
                generation.save()
                return {'status': 'failed', 'error': generation.error_message}

            # Wait before next poll (only if not completed or failed)
            if attempt < max_attempts - 1:
                time.sleep(poll_interval)

        # Timeout after max attempts
        logger.error(f"Generation {generation_id} timed out after {max_attempts * poll_interval} seconds")
        generation.status = 'failed'
        generation.error_message = f"Generation timed out after {max_attempts * poll_interval} seconds"
        generation.save()
        return {'status': 'failed', 'error': 'timeout'}

    except Exception as exc:
        # Log error and retry
        logger.error(f"Generation {generation_id} error: {exc}", exc_info=True)

        generation.status = 'failed'
        generation.error_message = str(exc)
        generation.save()

        # Retry with exponential backoff
        retry_countdown = 60 * (2 ** self.request.retries)
        logger.info(f"Retrying generation {generation_id} in {retry_countdown} seconds")

        raise self.retry(exc=exc, countdown=retry_countdown)
