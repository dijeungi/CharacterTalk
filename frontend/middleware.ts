/**
 * @file         frontend/middleware.ts
 * @desc         middleware : 인증 토큰 검사 및 예외 처리 로직 포함
 *
 * @author       최준호
 * @update       2025.07.24
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * 모든 /api 요청과 URL 요청 전에 access_token을 검사합니다.
 * 단, 로그인/회원가입/refresh 등 인증 예외 경로는 제외됩니다.
 */
export const config = {
  matcher: ['/api/:function*', '/characters/new'],
};

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;
  const isAPI = pathname.startsWith('/api');

  const ignoredPaths = [
    '/api/user',
    '/api/auth/signup',
    '/api/auth/refresh',
    '/api/auth/temp-user',
    '/api/auth/callback/kakao',

    '/api/character',
    '/api/user/characters',
  ];

  if (ignoredPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    const redirectUrl = new URL('/login', request.url);
    if (isAPI) {
      return new NextResponse(JSON.stringify({ message: '인증 토큰이 없습니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return NextResponse.redirect(redirectUrl);
  }

  // 페이지 이동 요청의 경우, 토큰 존재 여부만 확인하고 통과시킵니다.
  // 실제 토큰 유효성 검증과 갱신은 클라이언트 측 API 요청 핸들러(axios interceptor)에 위임합니다.
  if (!isAPI) {
    return NextResponse.next();
  }

  // API 요청의 경우에만 토큰 유효성을 검증합니다.
  try {
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    console.log('Access Token 검증 실패 (만료 또는 변조) - API 요청');
    return new NextResponse(JSON.stringify({ message: '세션이 만료되었습니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
