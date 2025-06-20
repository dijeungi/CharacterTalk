# backend/api/services.py

import os
import uuid
import torch

from PIL import Image
from django.conf import settings
from diffusers import DiffusionPipeline
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class AIGenerationService:
    # Modal Loading
    def __init__(self):
        print("[!] AI 모델 로딩 중 입니다.")
        self.device = self._get_device()
        
        hf_token = settings.HUGGING_FACE_TOKEN
        
        # 1. 번역 모델 변경 (Helsinki-NLP/opus-mt-ko-en)
        translator_model_name = 'Helsinki-NLP/opus-mt-ko-en'
        self.translator_tokenizer = AutoTokenizer.from_pretrained(translator_model_name, token=hf_token)
        self.translator_model = AutoModelForSeq2SeqLM.from_pretrained(translator_model_name, token=hf_token)
        self.translator_model.to(self.device) # 번역 모델도 GPU로 이동
        
        # 2. 이미지 생성 모델 로드 (기존과 동일)
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
        # 번역 및 태그 생성 (동일)
        english_prompt = self.translate_ko_to_en(korean_prompt)
        print(f"[!] 번역된 프롬프트: {english_prompt}")
        positive_prompt, negative_prompt = self.create_tagged_prompt(english_prompt)
        print(f"최종 생성 프롬프트: {positive_prompt}")
        
        print(f"이미지 {num_images}장 생성 시작...")
        
        # 1. num_images_per_prompt를 사용해 한 번의 호출로 여러 이미지 생성
        images = self.image_pipeline(
            prompt=positive_prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_images_per_prompt=num_images
        ).images
        
        image_urls = []
        save_dir = os.path.join(settings.MEDIA_ROOT, 'generated_images')
        os.makedirs(save_dir, exist_ok=True)

        # 2. 생성된 이미지 리스트(images)를 순회하며 저장
        for image in images:
            filename = f"{uuid.uuid4()}.png"
            file_path = os.path.join(save_dir, filename)
            image.save(file_path)
            
            image_url = os.path.join(settings.MEDIA_URL, 'generated_images', filename)
            image_urls.append(image_url)
        
        print("이미지 생성 완료.")
        return image_urls

# 장고 앱 전체에서 이 서비스 인스턴스 하나만 사용하도록 미리 생성해 둡니다.
ai_service = AIGenerationService()