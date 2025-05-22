/*
  클라이언트 전용 Provider 컴포넌트
  components/ClientProviders.tsx
*/

'use client';

// 라이브러리
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 헤더 렌더링 훅
import { useRenderHeader } from '@/_components/header/HeaderManager';

// 클라이언트 전역 Provider 컴포넌트
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const renderHeader = useRenderHeader();

  return (
    <QueryClientProvider client={queryClient}>
      {renderHeader()}
      <main>{children}</main>
    </QueryClientProvider>
  );
}
