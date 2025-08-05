"""
@file         backend/config/settings.py
@desc         Django 프로젝트 설정 파일
 
@summary      프로젝트의 주요 설정 변수 정의
@description  데이터베이스, 설치된 앱, 미들웨어, 정적 파일, 인증, CORS, 외부 API 키 등 프로젝트 전반의 설정을 구성합니다.

@author       최준호
@update       2025.08.05
"""
from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

# 기본 경로 및 환경 변수 설정
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

# env
SECRET_KEY = os.getenv('SECRET_KEY')
HUGGING_FACE_TOKEN = os.getenv('HUGGING_FACE_TOKEN')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')

# Domain List
ALLOWED_HOSTS = ['*']

# Application
INSTALLED_APPS = [
    'daphne',
    # default
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # add
    'rest_framework',
    'api',
    'corsheaders',
    'channels',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# URL
ROOT_URLCONF = 'config.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Asynchronous Server Gateway Interface
ASGI_APPLICATION = 'config.asgi.application'

# DB
DATABASES = {
    'default': dj_database_url.config(env='POSTGRESQL_URL', conn_max_age=600, ssl_require=False)
}


# Password
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# 언어와 시간을 맞게 설정
LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'

USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Media files (User uploaded files)
# 생성된 이미지를 저장하고 웹에서 접근하기 위한 설정입니다.
MEDIA_URL = '/Users/junho/Desktop/CharacterTalk/backend/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# 클라우드 플레어 R2 스토리지 저장 서버 URL
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
R2_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL")

# Channel settings
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
