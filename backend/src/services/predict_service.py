# backend/src/services/predict_service.py
from diffusers import StableDiffusionPipeline
import torch
import os
from uuid import uuid4

pipe = None

def load_model():
    global pipe
    if pipe is None:
        pipe = StableDiffusionPipeline.from_pretrained(
            "gsdf/Counterfeit-V2.5",
            torch_dtype=torch.float32,
            use_safetensors=True,
        ).to("mps")
        pipe.safety_checker = None
    return pipe

def generate_image(prompt: str):
    model = load_model()
    image = model(prompt).images[0]
    path = f"./.data/generated_{uuid4().hex}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image.save(path)
    return path
