from django.contrib import admin
from django.utils.html import format_html
from .models import Image, Generation


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'image_type',
        'thumbnail_preview',
        'dimensions',
        'file_size_mb',
        'created_at'
    ]
    list_filter = ['image_type', 'created_at']
    search_fields = ['user__username', 'user__email', 'id']
    readonly_fields = ['id', 'created_at', 'thumbnail_preview']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'user', 'image_type')
        }),
        ('File Details', {
            'fields': ('file', 'thumbnail_preview', 'width', 'height', 'file_size')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

    def thumbnail_preview(self, obj):
        """Display thumbnail in admin"""
        if obj.file:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.file.url
            )
        return "-"
    thumbnail_preview.short_description = 'Preview'

    def dimensions(self, obj):
        """Display image dimensions"""
        return f"{obj.width} x {obj.height}"
    dimensions.short_description = 'Dimensions'

    def file_size_mb(self, obj):
        """Display file size in MB"""
        size_mb = obj.file_size / (1024 * 1024)
        return f"{size_mb:.2f} MB"
    file_size_mb.short_description = 'File Size'


@admin.register(Generation)
class GenerationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'user',
        'provider',
        'status_badge',
        'processing_time_seconds',
        'created_at'
    ]
    list_filter = ['provider', 'status', 'quality_preset', 'category', 'created_at']
    search_fields = ['name', 'user__username', 'user__email', 'id']
    readonly_fields = ['id', 'created_at', 'updated_at', 'completed_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'user', 'name', 'status')
        }),
        ('Images', {
            'fields': ('model_image', 'garment_image', 'result_image')
        }),
        ('Configuration', {
            'fields': ('provider', 'quality_preset', 'category', 'garment_description')
        }),
        ('Results', {
            'fields': ('processing_time_seconds', 'error_message')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )

    def status_badge(self, obj):
        """Display colored status badge"""
        colors = {
            'pending': '#FFA500',      # Orange
            'processing': '#2196F3',   # Blue
            'completed': '#4CAF50',    # Green
            'failed': '#F44336',       # Red
        }
        color = colors.get(obj.status, '#999999')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def get_queryset(self, request):
        """Optimize queries with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related(
            'user',
            'model_image',
            'garment_image',
            'result_image'
        )
