# backend/src/app.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.predict_service import generate_image

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate(req: Request):
    data = await req.json()
    prompt = data.get("prompt")
    image_path = generate_image(prompt)
    return {"image_path": image_path}
