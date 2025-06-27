import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/PostgreSQL';

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
    const userId = decoded.id;

    // DB에서 사용자의 리프레시 토큰을 조회하여, 받은 토큰과 일치하는지 확인합니다. (이는 탈취된 이전 토큰이 재사용되는 것을 방지 목적)
    const dbResult = await pool.query('SELECT refresh_token FROM users WHERE code = $1', [userId]);
    const savedRefreshToken = dbResult.rows[0]?.refresh_token;

    if (!savedRefreshToken || savedRefreshToken !== refreshToken) {
      // DB에 저장된 토큰과 다르다면, 이미 사용되었거나 탈취된 토큰일 가능성이 높습니다.
      // 이 경우, 보안을 위해 해당 유저의 모든 세션을 종료하는 로직을 추가할 수 있습니다.
      console.error(`[!] 비정상적인 리프레시 토큰 사용 감지: 사용자 ID ${userId}`);
      return new NextResponse(JSON.stringify({ message: '비정상적인 접근입니다.' }), {
        status: 401,
      });
    }

    // 검증 완료 시 - 새로운 AccessToken & RefreshToken을 발급
    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '30m' });
    const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // DB에 **새로운 리프레시 토큰**을 저장하여 기존 토큰을 무효화합니다.
    await pool.query('UPDATE users SET refresh_token = $1 WHERE code = $2', [
      newRefreshToken,
      userId,
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
      maxAge: 60 * 30,
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
    // JWT 검증 실패 (만료, 변조 등)
    console.error('[!] Refresh Token 검증 실패:', error);
    // 클라이언트가 유효하지 않은 토큰을 가지고 있으므로, 쿠키를 삭제해주는 것이 좋습니다.
    const response = new NextResponse(
      JSON.stringify({ message: '세션이 만료되었습니다. 다시 로그인해주세요.' }),
      { status: 401 }
    );
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}
