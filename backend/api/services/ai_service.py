"""
@file         backend/api/services/ai_service.py
@desc         AI 모델을 이용한 이미지 생성 서비스 파일
 
@summary      AIGenerationService 클래스 정의
@description  Hugging Face의 DiffusionPipeline을 사용하여 한국어 프롬프트를 영어로 번역하고, 이를 기반으로 이미지를 생성하여 R2 스토리지에 업로드합니다.

@author       최준호
@update       2025.08.05
"""

import uuid
import torch

from PIL import Image
from django.conf import settings
from diffusers import DiffusionPipeline
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from .r2_client import get_r2_client, test_r2_connection
from io import BytesIO

class AIGenerationService:
    def __init__(self):
        
        test_r2_connection()
        
        self.s3_client = get_r2_client()
        
        print("[!] AI 모델 로딩 중 입니다.")
        self.device = self._get_device()
        
        hf_token = settings.HUGGING_FACE_TOKEN
        
        # 1. 번역 모델 로드
        translator_model_name = 'Helsinki-NLP/opus-mt-ko-en'
        self.translator_tokenizer = AutoTokenizer.from_pretrained(translator_model_name, token=hf_token)
        self.translator_model = AutoModelForSeq2SeqLM.from_pretrained(translator_model_name, token=hf_token)
        self.translator_model.to(self.device)
        
        # 2. 이미지 생성 모델 로드
        self.image_pipeline = DiffusionPipeline.from_pretrained(
            "cagliostrolab/animagine-xl-3.1",
            torch_dtype=torch.float16,
            use_safetensors=True,
            token=hf_token
        )
        self.image_pipeline.to(self.device)
        print(f"모든 AI 모델 로딩 완료. Device: {self.device}")

        
    #GPU (Cuda or MPS)
    def _get_device(self):
        if torch.cuda.is_available():
            return "cuda"
        if torch.backends.mps.is_available():
            return "mps"
        return "cpu"
    
    # 번역
    def translate_ko_to_en(self, text: str) -> str:
        inputs = self.translator_tokenizer(text, return_tensors="pt", max_length=512, truncation=True).to(self.device)
        outputs = self.translator_model.generate(**inputs, max_length=512, num_beams=4, early_stopping=True)
        return self.translator_tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # 프로필 생성 prompt
    def create_tagged_prompt(self, english_prompt: str) -> tuple[str, str]:
        quality_tags = "masterpiece, best quality, very aesthetic, absurdres,"
        user_tags = english_prompt.replace(" ", ", ")
        positive_prompt = f"{quality_tags} {user_tags}"
        negative_prompt = "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]"
        return positive_prompt, negative_prompt
    
    # 합체
    def generate_image(self, korean_prompt: str, width: int, height: int, num_images: int) -> list[str]:
        english_prompt = self.translate_ko_to_en(korean_prompt)
        print(f"[!] 번역된 프롬프트: {english_prompt}")
        positive_prompt, negative_prompt = self.create_tagged_prompt(english_prompt)
        print(f"최종 생성 프롬프트: {positive_prompt}")
        
        print(f"이미지 {num_images}장 생성 시작...")
        images = self.image_pipeline(
            prompt=positive_prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_images_per_prompt=num_images
        ).images

        image_urls = []
        
        for image in images:
            filename = f"{uuid.uuid4()}.png"
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            buffer.seek(0)

            self.s3_client.upload_fileobj(buffer, settings.R2_BUCKET_NAME, filename, ExtraArgs={'ContentType': 'image/png'})

            image_url = self.s3_client.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    'Bucket': settings.R2_BUCKET_NAME,
                    'Key': filename
                },
                ExpiresIn=3600
            )
            print(f"[업로드 완료] {image_url}")
            image_urls.append(image_url)

        print("이미지 생성 및 업로드 완료.")
        return image_urls

ai_service = AIGenerationService()