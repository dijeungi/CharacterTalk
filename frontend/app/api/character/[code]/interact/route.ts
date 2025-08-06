
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/app/_lib/auth';
import { pool } from '@/app/_lib/PostgreSQL';
import redis from '@/app/_lib/Redis';

export async function POST(request: NextRequest, { params }: { params: { code: string } }) {
  const characterCode = params.code;

  try {
    const userId = await getUserIdFromRequest(request);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. 캐릭터 코드를 사용하여 ID 조회
      const characterResult = await client.query('SELECT id FROM characters WHERE code = $1', [characterCode]);
      if (characterResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Character not found' }, { status: 404 });
      }
      const characterId = characterResult.rows[0].id;

      // 2. 새로운 상호작용 기록 시도 (이미 존재하면 아무것도 하지 않음)
      const insertResult = await client.query(
        `INSERT INTO character_interactions (user_id, character_id, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, character_id) DO NOTHING`,
        [userId, characterId]
      );

      // 3. 새로운 상호작용인 경우 (INSERT 성공)
      if (insertResult.rowCount > 0) {
        // 3a. 캐릭터의 대화 수 증가
        await client.query(
          'UPDATE characters SET conversation_count = conversation_count + 1 WHERE id = $1',
          [characterId]
        );

        // 3b. Redis 실시간 랭킹에 추가
        const currentTimestamp = Math.floor(Date.now() / 1000);
        await redis.zadd('ranking:realtime', currentTimestamp, characterId);
        
        await client.query('COMMIT');
        return NextResponse.json({ message: 'Interaction recorded', newInteraction: true }, { status: 201 });
      } else {
        // 이미 상호작용이 존재하는 경우
        await client.query('COMMIT');
        return NextResponse.json({ message: 'Interaction already exists', newInteraction: false }, { status: 200 });
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Interaction API Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    // 인증 오류 처리
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
