import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/PostgreSQL';

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return new NextResponse('Refresh token 없음', { status: 401 });
    }

    // 1. refreshToken 유효성 검사
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        id: number;
        email?: string;
        nickname?: string;
      };
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return new NextResponse('refreshToken 만료', { status: 401 });
      }
      return new NextResponse('유효하지 않은 refreshToken', { status: 401 });
    }

    // 2. DB에서 사용자 조회 + 저장된 토큰과 비교
    const result = await pool.query('SELECT * FROM users WHERE code = $1', [payload.id]);
    const user = result.rows[0];
    if (!user || user.refresh_token !== refreshToken) {
      return new NextResponse('Refresh token 불일치', { status: 403 });
    }

    // 3. 새 accessToken, refreshToken 생성
    const newAccessToken = jwt.sign(
      {
        id: user.code,
        email: user.email,
        nickname: user.full_name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30m' }
    );

    const newRefreshToken = jwt.sign({ id: user.code }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // 4. DB에 새 refreshToken 저장
    await pool.query('UPDATE users SET refresh_token = $1 WHERE code = $2', [
      newRefreshToken,
      user.code,
    ]);

    // 5. 새 쿠키 설정
    const response = new NextResponse('accessToken 재발급 완료');
    response.cookies.set({
      name: 'access_token',
      value: newAccessToken,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30,
    });
    response.cookies.set({
      name: 'refresh_token',
      value: newRefreshToken,
      path: '/api/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('refresh 처리 오류:', err);
    return new NextResponse('서버 오류', { status: 500 });
  }
}
