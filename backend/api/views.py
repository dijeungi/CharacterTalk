# backend/api/views.py

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import ai_service

class ImageGenerationView(APIView):
    def post(self, request, *args, **kwargs):
        korean_prompt = request.data.get('prompt')
        width = int(request.data.get('width', 832))
        height = int(request.data.get('height', 1216))
        num_images = int(request.data.get('num_images', 1))

        if not korean_prompt:
            return Response({"error": "프롬프트(prompt)를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        # 옵션 선택으로 인한 코드 미사용
        # if not 1 <= num_images <= 3:
        #     return Response({"error": "이미지 생성은 최대 3장 입니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            print("API View: 이미지 생성 요청 수신. 서비스 호출 시작...")
            image_urls = ai_service.generate_image(korean_prompt, width, height, num_images)
            print("API View: 서비스 작업 완료. 응답 반환.")
            
            return Response({
                "message": "이미지가 성공적으로 생성되었습니다.",
                "image_urls": image_urls
            }, status=status.HTTP_201_CREATED)

        # Error
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

