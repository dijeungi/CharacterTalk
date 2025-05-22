/*
  헤더 관리 훅
  app/components/header/HeaderManager.tsx
*/

// 현재 경로 확인 훅
import { usePathname } from 'next/navigation';

// '/' 헤더 컴포넌트
import MainHeader from './MainHeader';

// 경로에 따라 헤더를 렌더링
export const useRenderHeader = () => {
  const pathname = usePathname();

  // 조건에 따라 헤더 컴포넌트 반환
  const renderHeader = () => {
    // 향후 필요시 조건 분기 가능
    // if (pathname.startsWith("/auth")) return <AuthHeader />;
    return <MainHeader />;
  };

  return renderHeader;
};
