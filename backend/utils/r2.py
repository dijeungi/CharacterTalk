# backend/api/utils/r2.py
import boto3, uuid
from django.conf import settings

def upload_image_to_r2(image: Image.Image) -> str:
    filename = f"{uuid.uuid4()}.png"
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)

    session = boto3.session.Session()
    s3 = session.client(
        's3',
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        endpoint_url=settings.R2_ENDPOINT,
    )
    s3.upload_fileobj(buffer, settings.R2_BUCKET_NAME, filename, ExtraArgs={"ContentType": "image/png"})

    return f"{settings.R2_PUBLIC_URL}/{filename}"
