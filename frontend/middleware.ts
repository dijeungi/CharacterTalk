// frontend/middleware.ts

import { NextRequest } from 'next/server';
import { authMiddleware } from './app/_lib/middleware/authMiddleware';

export const config = {
  matcher: ['/characters', '/characters/(.*)', '/mypage'],
};
export function middleware(request: NextRequest) {
  return authMiddleware(request);
}
