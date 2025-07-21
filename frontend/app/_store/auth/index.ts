/**
 * @file      frontend/app/_store/auth/index.ts
 * @desc      Store: 로그인 상태 및 유저 정보 전역 관리를 위한 Zustand 스토어 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { create } from 'zustand';
import { AuthStore } from '@/app/_store/auth/types';

export const useAuthStore = create<AuthStore>(set => ({
  isLoggedIn: false,
  user: null,
  login: user => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
