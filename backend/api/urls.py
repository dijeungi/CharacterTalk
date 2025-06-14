# backend/api/urls.py

from django.urls import path
from .views import ImageGenerationView

urlpatterns = [
    path('generate/', ImageGenerationView.as_view(), name='generate-image'),
]
