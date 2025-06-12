/*
  : React Queyry Provider
  app/_providers/ReactQueryProvider.tsx
*/

'use client';

// React
import { useState } from 'react';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // QueryClient 생성
  const [client] = useState(() => new QueryClient());

  // QueryClientProvider로 자식(모든 컴포넌트)에 쿼리 상태 제공
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
