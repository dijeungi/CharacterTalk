/*
  Route: '/'
  Path: app/_components/header/HeaderController.tsx
  Description:
    - 이 페이지는 현재 경로에 맞는 헤더 컴포넌트를 선택적으로 렌더링하는 역할을 합니다.
    - `usePathname` 훅을 사용해 현재 경로를 가져오고, `headerConfig`에서 해당 경로에 맞는 설정을 찾아 적절한 헤더를 표시합니다.
    - 설정에서 `visible` 값이 `false`인 경우나 해당 경로에 맞는 설정이 없으면 헤더를 렌더링하지 않습니다.
*/

'use client';

// Next.js
import { usePathname } from 'next/navigation';

// configFiles
import { headerConfig } from '../../_config/headerConfig';

// components
import MainHeader from './MainHeader';
import CharacterStepHeader from './CharacterStepHeader';

export default function HeaderController() {
  // 현재 경로 가져오기
  const pathname = usePathname();

  // 현재 경로에 맞는 설정 찾기
  const config = headerConfig.find(cfg => pathname.startsWith(cfg.path));

  // 설정이 없거나 visible이 false인 경우 헤더를 렌더링하지 않음
  if (!config || config.visible === false) return null;

  // 설정에 맞는 헤더 컴포넌트 반환
  switch (config.variant) {
    case 'admin':
    // return <AdminHeader />;
    case 'characters':
      return <CharacterStepHeader />;
    default:
      return <MainHeader />;
  }
}
