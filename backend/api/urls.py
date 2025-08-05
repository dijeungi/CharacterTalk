"""
@file         backend/api/urls.py
@desc         API 엔드포인트 URL 설정 파일
 
@summary      urlpatterns 정의
@description  이미지 생성 및 메시지 반응 API에 대한 URL 경로를 해당 뷰에 매핑합니다.

@author       최준호
@update       2025.08.05
"""
from django.urls import path
from .views import ImageGenerationView

urlpatterns = [
    path('generate/', ImageGenerationView.as_view(), name='generate-image'),
]
