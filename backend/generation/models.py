import uuid
from django.db import models
from django.conf import settings


class Image(models.Model):
    """
    Model for storing uploaded images (model images, garment images, and result images)
    """
    IMAGE_TYPE_CHOICES = [
        ('model_image', 'Model Image'),
        ('garment_image', 'Garment Image'),
        ('result_image', 'Result Image'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='images'
    )
    file = models.ImageField(upload_to='images/%Y/%m/%d/')
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES)
    width = models.IntegerField()
    height = models.IntegerField()
    file_size = models.IntegerField(help_text="File size in bytes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['image_type']),
        ]

    def __str__(self):
        return f"{self.get_image_type_display()} - {self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class Generation(models.Model):
    """
    Model for tracking virtual try-on generation requests and results
    """
    PROVIDER_CHOICES = [
        ('gemini', 'Google Gemini'),
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
        ('closed', 'Closed'),
    ]

    CATEGORY_CHOICES = [
        ('upper_body', 'Upper Body (T-shirts, Shirts, Jackets, etc.)'),
        ('lower_body', 'Lower Body (Pants, Skirts, Shorts, etc.)'),
        ('dresses', 'Dresses (Full-body dresses)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='generations'
    )
    name = models.CharField(max_length=200, default="Untitled Generation")

    # Input images
    model_image = models.ForeignKey(
        Image,
        on_delete=models.CASCADE,
        related_name='generations_as_model'
    )
    garment_image = models.ForeignKey(
        Image,
        on_delete=models.CASCADE,
        related_name='generations_as_garment'
    )

    # Configuration
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    quality_preset = models.CharField(
        max_length=20,
        choices=QUALITY_CHOICES,
        default='standard'
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='upper_body',
        help_text="Garment category for virtual try-on"
    )

    # Customization options (optional text description)
    garment_description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of the garment or specific requirements"
    )

    # Status and results
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    result_image = models.ForeignKey(
        Image,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generation_results'
    )

    # Metrics
    processing_time_seconds = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total processing time in seconds"
    )
    error_message = models.TextField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['provider']),
        ]

    def __str__(self):
        return f"{self.name} - {self.get_status_display()} - {self.user.username}"

    @property
    def is_complete(self):
        """Check if generation is completed"""
        return self.status == 'completed'

    @property
    def is_failed(self):
        """Check if generation failed"""
        return self.status == 'failed'

    @property
    def is_processing(self):
        """Check if generation is currently processing"""
        return self.status in ['pending', 'processing']
