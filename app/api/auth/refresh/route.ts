import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/PostgreSQL';

export async function GET(req: NextRequest) {
  try {
    // 1. 쿠키 존재 여부 검사
    if (!req.cookies.has('refresh_token')) {
      return new NextResponse('쿠키 없음', { status: 401 });
    }

    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return new NextResponse('refresh_token 값 없음', { status: 401 });
    }

    // 2. refreshToken 유효성 검사
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        id: number;
        email?: string;
        nickname?: string;
      };
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return new NextResponse('refresh_token 만료', { status: 401 });
      }
      return new NextResponse('토큰 유효성 실패', { status: 401 });
    }

    // 3. DB 사용자 조회
    const result = await pool.query('SELECT * FROM users WHERE code = $1', [payload.id]);
    const user = result.rows[0];
    if (!user) {
      return new NextResponse('사용자 없음', { status: 403 });
    }

    // 4. 저장된 refresh_token과 비교
    if (user.refresh_token !== refreshToken) {
      return new NextResponse('토큰 불일치 / 위조 가능성', { status: 403 });
    }

    // 5. access, refresh token 재발급
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

    // 6. 새 refreshToken DB 저장
    await pool.query('UPDATE users SET refresh_token = $1 WHERE code = $2', [
      newRefreshToken,
      user.code,
    ]);

    // 7. 새 쿠키 설정
    const response = new NextResponse('accessToken 재발급 완료');
    response.cookies.set({
      name: 'access_token',
      value: newAccessToken,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 30, // 30분
    });
    response.cookies.set({
      name: 'refresh_token',
      value: newRefreshToken,
      path: '/api/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return response;
  } catch (err) {
    console.error('refresh 처리 오류:', err);
    return new NextResponse('서버 오류', { status: 500 });
  }
}
