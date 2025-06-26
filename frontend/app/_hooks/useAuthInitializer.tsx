/**
 * @hook         -
 * @file         -
 * @desc         -
 *
 * @usage        -
 *
 * @features
 *  -
 *
 * @dependencies
 *  -
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.23
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/_store/auth';
import { checkUserStatus, refreshAuthToken } from '../_apis/signup';

export default function AuthInitializer() {
  const { login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let retried = false;

    const initializeUser = async () => {
      try {
        // api 요청 후 response 받기
        const { isLoggedIn, reason, user } = await checkUserStatus();

        if (isLoggedIn && user) {
          login(user);
          // 토큰 만료 시
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
