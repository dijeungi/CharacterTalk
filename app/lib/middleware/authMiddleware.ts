/*
  인증 미들웨어
  app/lib/middleware/authMiddleware.ts
*/

import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { protectedRoutes } from './config';

// JWT 페이로드 타입 정의
type JwtPayload = {
  exp: number;
  role?: string;
};

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // 로그인 없이 접근 가능한 공개 경로
  const publicRoutes = ['/', '/login'];
  if (publicRoutes.includes(pathname)) return NextResponse.next();

  // 보호 라우트 확인
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  // accessToken이 없을 경우 > 로그인 페이지로 이동 & 쿼리 파라미터(reason) 추가
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('reason', 'unauthorized');
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    // accessToken이 만료되었을 경우
    if (isExpired) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('reason', 'expired');
      return NextResponse.redirect(url);
    }

    // 관리자 권한이 없을 경우
    const role = decoded.role ?? 'user';
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('reason', 'forbidden');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error('JWT 디코드 실패:', err);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('reason', 'unauthorized');
    return NextResponse.redirect(url);
  }
}
