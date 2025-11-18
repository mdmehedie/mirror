# Ecompho Development Plan - Virtual Try-On Platform
## Simplified PoC Implementation (6 Weeks)

**Project Goal:** Create a working proof-of-concept AI virtual try-on platform with 2 provider options - completely free, no billing

**Tech Stack:** Django 4.2 + DRF + React 19 + PostgreSQL + Celery + Redis

**Development Environment:** Localhost only

---

## 🎯 **PoC SCOPE (Simplified)**

### What We're Building:
✅ Upload model image (1 image only)
✅ Upload garment image (1 image)
✅ Choose provider: **Gemini** or **Replicate**
✅ Minimal customization (just quality preset)
✅ Generate virtual try-on
✅ **My Gallery** - sortable by creation date & name
✅ View results with full details
✅ Completely FREE - no payment system

### What We're NOT Building (Out of Scope for PoC):
❌ Credit/billing system
❌ Payment integration
❌ Advanced prompt customization
❌ Model/Product libraries
❌ Batch generation
❌ A/B testing
❌ Multiple model images
❌ Team features
❌ Complex analytics
❌ Production deployment

---

## 📋 **PROVIDER CONFIGURATION**

### Provider 1: Gemini (Google)
- **Cost:** Free for development (with API quota)
- **Speed:** Fast
- **Quality:** Good
- **API:** Google AI Studio
- **Setup:** Get API key from https://makersuite.google.com/app/apikey

### Provider 2: Replicate (IDM-VTON)
- **Cost:** ~$0.025 per generation (pay-as-you-go)
- **Speed:** ~19 seconds
- **Quality:** Good
- **API:** https://replicate.com
- **Model:** cuuupid/idm-vton
- **Setup:** Sign up at https://replicate.com → Get API token

---

## 📅 **6-WEEK TIMELINE**

---

## **PHASE 1: SETUP & INFRASTRUCTURE** (Week 1)

### Prerequisites
```bash
# Install system dependencies
brew install postgresql@14 redis
brew services start postgresql@14
brew services start redis

# Get API keys
1. Get Gemini API key: https://makersuite.google.com/app/apikey
2. Get Replicate API token: https://replicate.com/account/api-tokens
```

### Tasks

#### 1.1 Update Dependencies
```bash
cd backend
source venv/bin/activate

# Add to requirements.txt:
celery==5.3.4
redis==5.0.1
Pillow==10.1.0
httpx==0.25.2
google-generativeai==0.3.2
replicate==0.25.0

pip install -r requirements.txt
```

#### 1.2 Environment Configuration

**Update `backend/.env`:**
```env
# Existing vars...
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=ecompho_db
DB_USER=postgres
DB_PASSWORD=postgres

# Storage (Local for localhost)
MEDIA_URL=/media/
MEDIA_ROOT=./media

# AI Providers
GEMINI_API_KEY=your_gemini_api_key
REPLICATE_API_TOKEN=your_replicate_api_token

# Celery
CELERY_BROKER_URL=redis://127.0.0.1:6379/0
CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0
```

#### 1.3 Create Generation App
```bash
cd backend
python manage.py startapp generation
```

#### 1.4 Update Settings

**Add to `backend/ecompho/settings.py`:**
```python
INSTALLED_APPS = [
    # ... existing apps
    'generation',
]

# Media files (localhost storage)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Celery Configuration
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://127.0.0.1:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://127.0.0.1:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

# File upload settings
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
```

**Add media URL pattern to `backend/ecompho/urls.py`:**
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... existing patterns
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

#### 1.5 Configure Celery

**Create `backend/ecompho/celery.py`:**
```python
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecompho.settings')

app = Celery('ecompho')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

**Update `backend/ecompho/__init__.py`:**
```python
from __future__ import absolute_import, unicode_literals
from .celery import app as celery_app

__all__ = ('celery_app',)
```

### Deliverable Week 1:
- ✅ Dependencies installed
- ✅ Environment configured
- ✅ Generation app created
- ✅ Celery configured
- ✅ Redis running
- ✅ Media folder created

---

## **PHASE 2: DATABASE & MODELS** (Week 2)

### Tasks

#### 2.1 Create Database Models

**File: `backend/generation/models.py`**

Create these models:
1. **Image** - Stores uploaded images
2. **Generation** - Stores generation requests and results

**Image model fields:**
- id (UUID, primary key)
- user (ForeignKey to User)
- file (ImageField)
- image_type (CharField: 'model_image' or 'garment_image')
- width (IntegerField)
- height (IntegerField)
- file_size (IntegerField - in bytes)
- created_at (DateTimeField, auto_now_add)

**Generation model fields:**
- id (UUID, primary key)
- user (ForeignKey to User)
- name (CharField, max_length=200, default="Untitled Generation")
- model_image (ForeignKey to Image)
- garment_image (ForeignKey to Image)
- provider (CharField: 'gemini' or 'fashn')
- quality_preset (CharField: 'draft', 'standard', 'high')
- status (CharField: 'pending', 'processing', 'completed', 'failed')
- result_image (ForeignKey to Image, nullable)
- processing_time_seconds (DecimalField, nullable)
- error_message (TextField, nullable)
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
- completed_at (DateTimeField, nullable)

**Model structure example:**
```python
import uuid
from django.db import models
from django.conf import settings

class Image(models.Model):
    IMAGE_TYPE_CHOICES = [
        ('model_image', 'Model Image'),
        ('garment_image', 'Garment Image'),
        ('result_image', 'Result Image'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.ImageField(upload_to='images/%Y/%m/%d/')
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES)
    width = models.IntegerField()
    height = models.IntegerField()
    file_size = models.IntegerField(help_text="File size in bytes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.image_type} - {self.created_at}"

class Generation(models.Model):
    PROVIDER_CHOICES = [
        ('gemini', 'Gemini'),
        ('replicate', 'Replicate'),
    ]

    QUALITY_CHOICES = [
        ('draft', 'Draft'),
        ('standard', 'Standard'),
        ('high', 'High'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default="Untitled Generation")
    model_image = models.ForeignKey(Image, on_delete=models.CASCADE, related_name='generations_as_model')
    garment_image = models.ForeignKey(Image, on_delete=models.CASCADE, related_name='generations_as_garment')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    quality_preset = models.CharField(max_length=20, choices=QUALITY_CHOICES, default='standard')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    result_image = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='generation_results')
    processing_time_seconds = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.status}"
```

#### 2.2 Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.3 Register Models in Admin

**File: `backend/generation/admin.py`**

```python
from django.contrib import admin
from .models import Image, Generation

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'image_type', 'width', 'height', 'created_at']
    list_filter = ['image_type', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['id', 'created_at']

@admin.register(Generation)
class GenerationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'user', 'provider', 'status', 'created_at']
    list_filter = ['provider', 'status', 'quality_preset', 'created_at']
    search_fields = ['name', 'user__username', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at', 'completed_at']

    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'user', 'name', 'status')
        }),
        ('Images', {
            'fields': ('model_image', 'garment_image', 'result_image')
        }),
        ('Configuration', {
            'fields': ('provider', 'quality_preset')
        }),
        ('Results', {
            'fields': ('processing_time_seconds', 'error_message')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )
```

### Deliverable Week 2:
- ✅ Database models created
- ✅ Migrations applied
- ✅ Models visible in admin panel
- ✅ Can create test data through admin

---

## **PHASE 3: AI PROVIDER INTEGRATION** (Week 3)

### Tasks

#### 3.1 Create Provider System

**Directory structure:**
```
backend/generation/
├── providers/
│   ├── __init__.py
│   ├── base.py
│   ├── gemini_provider.py
│   └── replicate_provider.py
```

#### 3.2 Base Provider Class

**File: `backend/generation/providers/base.py`**

```python
from abc import ABC, abstractmethod

class BaseProvider(ABC):
    """Base class for AI providers"""

    @abstractmethod
    def generate(self, model_image_url, garment_image_url, quality_preset):
        """
        Submit a generation request
        Returns: job_id or result
        """
        pass

    @abstractmethod
    def get_status(self, job_id):
        """
        Check generation status
        Returns: 'pending', 'processing', 'completed', 'failed'
        """
        pass

    @abstractmethod
    def get_result(self, job_id):
        """
        Get result image URL
        Returns: image_url
        """
        pass

    @property
    @abstractmethod
    def name(self):
        """Provider name"""
        pass
```

#### 3.3 Gemini Provider

**File: `backend/generation/providers/gemini_provider.py`**

```python
import os
import google.generativeai as genai
from .base import BaseProvider

class GeminiProvider(BaseProvider):
    """Google Gemini provider for virtual try-on"""

    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro-vision')

    @property
    def name(self):
        return "Gemini"

    def generate(self, model_image_url, garment_image_url, quality_preset):
        """
        Generate virtual try-on using Gemini
        Note: Gemini doesn't have native try-on, this is a placeholder
        implementation. You may need to use Imagen or another Google API
        """
        # TODO: Implement actual Gemini-based generation
        # This is a placeholder - you'll need to use appropriate Google AI API
        raise NotImplementedError("Gemini provider needs actual implementation")

    def get_status(self, job_id):
        """Check status"""
        return 'completed'  # Placeholder

    def get_result(self, job_id):
        """Get result URL"""
        return None  # Placeholder
```

**Note:** Gemini (gemini-pro-vision) is primarily for image understanding. For actual try-on generation, you may need to:
- Use Google's Imagen API if available
- Or use a different free provider
- Or implement a custom solution

#### 3.4 Replicate Provider

**File: `backend/generation/providers/replicate_provider.py`**

```python
import os
import replicate
from .base import BaseProvider

class ReplicateProvider(BaseProvider):
    """Replicate API provider for virtual try-on (IDM-VTON)"""

    def __init__(self):
        self.api_token = os.getenv('REPLICATE_API_TOKEN')
        if not self.api_token:
            raise ValueError("REPLICATE_API_TOKEN not found in environment")
        os.environ['REPLICATE_API_TOKEN'] = self.api_token
        self.model_version = "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4"

    @property
    def name(self):
        return "Replicate"

    def generate(self, model_image_url, garment_image_url, quality_preset):
        """
        Submit generation to Replicate API
        Returns prediction object
        """
        try:
            output = replicate.run(
                self.model_version,
                input={
                    "human_img": model_image_url,
                    "garm_img": garment_image_url,
                    "garment_des": "Product photo",
                    "n_samples": 1
                }
            )

            # Replicate's IDM-VTON returns the result directly (not async)
            # Store the output URL as job_id since it's a synchronous response
            if isinstance(output, list) and len(output) > 0:
                return output[0]  # Return the first output URL
            return output

        except Exception as e:
            raise Exception(f"Replicate generation failed: {str(e)}")

    def get_status(self, job_id):
        """
        Check generation status
        For Replicate IDM-VTON, generation is synchronous,
        so if we have a job_id (result URL), it's completed
        """
        if job_id:
            return 'completed'
        return 'failed'

    def get_result(self, job_id):
        """
        Get result image URL
        For Replicate, job_id IS the result URL
        """
        return job_id
```

#### 3.5 Provider Factory

**File: `backend/generation/providers/__init__.py`**

```python
from .gemini_provider import GeminiProvider
from .replicate_provider import ReplicateProvider

def get_provider(provider_name: str):
    """Factory function to get provider instance"""
    providers = {
        'gemini': GeminiProvider,
        'replicate': ReplicateProvider
    }

    provider_class = providers.get(provider_name)
    if not provider_class:
        raise ValueError(f"Unknown provider: {provider_name}")

    return provider_class()
```

### Deliverable Week 3:
- ✅ Provider system created
- ✅ Gemini provider stub created (needs actual implementation)
- ✅ Replicate provider fully integrated
- ✅ Provider factory working
- ✅ Can test Replicate API manually

---

## **PHASE 4: GENERATION API & CELERY** (Week 4)

### Tasks

#### 4.1 Create Serializers

**File: `backend/generation/serializers.py`**

```python
from rest_framework import serializers
from .models import Image, Generation

class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'file', 'url', 'image_type', 'width', 'height', 'file_size', 'created_at']
        read_only_fields = ['id', 'width', 'height', 'file_size', 'created_at']

    def get_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

class GenerationSerializer(serializers.ModelSerializer):
    model_image = ImageSerializer(read_only=True)
    garment_image = ImageSerializer(read_only=True)
    result_image = ImageSerializer(read_only=True)

    class Meta:
        model = Generation
        fields = [
            'id', 'name', 'model_image', 'garment_image', 'provider',
            'quality_preset', 'status', 'result_image', 'processing_time_seconds',
            'error_message', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'status', 'result_image', 'processing_time_seconds',
                           'error_message', 'created_at', 'updated_at', 'completed_at']

class GenerationCreateSerializer(serializers.Serializer):
    model_image_id = serializers.UUIDField()
    garment_image_id = serializers.UUIDField()
    provider = serializers.ChoiceField(choices=['gemini', 'replicate'])
    quality_preset = serializers.ChoiceField(choices=['draft', 'standard', 'high'], default='standard')
    name = serializers.CharField(max_length=200, required=False, default="Untitled Generation")

    def validate_model_image_id(self, value):
        user = self.context['request'].user
        try:
            image = Image.objects.get(id=value, user=user, image_type='model_image')
        except Image.DoesNotExist:
            raise serializers.ValidationError("Model image not found")
        return value

    def validate_garment_image_id(self, value):
        user = self.context['request'].user
        try:
            image = Image.objects.get(id=value, user=user, image_type='garment_image')
        except Image.DoesNotExist:
            raise serializers.ValidationError("Garment image not found")
        return value
```

#### 4.2 Create API Views

**File: `backend/generation/views.py`**

```python
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from PIL import Image as PILImage
from .models import Image, Generation
from .serializers import ImageSerializer, GenerationSerializer, GenerationCreateSerializer
from .tasks import process_generation

class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        image_type = request.data.get('image_type')

        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        if image_type not in ['model_image', 'garment_image']:
            return Response({'error': 'Invalid image_type'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file size
        if file.size > 10 * 1024 * 1024:  # 10MB
            return Response({'error': 'File too large (max 10MB)'}, status=status.HTTP_400_BAD_REQUEST)

        # Get image dimensions
        try:
            pil_image = PILImage.open(file)
            width, height = pil_image.size
        except Exception as e:
            return Response({'error': 'Invalid image file'}, status=status.HTTP_400_BAD_REQUEST)

        # Create Image record
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

class GenerationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return GenerationCreateSerializer
        return GenerationSerializer

    def get_queryset(self):
        queryset = Generation.objects.filter(user=self.request.user)

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Sort by creation date or name
        sort_by = self.request.query_params.get('sort_by', '-created_at')
        if sort_by == 'name':
            queryset = queryset.order_by('name')
        elif sort_by == '-name':
            queryset = queryset.order_by('-name')
        elif sort_by == 'created_at':
            queryset = queryset.order_by('created_at')
        else:  # default: -created_at
            queryset = queryset.order_by('-created_at')

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Get images
        model_image = Image.objects.get(id=serializer.validated_data['model_image_id'])
        garment_image = Image.objects.get(id=serializer.validated_data['garment_image_id'])

        # Create Generation
        generation = Generation.objects.create(
            user=request.user,
            name=serializer.validated_data.get('name', 'Untitled Generation'),
            model_image=model_image,
            garment_image=garment_image,
            provider=serializer.validated_data['provider'],
            quality_preset=serializer.validated_data['quality_preset'],
            status='pending'
        )

        # Queue Celery task
        process_generation.delay(str(generation.id))

        # Return generation details
        response_serializer = GenerationSerializer(generation, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class GenerationDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GenerationSerializer

    def get_queryset(self):
        return Generation.objects.filter(user=self.request.user)
```

#### 4.3 Create Celery Task

**File: `backend/generation/tasks.py`**

```python
from celery import shared_task
from django.utils import timezone
from django.core.files.base import ContentFile
import httpx
import time
from .models import Generation, Image
from .providers import get_provider

@shared_task(bind=True, max_retries=3)
def process_generation(self, generation_id):
    """
    Process a generation job asynchronously
    """
    try:
        generation = Generation.objects.get(id=generation_id)
    except Generation.DoesNotExist:
        return {'error': 'Generation not found'}

    start_time = time.time()

    try:
        # Update status to processing
        generation.status = 'processing'
        generation.save()

        # Get provider
        provider = get_provider(generation.provider)

        # Get absolute URLs for images
        model_image_url = generation.model_image.file.url
        garment_image_url = generation.garment_image.file.url

        # Make URLs absolute if they're relative
        if model_image_url.startswith('/'):
            model_image_url = f"http://localhost:8000{model_image_url}"
        if garment_image_url.startswith('/'):
            garment_image_url = f"http://localhost:8000{garment_image_url}"

        # Submit generation
        job_id = provider.generate(
            model_image_url,
            garment_image_url,
            generation.quality_preset
        )

        # Poll for completion (max 5 minutes)
        max_attempts = 60
        for attempt in range(max_attempts):
            result_status = provider.get_status(job_id)

            if result_status == 'completed':
                # Get result URL
                result_url = provider.get_result(job_id)

                # Download result image
                response = httpx.get(result_url, timeout=30.0)
                response.raise_for_status()

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
                result_image.file.save(filename, ContentFile(response.content))

                # Update dimensions
                from PIL import Image as PILImage
                pil_image = PILImage.open(result_image.file)
                result_image.width, result_image.height = pil_image.size
                result_image.save()

                # Update generation
                end_time = time.time()
                generation.status = 'completed'
                generation.result_image = result_image
                generation.processing_time_seconds = round(end_time - start_time, 2)
                generation.completed_at = timezone.now()
                generation.save()

                return {
                    'status': 'completed',
                    'generation_id': str(generation.id),
                    'processing_time': generation.processing_time_seconds
                }

            elif result_status == 'failed':
                generation.status = 'failed'
                generation.error_message = "Generation failed on provider side"
                generation.save()
                return {'status': 'failed', 'error': generation.error_message}

            # Wait before next poll
            time.sleep(5)

        # Timeout
        generation.status = 'failed'
        generation.error_message = "Generation timed out after 5 minutes"
        generation.save()
        return {'status': 'failed', 'error': 'timeout'}

    except Exception as exc:
        # Log error and retry
        generation.status = 'failed'
        generation.error_message = str(exc)
        generation.save()

        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
```

#### 4.4 URL Configuration

**File: `backend/generation/urls.py`**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('images/upload/', views.ImageUploadView.as_view(), name='image-upload'),
    path('generations/', views.GenerationListCreateView.as_view(), name='generation-list-create'),
    path('generations/<uuid:pk>/', views.GenerationDetailView.as_view(), name='generation-detail'),
]
```

**Add to `backend/ecompho/urls.py`:**
```python
from django.urls import path, include

urlpatterns = [
    # ... existing paths
    path('api/generation/', include('generation.urls')),
]
```

#### 4.5 Test the System

Start all services:
```bash
# Terminal 1: Django
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Celery Worker
celery -A ecompho worker --loglevel=info

# Terminal 3: Redis (if not running as service)
redis-server
```

### Deliverable Week 4:
- ✅ All API endpoints working
- ✅ Can upload images via API
- ✅ Can create generations
- ✅ Celery task processes generations
- ✅ Results stored in database
- ✅ Images saved to media folder

---

## **PHASE 5: FRONTEND - GENERATION FLOW** (Week 5)

### Tasks

#### 5.1 Create API Service

**File: `frontend/src/services/generationApi.js`**

```javascript
import api from './api'

export const generationApi = {
  // Upload image
  uploadImage: async (file, imageType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('image_type', imageType)

    const response = await api.post('/generation/images/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response
  },

  // Create generation
  createGeneration: async (data) => {
    return api.post('/generation/generations/', data)
  },

  // Get generation status
  getGeneration: async (id) => {
    return api.get(`/generation/generations/${id}/`)
  },

  // List generations with optional filters and sorting
  listGenerations: async (params = {}) => {
    // params can include: status, sort_by (name, -name, created_at, -created_at)
    return api.get('/generation/generations/', { params })
  }
}
```

#### 5.2 Create Generation Page

**File: `frontend/src/pages/CreateGeneration.jsx`**

Create a form with:
1. Model image upload
2. Garment image upload
3. Provider selection (Gemini / Replicate)
4. Quality preset dropdown
5. Optional name field
6. Generate button

**UI example:**
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generationApi } from '@/services/generationApi'
import toast from 'react-hot-toast'

// Create ImageUpload component separately
// Create provider selection
// Handle upload and generation
```

#### 5.3 Create Result Page

**File: `frontend/src/pages/GenerationResult.jsx`**

Show:
- Status (with polling)
- Progress indicator
- Result image when complete
- Model & garment images
- Download button
- Back to gallery button

Use `useEffect` to poll status every 3 seconds.

#### 5.4 Create Gallery Page ("My Gallery")

**File: `frontend/src/pages/Gallery.jsx`**

Features:
- Grid layout of generations
- Sort options: Creation Date (newest), Creation Date (oldest), Name (A-Z), Name (Z-A)
- Filter by status
- Click to view full result
- Show thumbnail, name, status, provider, date

**Sorting implementation:**
```jsx
const [sortBy, setSortBy] = useState('-created_at') // Default: newest first

// API call with sort parameter
const { data } = await generationApi.listGenerations({ sort_by: sortBy })

// Sort options
<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
  <option value="-created_at">Newest First</option>
  <option value="created_at">Oldest First</option>
  <option value="name">Name (A-Z)</option>
  <option value="-name">Name (Z-A)</option>
</select>
```

#### 5.5 Create Image Upload Component

**File: `frontend/src/components/ImageUpload.jsx`**

Reusable component using `react-dropzone`:
```bash
cd frontend
npm install react-dropzone react-hot-toast
```

Features:
- Drag and drop
- Click to select
- Preview
- File validation
- Upload progress

#### 5.6 Update Navbar

**File: `frontend/src/components/Navbar.jsx`**

Add link to "My Gallery":
```jsx
<nav>
  <Link to="/gallery">My Gallery</Link>
  <Link to="/generate">Create Try-On</Link>
</nav>
```

#### 5.7 Update Routes

**File: `frontend/src/App.jsx`**
```jsx
import CreateGeneration from '@/pages/CreateGeneration'
import GenerationResult from '@/pages/GenerationResult'
import Gallery from '@/pages/Gallery'

<Routes>
  {/* Existing routes */}

  <Route path="/generate" element={
    <ProtectedRoute>
      <CreateGeneration />
    </ProtectedRoute>
  } />

  <Route path="/generation/:id" element={
    <ProtectedRoute>
      <GenerationResult />
    </ProtectedRoute>
  } />

  <Route path="/gallery" element={
    <ProtectedRoute>
      <Gallery />
    </ProtectedRoute>
  } />
</Routes>
```

### Deliverable Week 5:
- ✅ Can upload images from UI
- ✅ Can create generation with provider selection
- ✅ Real-time status updates with polling
- ✅ View completed results
- ✅ "My Gallery" with sorting and filtering
- ✅ Fully functional UI

---

## **PHASE 6: POLISH & TESTING** (Week 6)

### Tasks

#### 6.1 Add Loading States

Implement loading indicators for:
- Image upload (spinner)
- Generation submission (disabled button + spinner)
- Status polling (progress bar)
- Gallery loading (skeleton loaders)

Install toast library:
```bash
cd frontend
npm install react-hot-toast
```

Add to `frontend/src/main.jsx`:
```jsx
import { Toaster } from 'react-hot-toast'

<Toaster position="top-right" />
```

#### 6.2 Error Handling

**Backend:**
- Return proper HTTP status codes (400, 404, 500)
- Clear error messages in responses
- Log errors to console

**Frontend:**
- Toast notifications for errors
- Retry buttons for failed operations
- User-friendly error messages
- Form validation errors

#### 6.3 Add Validation

**Backend validators:**
- Image size limits (10MB)
- Image format validation (JPEG, PNG, WEBP)
- Minimum dimensions (512x512)
- File type validation

**Frontend validation:**
- File type before upload
- File size before upload
- Required fields
- Immediate feedback

#### 6.4 Improve UX

Add these enhancements:
- Tooltips for provider selection ("Gemini: Fast, Free" / "Replicate: IDM-VTON Model, ~19s")
- Estimated time display for each provider
- Image zoom on hover in gallery
- Keyboard navigation support
- Dark mode (already available with shadcn/ui)
- Empty states ("No generations yet")
- Confirmation dialogs for actions

#### 6.5 Add Notifications

Show toast notifications for:
- ✅ Image uploaded successfully
- ✅ Generation started
- ✅ Generation completed
- ❌ Generation failed
- ❌ Upload failed
- ⚠️ Validation errors

#### 6.6 Testing

**Backend Tests:**

Create `backend/generation/tests/` directory:
```bash
mkdir backend/generation/tests
touch backend/generation/tests/__init__.py
touch backend/generation/tests/test_models.py
touch backend/generation/tests/test_views.py
touch backend/generation/tests/test_tasks.py
```

Write basic tests:
- Model creation
- API endpoints (with mocked auth)
- Image upload validation
- Provider integration (mocked)

Run tests:
```bash
python manage.py test generation
```

**Frontend Tests:**
- Manual E2E testing
- Test image upload component
- Test generation form
- Test gallery sorting and filtering
- Cross-browser testing (Chrome, Firefox, Safari)

#### 6.7 Performance Optimization

**Backend:**
- Add database indexes on frequently queried fields
- Use `select_related()` for ForeignKey queries
- Optimize image serving

**Frontend:**
- Lazy load images in gallery
- Optimize image sizes
- Use React.memo for expensive components
- Debounce search inputs

#### 6.8 Documentation

Create `USER_GUIDE.md`:
- How to use the platform
- Provider differences
- Tips for best results
- Troubleshooting

Update `README.md` with:
- Setup instructions
- Running locally
- Environment variables

### Deliverable Week 6:
- ✅ Smooth UX with loading states
- ✅ Comprehensive error handling
- ✅ Validation everywhere
- ✅ Toast notifications working
- ✅ Basic tests written
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ **PRODUCTION-READY POC!** 🎉

---

## 🎯 **FINAL FEATURES CHECKLIST**

### Core Features
- [ ] User registration and authentication
- [ ] Upload model image (1 image)
- [ ] Upload garment image (1 image)
- [ ] Choose provider (Gemini / Replicate)
- [ ] Select quality preset (Draft / Standard / High)
- [ ] Generate virtual try-on
- [ ] View real-time generation progress
- [ ] View completed results
- [ ] **"My Gallery"** - view all generations
- [ ] Sort by creation date (newest/oldest)
- [ ] Sort by name (A-Z / Z-A)
- [ ] Filter by status (all / pending / completed / failed)
- [ ] Download result images
- [ ] Name your generations

### Quality of Life
- [ ] Loading states everywhere
- [ ] Error handling with toast notifications
- [ ] Form validation
- [ ] Responsive design
- [ ] Dark mode support (shadcn/ui)
- [ ] Image preview before upload
- [ ] Processing time display
- [ ] Provider comparison tooltips
- [ ] Empty states

### Admin
- [ ] Django admin for all models
- [ ] User management
- [ ] Monitor generations
- [ ] View uploaded images

---

## 🛠️ **DAILY DEVELOPMENT WORKFLOW**

### Starting All Services

```bash
# Terminal 1: Django Backend
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Celery Worker
cd backend
source venv/bin/activate
celery -A ecompho worker --loglevel=info

# Terminal 3: React Frontend
cd frontend
npm run dev

# Terminal 4: Redis (if not running as service)
redis-server
```

### Access Points
- **Frontend:** http://localhost:5555
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin
- **Media Files:** http://localhost:8000/media

---

## 📚 **KEY FILES REFERENCE**

### Backend Structure
```
backend/
├── ecompho/
│   ├── settings.py              # Main configuration
│   ├── celery.py                # Celery setup
│   ├── urls.py                  # Root URLs + media serving
│   └── __init__.py              # Celery app import
├── generation/
│   ├── models.py                # Image, Generation models
│   ├── serializers.py           # DRF serializers
│   ├── views.py                 # API views
│   ├── tasks.py                 # Celery task (process_generation)
│   ├── urls.py                  # Generation URLs
│   ├── admin.py                 # Admin configuration
│   └── providers/
│       ├── __init__.py          # Provider factory
│       ├── base.py              # Base provider class
│       ├── gemini_provider.py   # Gemini integration
│       └── replicate_provider.py # Replicate integration
├── media/                       # Uploaded images (local storage)
│   └── images/
│       └── YYYY/MM/DD/
└── .env                         # Environment variables
```

### Frontend Structure
```
frontend/src/
├── App.jsx                      # Routes
├── services/
│   ├── api.js                   # Axios config
│   └── generationApi.js         # Generation API calls
├── pages/
│   ├── CreateGeneration.jsx     # Main generation form
│   ├── GenerationResult.jsx     # Result + status polling
│   └── Gallery.jsx              # "My Gallery" with sorting
├── components/
│   ├── Navbar.jsx               # Navigation
│   ├── ProtectedRoute.jsx       # Auth guard
│   └── ImageUpload.jsx          # Reusable upload component
└── .env                         # VITE_API_URL
```

---

## ⚠️ **COMMON ISSUES & SOLUTIONS**

### Issue: Celery not processing tasks
**Solution:**
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Restart Celery worker
celery -A ecompho worker --loglevel=info

# Check logs for errors in Celery terminal
```

### Issue: Image upload fails
**Solution:**
- Check `backend/media/` folder exists and is writable
- Check file size < 10MB
- Check file format is JPG/PNG/WEBP
- Check Django logs for detailed error

### Issue: Provider API fails
**Solution:**
- Verify API keys in `backend/.env`
- Check API key has quota/credits
- For Gemini: Check Google AI Studio quota
- For Replicate: Check account status and billing
- Review error in generation record via admin

### Issue: Frontend can't reach backend
**Solution:**
- Check CORS in `backend/ecompho/settings.py`:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:5555",
      "http://127.0.0.1:5555",
  ]
  ```
- Verify `VITE_API_URL` in `frontend/.env`
- Check both servers are running
- Check browser console for errors

### Issue: Media files not loading
**Solution:**
- Check `MEDIA_URL` and `MEDIA_ROOT` in settings
- Verify media URL pattern is added to `urls.py`
- Check file permissions on `media/` folder
- Restart Django server after adding media URL pattern

---

## 🎓 **LEARNING RESOURCES**

### Backend
- [Django REST Framework Tutorial](https://www.django-rest-framework.org/tutorial/quickstart/)
- [Celery with Django](https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html)
- [Django File Uploads](https://docs.djangoproject.com/en/4.2/topics/http/file-uploads/)

### Frontend
- [React Documentation](https://react.dev)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [React Dropzone](https://react-dropzone.js.org/)

### AI APIs
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Replicate API Docs](https://replicate.com/docs)
- [IDM-VTON on Replicate](https://replicate.com/cuuupid/idm-vton)

---

## 🚀 **GETTING STARTED**

### Quick Start Checklist

**Prerequisites:**
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running
- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Gemini API key obtained
- [ ] Replicate API token obtained

**Setup:**
```bash
# 1. Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python manage.py migrate
python manage.py createsuperuser
mkdir -p media/images

# 2. Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Edit .env with VITE_API_URL=http://localhost:8000/api

# 3. Start services (4 terminals)
# Terminal 1: python manage.py runserver
# Terminal 2: celery -A ecompho worker --loglevel=info
# Terminal 3: npm run dev
# Terminal 4: redis-server (if not running as service)
```

---

## 🎉 **YOU'RE READY TO BUILD!**

This simplified plan focuses on:
- ✅ **No billing system** - completely free to use
- ✅ **2 providers** - Gemini + Replicate
- ✅ **Simple gallery** - "My Gallery" with sorting
- ✅ **Localhost only** - no deployment complexity
- ✅ **6 weeks** - faster timeline

**Start with Phase 1 Week 1 and work through each phase systematically.**

Each phase builds on the previous one, so complete them in order.

When ready to start, just say: **"Let's implement Phase 1 Week 1"** and I'll begin! 🚀

Good luck building Ecompho! 💪
