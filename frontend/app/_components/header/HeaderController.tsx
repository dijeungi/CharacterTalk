/**
 * @file      frontend/app/_components/header/HeaderController.tsx
 * @desc      Component: 경로 기반으로 헤더 종류를 동적으로 렌더링하는 컨트롤러 컴포넌트
 *
 * @author    최준호
 * @update    2025.07.20
 */

'use client';

import { usePathname } from 'next/navigation';

import { headerConfig } from '@/app/_config/headerConfig';

import MainHeader from '@/app/_components/header/MainHeader';
import CharacterStepHeader from '@/app/_components/header/character/CharacterStepHeader';
import ChatHeader from './chat/ChatHeader';

export default function HeaderController() {
  // 현재 경로
  const pathname = usePathname();
  // 현재 경로에 맞는 설정 찾기
  const config = headerConfig.find(cfg => pathname.startsWith(cfg.path));
  // 설정이 없거나 visible이 false인 경우 헤더를 렌더링하지 않음
  if (!config || config.visible === false) return null;

  // 설정에 맞는 헤더 컴포넌트 반환
  switch (config.variant) {
    case 'admin':
    // return <AdminHeader />;
    case 'chat':
      return <ChatHeader />;
    case 'characters':
      return <CharacterStepHeader />;
    default:
      return <MainHeader />;
  }
}
