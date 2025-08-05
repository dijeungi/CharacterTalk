"""
@file         backend/api/services/r2_client.py
@desc         Cloudflare R2 스토리지 클라이언트 유틸리티 파일
 
@summary      get_r2_client, test_r2_connection 함수 정의
@description  Boto3를 사용하여 Cloudflare R2 스토리지 서비스와 상호작용하는 클라이언트를 생성하고 연결을 테스트합니다.

@author       최준호
@update       2025.08.05
"""
import sys
import boto3
from botocore.config import Config
from django.conf import settings

def get_r2_client():
    return boto3.client(
        's3',
        endpoint_url=settings.R2_ENDPOINT_URL,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        config=Config(signature_version='s3v4')
    )

def test_r2_connection():
    try:
        client = get_r2_client()
        client.list_objects_v2(Bucket=settings.R2_BUCKET_NAME)
        print("[✔] R2 연결 성공")
    except Exception as e:
        print(f"[✘] R2 연결 실패: {e}")
        sys.exit(1)
