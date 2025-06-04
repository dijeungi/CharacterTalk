/*
  layout.tsx 에만 적용할 컴포넌트입니다.
  app/_components/common/LoadingOverlay.tsx
*/

'use client';

// css
import '@/globals.css';

// 로딩바 컴포넌트
import { ScaleLoader } from 'react-spinners';

// 전체 화면 로딩 오버레이 컴포넌트
export default function Loading() {
  return (
    <div className="Spinner_Overlay">
      <ScaleLoader color="#2e80ff" />
    </div>
  );
}
