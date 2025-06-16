/*
  Route: '/'
  Path: app/layout.tsx
  Description:
    - 이 페이지는 애플리케이션의 루트 레이아웃을 정의합니다.
    - 전역 스타일(초기화 및 글로벌 스타일)과 리액트 쿼리 프로바이더를 포함하여 애플리케이션의 데이터 관리와 UI 레이아웃을 설정합니다.
    - 헤더를 포함한 전체 페이지의 레이아웃을 구성하며, 자식 컴포넌트를 동적으로 렌더링합니다.
*/

'use client';

import './globals.css';

// default
import { ReactNode } from 'react';

// components
import HeaderController from './_components/header/HeaderController';

// provider
import ReactQueryProvider from './_providers/ReactQueryProvider';

// custom hooks
import { useAuthRestore } from './_hooks/useAuthRestore';

export default function Layout({ children }: { children: ReactNode }) {
  // useAuthRestore = 사용자 인증 상태를 복원하고, 인증된 상태에 따라 페이지 렌더링을 조정
  useAuthRestore();
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto h-dvh w-[480px]">
          <ReactQueryProvider>
            <HeaderController />
            {children}
          </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
