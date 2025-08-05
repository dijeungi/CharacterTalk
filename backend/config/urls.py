"""
@file         backend/config/urls.py
@desc         최상위 URL 설정 파일
 
@summary      urlpatterns 정의
@description  프로젝트의 전체 URL 구조를 정의하고, 'api/' 경로로 들어오는 요청을 `api.urls` 모듈로 위임합니다.

@author       최준호
@update       2025.08.05
"""
from django.urls import path, include

# config/urls.py
urlpatterns = [
    path('api/', include('api.urls')),
]