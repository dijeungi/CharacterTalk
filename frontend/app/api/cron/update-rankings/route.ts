
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/_lib/PostgreSQL';
import redis from '@/app/_lib/Redis';
import { format } from 'date-fns';

type Period = 'daily' | 'weekly' | 'monthly';

async function calculateAndStoreRanking(period: Period, today: Date) {
  const client = await pool.connect();
  try {
    // 1. 기간별 시작 타임스탬프 계산
    let startDate = new Date(today);
    if (period === 'daily') {
      startDate.setDate(today.getDate() - 1);
    } else if (period === 'weekly') {
      startDate.setDate(today.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(today.getMonth() - 1);
    }
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(today.getTime() / 1000);

    // 2. Redis에서 해당 기간의 상호작용 데이터 조회
    // zrangebyscore: score(타임스탬프) 기준으로 멤버(캐릭터 ID)를 가져옴
    const characterIds = await redis.zrangebyscore('ranking:realtime', startTimestamp, endTimestamp);

    if (characterIds.length === 0) {
      console.log(`[${period}] No interactions found for the period.`);
      return;
    }

    // 3. 캐릭터별 상호작용 횟수 집계
    const interactionCounts: { [key: string]: number } = {};
    characterIds.forEach(id => {
      interactionCounts[id] = (interactionCounts[id] || 0) + 1;
    });

    // 4. 집계된 데이터를 점수 기준으로 정렬
    const sortedRankings = Object.entries(interactionCounts)
      .map(([character_id, score]) => ({ character_id: parseInt(character_id), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100); // 상위 100개만 저장

    // 5. DB에 저장 (트랜잭션 사용)
    await client.query('BEGIN');

    // 5a. 기존 랭킹 데이터 삭제
    const formattedToday = format(today, 'yyyy-MM-dd');
    await client.query(
      'DELETE FROM character_rankings WHERE ranking_type = $1 AND calculated_at = $2',
      [period, formattedToday]
    );

    // 5b. 새로운 랭킹 데이터 삽입
    const insertQuery = `
      INSERT INTO character_rankings (character_id, ranking_type, rank, score, calculated_at)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (let i = 0; i < sortedRankings.length; i++) {
      const rank = i + 1;
      const { character_id, score } = sortedRankings[i];
      await client.query(insertQuery, [character_id, period, rank, score, formattedToday]);
    }

    await client.query('COMMIT');
    console.log(`[${period}] Ranking update successful for ${formattedToday}.`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`[${period}] Failed to update ranking:`, error);
    throw error; // 에러를 다시 던져서 호출한 쪽에서 알 수 있도록 함
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  // Vercel Cron Jobs 등 외부 스케줄러에서 호출 시 보안을 위해 헤더나 본문에 secret key를 확인하는 로직 추가 권장
  // 예: const secret = request.headers.get('Authorization');
  // if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const today = new Date();
    
    // 모든 주기에 대해 랭킹 집계 실행
    await Promise.all([
      calculateAndStoreRanking('daily', today),
      calculateAndStoreRanking('weekly', today),
      calculateAndStoreRanking('monthly', today),
    ]);

    return NextResponse.json({ message: 'All rankings updated successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Cron job for ranking update failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
