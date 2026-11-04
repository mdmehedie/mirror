"""
URL configuration for ecompho project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from generation.merchant_views import (
    MerchantGenerationCreateView, MerchantGenerationDetailView, MerchantGenerationImageView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/generation/', include('generation.urls')),
    path('api/v1/generations/', MerchantGenerationCreateView.as_view(), name='merchant-generation-create'),
    path('api/v1/generations/<uuid:pk>/', MerchantGenerationDetailView.as_view(), name='merchant-generation-detail'),
    path('api/v1/generations/<uuid:pk>/image/', MerchantGenerationImageView.as_view(), name='merchant-generation-image'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
