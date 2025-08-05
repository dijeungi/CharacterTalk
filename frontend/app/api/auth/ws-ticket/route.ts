/**
 * @file         frontend/app/api/auth/ws-ticket/route.ts
 * @desc         WebSocket 연결을 위한 임시 티켓을 발급하는 API
 *
 * @summary      WebSocket 인증 티켓 발급
 * @description  로그인한 사용자에 한해, 짧은 유효기간을 가진 임시 티켓을 생성하여 Redis에 저장하고 사용자에게 반환합니다.
 * @param        {NextRequest} request - 들어오는 요청 객체. 인증 쿠키를 포함해야 합니다.
 * @responses
 *   200: 티켓 발급에 성공했습니다.
 *   401: 인증되지 않은 사용자입니다.
 *   500: 서버 내부 오류가 발생했습니다.
 *
 * @author       최준호
 * @update       2025.08.05
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/app/_lib/auth';
import redis from '@/app/_lib/Redis';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  let userId: number;
  try {
    // 요청에서 사용자 ID를 가져옵니다. 실패 시 401 에러가 발생합니다.
    userId = await getUserIdFromRequest(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '인증되지 않은 사용자입니다.' },
      { status: 401 }
    );
  }

  try {
    const ticket = uuidv4();
    const key = `ws-ticket:${ticket}`;

    // Redis에 60초 동안 유효한 티켓을 저장합니다. (값: 사용자 ID)
    await redis.set(key, userId, 'EX', 60);

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('[!] WebSocket 티켓 발급 오류:', error);
    return NextResponse.json({ error: '티켓 발급 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
