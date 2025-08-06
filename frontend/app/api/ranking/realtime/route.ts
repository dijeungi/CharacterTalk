
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/_lib/PostgreSQL';
import redis from '@/app/_lib/Redis';

// 순위권 캐릭터 데이터 타입 정의
interface RankedCharacter {
  id: number;
  name: string;
  profile_image_url: string | null;
  oneliner: string;
  creator_name: string;
  conversation_count: number;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Redis에서 상위 10개 캐릭터 ID 조회
    const rankingIds = await redis.zrevrange('ranking:realtime', 0, 9);

    if (rankingIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. PostgreSQL에서 캐릭터 상세 정보 조회
    const client = await pool.connect();
    try {
      const query = `
        SELECT
          c.id,
          c.name,
          c.profile_image_url,
          c.oneliner,
          u.name AS creator_name,
          c.conversation_count
        FROM characters c
        JOIN users u ON c.creator_id = u.id
        WHERE c.id = ANY($1::int[])
      `;
      const result = await client.query(query, [rankingIds]);

      // 3. Redis에서 조회한 순서대로 결과 정렬
      const characterMap = new Map<number, RankedCharacter>();
      result.rows.forEach(row => {
        characterMap.set(row.id, {
          id: row.id,
          name: row.name,
          profile_image_url: row.profile_image_url,
          oneliner: row.oneliner,
          creator_name: row.creator_name,
          conversation_count: row.conversation_count,
        });
      });

      const sortedCharacters = rankingIds
        .map(id => characterMap.get(Number(id)))
        .filter((c): c is RankedCharacter => c !== undefined);

      return NextResponse.json(sortedCharacters, { status: 200 });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Realtime Ranking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
