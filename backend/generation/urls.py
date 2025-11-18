from django.urls import path
from . import views

app_name = 'generation'

urlpatterns = [
    # Image upload endpoint
    path(
        'images/upload/',
        views.ImageUploadView.as_view(),
        name='image-upload'
    ),

    # Generation endpoints
    path(
        'generations/',
        views.GenerationListCreateView.as_view(),
        name='generation-list-create'
    ),
    path(
        'generations/<uuid:pk>/',
        views.GenerationDetailView.as_view(),
        name='generation-detail'
    ),
]
