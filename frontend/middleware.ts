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
  matcher: ['/api/:function*', '/characters/:path*'],
};

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const isAPI = request.nextUrl.pathname.startsWith('/api');

  /**
   * ignoredPaths = 로그인 토큰이 필요없는 api : 401 Free Pass
   */
  const ignoredPaths = [
    '/api/user',
    '/api/auth/signup',
    '/api/auth/refresh',
    '/api/auth/temp-user',
    '/api/auth/callback/kakao',
    '/api/character',
  ];

  if (ignoredPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    if (isAPI) {
      return new NextResponse(JSON.stringify({ message: '인증 토큰이 없습니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  try {
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    console.log('Access Token 검증 실패 (만료 또는 변조)');
    if (isAPI) {
      return new NextResponse(JSON.stringify({ message: '세션이 만료되었습니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
