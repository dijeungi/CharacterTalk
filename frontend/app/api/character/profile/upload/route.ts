/**
 * @file         frontend/app/api/character/profile/upload/route.ts
 * @desc         캐릭터 프로필 이미지를 업로드하고 영구 URL을 반환하는 API
 *
 * @summary      프로필 이미지 업로드
 * @description  클라이언트로부터 받은 이미지 파일을 R2 버킷에 업로드하고, 해당 파일에 접근할 수 있는 영구 URL을 반환합니다.
 * @param        {Request} request - 들어오는 요청 객체. FormData는 'image' 필드를 포함해야 합니다.
 * @responses
 *   200: 이미지 업로드 및 URL 생성을 성공적으로 완료했습니다.
 *   400: 요청에 이미지 파일이 포함되지 않았습니다.
 *   500: 이미지 업로드 중 서버에서 오류가 발생했습니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextResponse } from 'next/server';

import { s3Client } from '@/app/_config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
