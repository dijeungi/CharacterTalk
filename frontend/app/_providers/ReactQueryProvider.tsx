/**
 * @file      frontend/app/_providers/ReactQueryProvider.tsx
 * @desc      Provider: React Query의 전역 상태 관리를 위한 QueryClient 설정 및 주입
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // QueryClient 생성
  const [client] = useState(() => new QueryClient());
  // QueryClientProvider로 자식(모든 컴포넌트)에 쿼리 상태 제공
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
