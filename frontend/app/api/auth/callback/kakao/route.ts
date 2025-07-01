import { pool } from '@/app/_lib/PostgreSQL';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import redis from '@/app/_lib/Redis';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');
    const redirectPath = state ? decodeURIComponent(state) : '/';

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
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      console.error('카카오 토큰 발급 실패:', tokenData);
      return new NextResponse('카카오 토큰을 발급받지 못했습니다.', { status: 401 });
    }
    const kakaoAccessToken = tokenData.access_token;

    // 2. 카카오 사용자 정보 요청
    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const kakaoUser = await userRes.json();
    const userEmail = kakaoUser.kakao_account?.email;

    if (!userEmail) {
      return new NextResponse('카카오 사용자 정보를 가져오지 못했습니다. (이메일 항목 동의 필요)', {
        status: 400,
      });
    }

    // 3. DB에서 이메일 조회
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    const user = result.rows[0];

    if (!user) {
      const tempId = uuidv4();
      await redis.set(
        `temp_user:${tempId}`,
        JSON.stringify({
          email: userEmail,
          name: kakaoUser.properties?.nickname,
          oauth_provider: 'kakao',
        }),
        'EX',
        600 // 10분
      );
      const signupUrl = new URL('/signup', req.nextUrl.origin);
      signupUrl.searchParams.set('tempId', tempId);
      return NextResponse.redirect(signupUrl);
    }

    // 기존 로그인 : access Token 발급
    const accessToken = jwt.sign(
      { code: user.code, name: user.name, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '30m',
      }
    );

    // RefreshToken 발급
    const refreshToken = jwt.sign({ code: user.code }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // 마지막 로그인 관련 데이터 DB 최신화
    await pool.query(
      `UPDATE users SET refresh_token = $1, last_login_at = CURRENT_TIMESTAMP WHERE code = $2`,
      [refreshToken, user.code]
    );

    // 응답 및 쿠키 설정
    const response = NextResponse.redirect(new URL(redirectPath, req.nextUrl.origin));
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

    // 리다이렉트 처리
    return response;
  } catch (error) {
    console.error('[!] Kakao OAuth Callback Error:', error);
    return new NextResponse('서버 내부 오류가 발생했습니다.', { status: 500 });
  }
}
