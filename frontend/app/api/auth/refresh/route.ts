import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/app/_lib/PostgreSQL';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // 쿠키에 리프레시 토큰이 없는 경우
  if (!refreshToken) {
    return new NextResponse(JSON.stringify({ message: '리프레시 토큰이 없습니다.' }), {
      status: 401,
    });
  }

  try {
    // 받은 리프레시 토큰의 유효성을 1차적으로 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as DecodedToken;

    const userCode = decoded.code;

    // DB에서 사용자의 리프레시 토큰을 조회하여, 받은 토큰과 일치하는지 확인합니다. (이는 탈취된 이전 토큰이 재사용되는 것을 방지 목적)
    const dbResult = await pool.query(
      'SELECT * FROM users WHERE code = $1 AND refresh_token = $2',
      [userCode, refreshToken]
    );
    const user = dbResult.rows[0];

    if (!user) {
      const errResponse = new NextResponse(
        JSON.stringify({ message: '비정상적인 접근입니다. 다시 로그인해주세요.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
      errResponse.cookies.delete('access_token');
      errResponse.cookies.delete('refresh_token');
      return errResponse;
    }

    // 검증 완료 시 - 새로운 AccessToken & RefreshToken을 발급

    const newAccessToken = jwt.sign(
      { code: user.code, name: user.name, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30m' }
    );

    const newRefreshToken = jwt.sign({ code: user.code }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // DB Update
    await pool.query('UPDATE users SET refresh_token = $1 WHERE code = $2', [
      newRefreshToken,
      userCode,
    ]);

    // 응답 객체를 생성하고, 새로운 토큰들을 쿠키에 설정합니다.
    const response = NextResponse.json(
      { message: '토큰이 성공적으로 갱신되었습니다.' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'access_token',
      value: newAccessToken,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
  } catch (error) {
    console.error('[!] Refresh Token 검증 실패:', error);
    const response = new NextResponse(
      JSON.stringify({ message: '세션이 만료되었습니다. 다시 로그인해주세요.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}
