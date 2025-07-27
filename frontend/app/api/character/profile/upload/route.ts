import { s3Client } from '@/app/_config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 이름이 겹치지 않도록 고유한 이름 생성
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const buffer = await file.arrayBuffer();

    // 1. 파일을 R2 버킷에 업로드합니다. (이 부분은 동일)
    const putCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });
    await s3Client.send(putCommand);

    const publicUrl = `https://${process.env.R2_PUBLIC_URL}/${uniqueFileName}`;

    // 생성된 영구 URL을 클라이언트에 반환
    return NextResponse.json({ imageUrl: publicUrl });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return NextResponse.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 });
  }
}
