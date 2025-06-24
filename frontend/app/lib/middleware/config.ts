/**
 * @config       authRouteConfig
 * @file         frontend/app/lib/middleware/config.ts
 * @desc         인증 미들웨어에서 사용하는 보호 라우트 및 경로 매칭 설정
 *
 * @routes
 *  - protectedRoutes: 로그인 필요 페이지
 *  - matcher: 미들웨어 적용 대상 경로 (Next.js matcher 용도)
 *
 * @usage        authMiddleware.ts 내 라우팅 분기 처리 및 next.config.ts
 * @dependencies 없음
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

// 보호 라우트 (로그인 필요)
export const protectedRoutes = ['/characters/:path*', '/mypage'];

// 미들웨어 매칭 경로 (동적 라우팅 포함)
export const matcher = ['/characters/:path*', '/mypage'];
