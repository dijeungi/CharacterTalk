/**
 * @file      frontend/app/_hooks/useAuthInitializer.tsx
 * @desc      hooks: 초기 렌더 시 로그인 상태 확인 및 토큰 만료 시 자동 갱신 처리
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/app/_store/auth';

import { checkUserStatus, refreshAuthToken } from '../_apis/user';

export default function AuthInitializer() {
  const { login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let retried = false;

    const initializeUser = async () => {
      try {
        const { isLoggedIn, reason, user } = await checkUserStatus();
        if (isLoggedIn && user) {
          login(user);
        } else if (reason === 'token_expired' && !retried) {
          retried = true;
          await refreshAuthToken();
          await initializeUser();
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, [login, logout]);

  if (loading) {
    return null;
  }

  return null;
}
