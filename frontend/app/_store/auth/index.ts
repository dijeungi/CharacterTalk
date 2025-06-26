/**
 * @store        useAuthStore
 * @file         store/auth.ts
 * @desc         로그인 등 인증 상태 전역 관리
 *
 * @author       최준호
 * @since        2025.06.25
 */

import { create } from 'zustand';

export const useAuthStore = create<AuthStore>(set => ({
  isLoggedIn: false,
  user: null,
  login: user => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
