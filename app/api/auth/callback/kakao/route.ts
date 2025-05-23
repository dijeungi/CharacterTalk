import { pool } from '@/lib/PostgreSQL';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import redis from '@/lib/Redis';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) return new NextResponse('Authorization code 없음', { status: 400 });

    // 1. 카카오에서 accessToken 요청
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        code,
        client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();
    const kakaoAccessToken = tokenData.access_token;

    if (!kakaoAccessToken) {
      return new NextResponse('토큰 발급 실패', { status: 401 });
    }

    // 2. 카카오 사용자 정보 요청
    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const kakaoUser = await userRes.json();

    // 3. DB에서 이메일 조회
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      kakaoUser.kakao_account.email,
    ]);
    const user = result.rows[0];

    if (!user) {
      const tempId = uuidv4();
      await redis.set(
        `temp_user:${tempId}`,
        JSON.stringify({
          email: kakaoUser.kakao_account.email,
          nick_name: kakaoUser.properties?.nickname,
          oauth: 'kakao',
        }),
        'EX',
        600
      );
      return NextResponse.redirect(`${req.nextUrl.origin}/signup?tempId=${tempId}`);
    }

    // 기존 로그인
    const accessToken = jwt.sign({ id: user.code }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const refreshToken = jwt.sign({ id: user.code }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // 마지막 로그인 관련 데이터 DB 최신화
    await pool.query(
      `UPDATE users SET last_login = TIMEZONE('Asia/Seoul', NOW()), refresh_token = $1 WHERE email = $2`,
      [refreshToken, kakaoUser.kakao_account.email]
    );

    // 쿠키에 저장
    const response = NextResponse.redirect(`${req.nextUrl.origin}/`);
    response.cookies.set({
      name: 'access_token',
      value: accessToken,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    response.cookies.set({
      name: 'refresh_token',
      value: refreshToken,
      path: '/api/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // 리다이렉트 처리 (서버에서 직접 리다이렉트)
    return response;
  } catch (error) {
    console.error('[!] Kakao OAuth 실패:', error);
    return new NextResponse('서버 오류', { status: 500 });
  }
}
