/**
 * @file      frontend/app/_config/headerConfig.ts
 * @desc      Config: 경로별 헤더 표시 여부 및 헤더 타입 설정 배열 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export const headerConfig = [
  {
    path: '/characters/new',
    visible: true,
    variant: 'characters',
  },
  {
    path: '/login',
    visible: false,
  },
  {
    path: '/signup',
    visible: false,
  },
  {
    path: '/',
    visible: true,
    variant: 'default',
  },
];
