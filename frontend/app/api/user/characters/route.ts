/**
 * @file         frontend/app/api/user/characters/route.ts
 * @desc         현재 로그인한 사용자가 생성한 캐릭터 목록을 조회하는 API
 *
 * @summary      내 캐릭터 목록 조회
 * @description  인증된 사용자의 ID를 기반으로, 해당 사용자가 생성한 캐릭터 목록을 반환합니다.
 * @param        {NextRequest} request - 들어오는 요청 객체. 인증 토큰 쿠키를 포함해야 합니다.
 * @responses
 *   200: 내 캐릭터 목록을 성공적으로 조회했습니다.
 *   401: 인증되지 않은 사용자입니다.
 *   500: 서버 내부 오류가 발생했습니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextRequest, NextResponse } from 'next/server';

import { pool } from '@/app/_lib/PostgreSQL';
import { getUserIdFromRequest } from '@/app/_lib/auth';

import { s3Client } from '@/app/_config/s3Client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: NextRequest) {
  let creatorId: number;
  try {
    creatorId = await getUserIdFromRequest(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '인증되지 않은 사용자입니다.' },
      { status: 401 }
    );
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT id, code, name, oneliner, profile_image_url
      FROM characters
      WHERE creator_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC;
    `;
    const result = await client.query(query, [creatorId]);
    const characters = result.rows;

    const charactersWithSignedUrls = await Promise.all(
      characters.map(async char => {
        let signedUrl = '/img/default-profile.png'; // 기본 이미지
        if (char.profile_image_url) {
          try {
            const getCommand = new GetObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: char.profile_image_url,
            });
            signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }); // 1시간
          } catch (e) {
            console.error('S3 URL 서명 실패:', e);
            // 에러 발생 시에도 기본 이미지 사용
          }
        }
        return { ...char, profile_image_url: signedUrl };
      })
    );

    return NextResponse.json(charactersWithSignedUrls);
  } catch (error) {
    console.error('내 캐릭터 목록 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
}
