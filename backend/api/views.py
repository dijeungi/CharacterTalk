"""
@file         backend/api/views.py
@desc         API 뷰 정의 파일
 
@summary      ImageGenerationView 클래스 정의
@description  Django REST Framework의 APIView를 상속받아 각 API 엔드포인트의 요청/응답 로직을 처리합니다.

@author       최준호
@update       2025.08.05
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services.ai_service import ai_service
from .models import ChatMessage

class ImageGenerationView(APIView):
    """AI를 이용한 이미지 생성을 처리하는 뷰"""
    def post(self, request, *args, **kwargs):
        korean_prompt = request.data.get('prompt')
        width = int(request.data.get('width', 832))
        height = int(request.data.get('height', 1216))
        num_images = int(request.data.get('num_images', 1))

        if not korean_prompt:
            return Response({"error": "프롬프트(prompt)를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            print("API View: 이미지 생성 요청 수신. 서비스 호출 시작...")
            image_urls = ai_service.generate_image(korean_prompt, width, height, num_images)
            print("API View: 서비스 작업 완료. 응답 반환.")
            
            return Response({
                "message": "이미지가 성공적으로 생성되었습니다.",
                "image_urls": image_urls
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)