/*
  인증이 필요한 보호 라우트 및 미들웨어 매처 경로 정의
  middleware/protectedRoutes.ts
*/

// 보호 라우트 (로그인 필요)
export const protectedRoutes = ['/characters/:path*', '/mypage'];

// 미들웨어 매칭 경로 (동적 라우팅 포함)
export const matcher = ['/characters/:path*', '/mypage'];
