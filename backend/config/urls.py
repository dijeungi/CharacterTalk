from django.urls import path, include

# config/urls.py
urlpatterns = [
    path('api/', include('api.urls')),
]