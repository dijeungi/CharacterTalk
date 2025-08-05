"""
@file         backend/config/wsgi.py
@desc         WSGI 서버 설정 파일
 
@summary      application 변수 정의
@description  프로덕션 환경에서 Django 애플리케이션을 실행하기 위한 WSGI 애플리케이션을 설정합니다.

@author       최준호
@update       2025.08.05
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()