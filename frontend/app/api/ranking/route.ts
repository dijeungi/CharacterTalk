/**
 * @file         frontend/app/api/ranking/route.ts
 * @desc         실시간 및 주기적 랭킹 데이터를 제공하는 통합 API
 *
 * @author       최준호
 * @update       2025.08.06
 */
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/_lib/PostgreSQL';
import redis from '@/app/_lib/Redis';
import { s3Client } from '@/app/_config/s3Client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// 캐릭터 프로필 이미지에 대해 임시 서명된 URL을 생성하는 헬퍼 함수
const getSignedProfileUrls = async (characters: any[]) => {
  return Promise.all(
    characters.map(async (char: any) => {
      // profile_image_url이 존재하고, http로 시작하지 않는 경우(즉, R2 키인 경우)에만 서명된 URL 생성
      if (char.profile_image_url && !char.profile_image_url.startsWith('http')) {
        try {
          const getCommand = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: char.profile_image_url,
          });
          // 1시간 동안 유효한 URL 생성
          char.profile_image_url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
        } catch (e) {
          console.error('S3 URL 서명 실패:', e);
          // 실패 시 기본 이미지로 대체
          char.profile_image_url = '/img/default-profile.png';
        }
      }
      return char;
    })
  );
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'realtime';

  try {
    const client = await pool.connect();
    try {
      let characters: any[];

      if (period === 'realtime') {
        // --- 실시간 랭킹 (Redis) ---
        const characterIds = await redis.zrevrange('ranking:realtime', 0, 9);
        if (characterIds.length === 0) return NextResponse.json([]);

        const query = `
          SELECT 
            c.id, c.code, c.name, c.profile_image_url, c.oneliner, c.genre,
            u.name as creator_name, c.conversation_count
          FROM characters c
          JOIN users u ON c.creator_id = u.id
          WHERE c.id = ANY($1::int[])
        `;
        const { rows } = await client.query(query, [characterIds]);
        
        const charactersMap = new Map(rows.map(char => [char.id.toString(), char]));
        characters = characterIds.map((id, index) => {
          const character = charactersMap.get(id);
          return { ...character, rank: index + 1 };
        });

      } else if (['daily', 'weekly', 'monthly'].includes(period)) {
        // --- 주기적 랭킹 (PostgreSQL) ---
        const dateResult = await client.query(
          'SELECT MAX(calculated_at) as last_date FROM character_rankings WHERE ranking_type = $1',
          [period]
        );
        const lastCalculatedDate = dateResult.rows[0]?.last_date;
        if (!lastCalculatedDate) return new NextResponse(null, { status: 204 });

        const query = `
          SELECT
            r.rank, r.score as conversation_count, c.id, c.code, c.name, 
            c.profile_image_url, c.oneliner, c.genre, u.name as creator_name
          FROM character_rankings r
          JOIN characters c ON r.character_id = c.id
          JOIN users u ON c.creator_id = u.id
          WHERE r.ranking_type = $1 AND r.calculated_at = $2
          ORDER BY r.rank
          LIMIT 100;
        `;
        const { rows } = await client.query(query, [period, lastCalculatedDate]);
        characters = rows;

      } else {
        return NextResponse.json({ error: '지원되지 않는 랭킹 기간입니다.' }, { status: 400 });
      }

      if (characters.length === 0) {
        return new NextResponse(null, { status: 204 });
      }

      // 조회된 모든 캐릭터 목록에 대해 서명된 URL 생성
      const rankingDataWithSignedUrls = await getSignedProfileUrls(characters);
      return NextResponse.json(rankingDataWithSignedUrls);

    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`[!] 랭킹 API 오류 (period: ${period}):`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
