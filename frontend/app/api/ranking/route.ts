/**
 * @file         frontend/app/api/ranking/route.ts
 * @desc         실시간 및 주기적 랭킹 데이터를 제공하는 API
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
      let signedUrl = '/img/default-profile.png';
      if (char.profile_image_url) {
        try {
          const getCommand = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: char.profile_image_url,
          });
          signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
        } catch (e) {
          console.error('S3 URL 서명 실패:', e);
        }
      }
      return { ...char, profile_image_url: signedUrl };
    })
  );
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'realtime';

  try {
    if (period === 'realtime') {
      // --- 실시간 랭킹 (Redis) ---
      const now = Math.floor(Date.now() / 1000);
      const thirtyMinutesAgo = now - 30 * 60;

      const results = await redis.zrevrangebyscore('ranking:realtime', now, thirtyMinutesAgo);
      if (!results.length) return NextResponse.json([]);

      const interactionCounts = results.reduce((acc: { [key: string]: number }, charId: string) => {
        acc[charId] = (acc[charId] || 0) + 1;
        return acc;
      }, {});

      const sortedCharacterIds = Object.keys(interactionCounts)
        .sort((a, b) => interactionCounts[b] - interactionCounts[a])
        .slice(0, 10);

      if (!sortedCharacterIds.length) return NextResponse.json([]);

      const client = await pool.connect();
      try {
        const query = `
          SELECT id, code, name, profile_image_url, oneliner
          FROM characters
          WHERE id = ANY($1::int[])
        `;
        const { rows } = await client.query(query, [sortedCharacterIds]);
        const charactersMap = new Map(rows.map(char => [char.id.toString(), char]));

        let rankingData = sortedCharacterIds.map((charId, index) => {
          const character = charactersMap.get(charId);
          return {
            ...character,
            rank: index + 1,
            conversation_count: interactionCounts[charId],
          };
        });

        rankingData = await getSignedProfileUrls(rankingData);
        return NextResponse.json(rankingData);
      } finally {
        client.release();
      }

    } else if (['daily', 'weekly', 'monthly'].includes(period)) {
      // --- 주기적 랭킹 (PostgreSQL) ---
      const client = await pool.connect();
      try {
        const today = new Date().toISOString().split('T')[0];
        const query = `
          SELECT
            r.rank, r.score as conversation_count, c.id, c.code, c.name, c.profile_image_url, c.oneliner
          FROM character_rankings r
          JOIN characters c ON r.character_id = c.id
          WHERE r.ranking_type = $1 AND r.calculated_at = $2
          ORDER BY r.rank
          LIMIT 100;
        `;
        const { rows } = await client.query(query, [period, today]);

        if (rows.length === 0) {
          return new NextResponse(null, { status: 204 });
        }
        
        const charactersWithSignedUrls = await getSignedProfileUrls(rows);
        return NextResponse.json(charactersWithSignedUrls);
      } finally {
        client.release();
      }
    } else {
      return NextResponse.json({ error: '지원되지 않는 랭킹 기간입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error(`[!] 랭킹 API 오류 (period: ${period}):`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
