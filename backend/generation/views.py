from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Q, Avg
from PIL import Image as PILImage
from .models import Image, Generation
from .serializers import (
    ImageSerializer,
    GenerationSerializer,
    GenerationCreateSerializer
)
from .tasks import process_generation


class ImageUploadView(APIView):
    """
    API endpoint for uploading images (model or garment images).

    POST /api/generation/images/upload/
    - multipart/form-data with 'file' and 'image_type'
    - image_type must be 'model_image' or 'garment_image'
    - Returns created Image object with metadata
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        """Handle image upload."""
        file = request.FILES.get('file')
        image_type = request.data.get('image_type')

        # Validate file presence
        if not file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate image type
        if image_type not in ['model_image', 'garment_image']:
            return Response(
                {'error': 'Invalid image_type. Must be model_image or garment_image'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB
        if file.size > max_size:
            return Response(
                {
                    'error': f'File too large. Maximum size is {max_size / (1024 * 1024)}MB',
                    'file_size': file.size,
                    'max_size': max_size
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/webp']
        if file.content_type not in allowed_types:
            return Response(
                {
                    'error': f'Invalid file type. Allowed types: {", ".join(allowed_types)}',
                    'received_type': file.content_type
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get image dimensions
        try:
            pil_image = PILImage.open(file)
            width, height = pil_image.size

            # Validate minimum dimensions
            min_dimension = 512
            if width < min_dimension or height < min_dimension:
                return Response(
                    {
                        'error': f'Image too small. Minimum dimensions: {min_dimension}x{min_dimension}',
                        'width': width,
                        'height': height
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Reset file pointer after reading
            file.seek(0)

        except Exception as e:
            return Response(
                {'error': f'Invalid image file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Image record
        try:
            image = Image.objects.create(
                user=request.user,
                file=file,
                image_type=image_type,
                width=width,
                height=height,
                file_size=file.size
            )

            serializer = ImageSerializer(image, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Failed to save image: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GenerationListCreateView(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating generation requests.

    GET /api/generation/generations/
    - List all generations for authenticated user
    - Supports filtering by status: ?status=completed
    - Supports sorting: ?sort_by=-created_at (default), name, -name, created_at

    POST /api/generation/generations/
    - Create new generation request
    - Requires model_image_id, garment_image_id, provider
    - Optional: quality_preset (default: standard), name
    - Triggers async Celery task for processing
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Return appropriate serializer based on request method."""
        if self.request.method == 'POST':
            return GenerationCreateSerializer
        return GenerationSerializer

    def get_queryset(self):
        """
        Get generations for current user with optional filtering and sorting.
        """
        queryset = Generation.objects.filter(user=self.request.user)

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            if status_filter in ['pending', 'processing', 'completed', 'failed', 'closed']:
                queryset = queryset.filter(status=status_filter)

        # Sort by field
        sort_by = self.request.query_params.get('sort_by', '-created_at')
        valid_sort_fields = ['name', '-name', 'created_at', '-created_at']
        if sort_by in valid_sort_fields:
            queryset = queryset.order_by(sort_by)
        else:
            # Default sort
            queryset = queryset.order_by('-created_at')

        # Optimize queries with select_related
        queryset = queryset.select_related(
            'model_image',
            'garment_image',
            'result_image'
        )

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create new generation and queue Celery task.
        """
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        # Get images
        model_image = Image.objects.get(
            id=serializer.validated_data['model_image_id']
        )
        garment_image = Image.objects.get(
            id=serializer.validated_data['garment_image_id']
        )

        # Create Generation record
        generation = Generation.objects.create(
            user=request.user,
            name=serializer.validated_data.get('name', 'Untitled Generation'),
            model_image=model_image,
            garment_image=garment_image,
            provider=serializer.validated_data['provider'],
            quality_preset=serializer.validated_data['quality_preset'],
            category=serializer.validated_data.get('category', 'upper_body'),
            garment_description=serializer.validated_data.get('garment_description', ''),
            status='pending'
        )

        # Queue Celery task for async processing
        process_generation.delay(str(generation.id))

        # Return generation details
        response_serializer = GenerationSerializer(
            generation,
            context={'request': request}
        )
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class GenerationDetailView(generics.RetrieveDestroyAPIView):
    """
    API endpoint for retrieving a single generation.

    GET /api/generation/generations/{id}/
    - Returns full details of a generation
    - Includes status, images, and results
    """
    permission_classes = [IsAuthenticated]
    serializer_class = GenerationSerializer

    def get_queryset(self):
        """Get generations for current user only."""
        return Generation.objects.filter(
            user=self.request.user
        ).select_related(
            'model_image',
            'garment_image',
            'result_image'
        )

    def destroy(self, request, *args, **kwargs):
        generation = self.get_object()
        if generation.status in ('pending', 'processing'):
            return Response(
                {'error': 'Close the generation before deleting it.'},
                status=status.HTTP_409_CONFLICT
            )
        result_image = generation.result_image
        generation.delete()
        if result_image and not result_image.generation_results.exists():
            result_image.file.delete(save=False)
            result_image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GenerationCloseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        generation = get_object_or_404(Generation, pk=pk, user=request.user)
        if generation.status == 'closed':
            return Response(GenerationSerializer(generation, context={'request': request}).data)
        updated = Generation.objects.filter(
            pk=pk, user=request.user, status__in=('pending', 'processing')
        ).update(status='closed', completed_at=timezone.now())
        if not updated:
            return Response(
                {'error': 'This generation has already finished.'},
                status=status.HTTP_409_CONFLICT
            )
        generation.refresh_from_db()
        return Response(GenerationSerializer(generation, context={'request': request}).data)


class GenerationStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = Generation.objects.filter(user=request.user).aggregate(
            total=Count('id'),
            completed=Count('id', filter=Q(status='completed')),
            processing=Count('id', filter=Q(status__in=['pending', 'processing'])),
            failed=Count('id', filter=Q(status='failed')),
            closed=Count('id', filter=Q(status='closed')),
            average_processing_seconds=Avg('processing_time_seconds'),
        )
        return Response(stats)
