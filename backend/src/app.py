from fastapi import FastAPI
from pydantic import BaseModel
from src.services.predict_service import generate_image

app = FastAPI()

class GenerateRequest(BaseModel):
    prompt: str

@app.post("/generate/")
async def generate(request: GenerateRequest):
    image_path = generate_image(request.prompt)
    return {"image_path": image_path}
