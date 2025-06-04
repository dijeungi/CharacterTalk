/*
  글로벌 미들웨어 설정: authMiddleware 적용 및 matcher 연결
  app/middleware.ts
*/

// 미들웨어 함수
import { authMiddleware } from './app/lib/middleware/authMiddleware';
// 매칭 경로
import { matcher } from './app/lib/middleware/config';

// 미들웨어 설정
export const config = { matcher };

// 미들웨어 등록
export const middleware = authMiddleware;
