/**
 * @file         frontend/app/api/character/[code]/route.ts
 * @desc         특정 캐릭터의 상세 정보를 조회하는 API
 *
 * @summary      캐릭터 상세 정보 조회
 * @description  캐릭터 `code`를 사용하여 특정 캐릭터의 모든 정보를 조회합니다. 프로필 이미지 URL은 임시 서명된 URL로 변환됩니다.
 * @param        {NextRequest} request - 들어오는 요청 객체
 * @param        {object} context - 라우트 파라미터를 포함하는 객체
 * @param        {string} context.params.code - 조회할 캐릭터의 고유 코드
 * @responses
 *   200: 캐릭터 정보를 성공적으로 조회했습니다.
 *   400: 'code' 파라미터가 누락되었습니다.
 *   404: 해당 'code'를 가진 캐릭터를 찾을 수 없습니다.
 *   500: 서버 내부 오류가 발생했습니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextRequest, NextResponse } from 'next/server';

import { pool } from '@/app/_lib/PostgreSQL';

import { s3Client } from '@/app/_config/s3Client';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: NextRequest, context: { params: { code: string } }) {
  const { code } = await context.params;

  if (!code) {
    return NextResponse.json({ error: '캐릭터 코드가 필요합니다.' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT
        c.*,
        u.name as creator_name
      FROM
        characters c
      LEFT JOIN
        users u ON c.creator_id = u.id
      WHERE
        c.code = $1 AND c.deleted_at IS NULL;
    `;

    const result = await client.query(query, [code]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '캐릭터를 찾을 수 없습니다.' }, { status: 404 });
    }

    const character = result.rows[0];

    // DB에 저장된 이미지 파일 이름(Key)이 있다면,
    if (character.profile_image_url) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: character.profile_image_url,
      });
      const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 300 });
      character.profile_image_url = signedUrl;
    }

    const hashtagQuery = `
      SELECT h.name FROM hashtags h
      JOIN character_hashtags ch ON h.id = ch.hashtag_id
      WHERE ch.character_id = $1
      ORDER BY h.character_count DESC, h.name;
    `;
    const hashtagResult = await client.query(hashtagQuery, [character.id]);
    character.hashtags = hashtagResult.rows.map(row => row.name);

    return NextResponse.json(character);
  } catch (error) {
    console.error(`캐릭터 상세 조회 API 오류 (code: ${code}):`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
}
