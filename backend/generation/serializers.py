from rest_framework import serializers
from .models import Image, Generation


class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for Image model.
    Provides full image details including absolute URL.
    """
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = [
            'id',
            'file',
            'url',
            'image_type',
            'width',
            'height',
            'file_size',
            'created_at'
        ]
        read_only_fields = ['id', 'width', 'height', 'file_size', 'created_at']

    def get_url(self, obj):
        """Get absolute URL for the image file."""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class GenerationSerializer(serializers.ModelSerializer):
    """
    Serializer for Generation model with nested image details.
    Used for listing and retrieving generation records.
    """
    model_image = ImageSerializer(read_only=True)
    garment_image = ImageSerializer(read_only=True)
    result_image = ImageSerializer(read_only=True)

    class Meta:
        model = Generation
        fields = [
            'id',
            'name',
            'model_image',
            'garment_image',
            'provider',
            'quality_preset',
            'category',
            'garment_description',
            'status',
            'result_image',
            'processing_time_seconds',
            'error_message',
            'created_at',
            'updated_at',
            'completed_at'
        ]
        read_only_fields = [
            'id',
            'status',
            'result_image',
            'processing_time_seconds',
            'error_message',
            'created_at',
            'updated_at',
            'completed_at'
        ]


class GenerationCreateSerializer(serializers.Serializer):
    """
    Serializer for creating new generation requests.
    Validates image IDs and provider/quality settings.
    """
    model_image_id = serializers.UUIDField(
        help_text="UUID of the model/person image"
    )
    garment_image_id = serializers.UUIDField(
        help_text="UUID of the garment/clothing image"
    )
    provider = serializers.ChoiceField(
        choices=['gemini', 'replicate'],
        help_text="AI provider to use for generation"
    )
    quality_preset = serializers.ChoiceField(
        choices=['draft', 'standard', 'high'],
        default='standard',
        help_text="Quality preset for generation"
    )
    name = serializers.CharField(
        max_length=200,
        required=False,
        default="Untitled Generation",
        help_text="Optional name for this generation"
    )
    category = serializers.ChoiceField(
        choices=['upper_body', 'lower_body', 'dresses'],
        default='upper_body',
        help_text="Garment category: upper_body, lower_body, or dresses"
    )
    garment_description = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Optional description of the garment or specific requirements"
    )

    def validate_model_image_id(self, value):
        """
        Validate that the model image exists and belongs to the user.
        """
        user = self.context['request'].user
        try:
            image = Image.objects.get(
                id=value,
                user=user,
                image_type='model_image'
            )
        except Image.DoesNotExist:
            raise serializers.ValidationError(
                "Model image not found or does not belong to you"
            )
        return value

    def validate_garment_image_id(self, value):
        """
        Validate that the garment image exists and belongs to the user.
        """
        user = self.context['request'].user
        try:
            image = Image.objects.get(
                id=value,
                user=user,
                image_type='garment_image'
            )
        except Image.DoesNotExist:
            raise serializers.ValidationError(
                "Garment image not found or does not belong to you"
            )
        return value

    def validate(self, data):
        """
        Cross-field validation.
        """
        # Ensure model and garment images are different
        if data.get('model_image_id') == data.get('garment_image_id'):
            raise serializers.ValidationError(
                "Model image and garment image must be different"
            )

        return data
