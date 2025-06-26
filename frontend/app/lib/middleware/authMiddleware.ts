import { auth } from '@/app/firebase/config';
/**
 * @lib          authMiddleware
 * @file         frontend/app/lib/middleware/authMiddleware.ts
 * @desc         Next.js 미들웨어에서 JWT 기반 인증/인가 로직 처리
 *
 * @routes
 *  - publicRoutes: 로그인 없이 접근 가능한 경로
 *  - protectedRoutes: 인증이 필요한 경로 (config에서 주입)
 *
 * @logic
 *  - access_token 쿠키가 없거나 만료된 경우 로그인 페이지로 리디렉션
 *  - JWT 디코드 실패 시 인증 실패 처리
 *  - 관리자 권한 없는 사용자가 /admin 진입 시 접근 차단
 *
 * @usage        next.config.ts 또는 middleware.ts 에서 인증 미들웨어로 적용
 * @dependencies next/server, jwt-decode
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

// modules
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

// config
import { protectedRoutes } from './config';

export function authMiddleware(request: NextRequest) {
  // 리퀘스트 URL
  const { pathname } = request.nextUrl;

  // 쿠키 가져오기
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
