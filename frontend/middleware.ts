// frontend/middleware.ts
// api 및

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * 모든 /api 요청과 URL 요청 전에 access_token을 검사합니다.
 * 단, 로그인/회원가입/refresh 등 인증 예외 경로는 제외됩니다.
 */
export const config = {
  matcher: ['/api/:function*', '/characters/:path*'],
};

// JWT 서명 검증을 위한 비밀 키
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const isAPI = request.nextUrl.pathname.startsWith('/api');
  // 특정 api는 제외
  const ignoredPaths = [
    '/api/auth/callback/kakao',
    '/api/auth/signup',
    '/api/auth/temp-user',
    '/api/user',
    '/api/auth/refresh',
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

  // 토큰 서명 및 만료 시간 검증 Try 구문
  try {
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    console.log('Access Token 검증 실패 (만료 또는 변조):', error.message);
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
