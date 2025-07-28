/**
 * @file         frontend/app/api/auth/callback/kakao/route.ts
 * @desc         OAuth2 : Kakao Login
 *
 * @summary      카카오 OAuth2 인증 및 처리를 위한 GET 핸들러
 * @description  카카오로부터 받은 인증 코드를 사용하여 사용자 정보를 조회하고, 회원가입 또는 로그인을 처리합니다.
 * @param        {NextRequest} req - 들어오는 요청 객체. 'code'와 'state' 검색 파라미터를 포함합니다.
 * @responses
 *   200: 기존 사용자의 경우, 액세스 토큰과 리프레시 토큰을 쿠키에 설정하고 원래 요청된 경로로 리디렉션합니다.
 *   302: 신규 사용자의 경우, 임시 사용자 정보를 Redis에 저장하고 회원가입 페이지로 리디렉션합니다.
 *   400: 요청에 'code' 파라미터가 없거나 카카오 사용자 정보(이메일)를 가져오지 못한 경우 에러를 반환합니다.
 *   401: 카카오로부터 액세스 토큰을 발급받지 못한 경우 에러를 반환합니다.
 *   500: 서버 내부 오류가 발생한 경우 에러를 반환합니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextRequest, NextResponse } from 'next/server';

import redis from '@/app/_lib/Redis';
import { pool } from '@/app/_lib/PostgreSQL';

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');
    const redirectPath = state ? decodeURIComponent(state) : '/';

    if (!code) return new NextResponse('Authorization code 없음', { status: 400 });

    /**
     * 카카오에서 accessToken 요청
     */
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

    /**
     * 카카오 사용자 정보 요청
     */
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

    /**
     * DB에서 이메일 조회
     */
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
        600
      );
      const signupUrl = new URL('/signup', req.nextUrl.origin);
      signupUrl.searchParams.set('tempId', tempId);
      return NextResponse.redirect(signupUrl);
    }

    /**
     * 기존 로그인 : access Token 발급
     */
    const accessToken = jwt.sign(
      { code: user.code, name: user.name, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '30m',
      }
    );

    /**
     * RefreshToken 발급
     */
    const refreshToken = jwt.sign({ code: user.code }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    /**
     * 마지막 로그인 관련 데이터 DB 최신화
     */
    await pool.query(
      `UPDATE users SET refresh_token = $1, last_login_at = CURRENT_TIMESTAMP WHERE code = $2`,
      [refreshToken, user.code]
    );

    /**
     * 응답 및 쿠키 설정
     */
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

    return response;
  } catch (error) {
    console.error('[!] Kakao OAuth Callback Error:', error);
    return new NextResponse('서버 내부 오류가 발생했습니다.', { status: 500 });
  }
}
