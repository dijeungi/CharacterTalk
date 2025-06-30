/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     description: 리프레시 토큰을 검증하고 서버와 클라이언트의 토큰을 삭제합니다.
 *     responses:
 *       200:
 *         description: 로그아웃 완료
 *       401:
 *         description: 토큰 없음 또는 무효
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/_lib/PostgreSQL';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return new NextResponse('Refresh token 없음', { status: 401 });
    }

    // 토큰 검증
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: number };
    } catch {
      return new NextResponse('유효하지 않은 토큰', { status: 401 });
    }

    // DB에서 refresh_token 삭제
    await pool.query('UPDATE users SET refresh_token = NULL WHERE code = $1', [payload.id]);

    // 쿠키 제거 + 응답
    const response = new NextResponse('로그아웃 완료');
    response.cookies.set({
      name: 'access_token',
      value: '',
      path: '/',
      maxAge: 0,
    });
    response.cookies.set({
      name: 'refresh_token',
      value: '',
      path: '/api/auth/refresh',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('[!] 로그아웃 오류:', err);
    return new NextResponse('서버 오류', { status: 500 });
  }
}
