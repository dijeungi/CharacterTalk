// frontend/middleware.ts

import { NextRequest } from 'next/server';
import { authMiddleware } from './app/lib/middleware/authMiddleware';
import { matcher } from './app/lib/middleware/config';

export const config = {
  matcher,
};

export function middleware(request: NextRequest) {
  return authMiddleware(request);
}
