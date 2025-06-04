/*
  클라이언트 진입 시 accessToken 없거나 만료 시 refreshToken으로 silent refresh 시도
  app/_hooks/useAuthRestore.ts
*/

'use client';

// React, Next.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../lib/axiosInstance';

type JwtPayload = {
  exp: number; // 토큰 만료 시간 (초)
};

// 쿠키에서 accessToken 가져오기
const getAccessToken = () =>
  document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];

// accessToken 만료 여부 체크
const isExpired = (token: string) => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// 쿠키에서 refreshToken 가져오기
const getRefreshToken = () =>
  document.cookie
    .split('; ')
    .find(row => row.startsWith('refresh_token='))
    ?.split('=')[1];

export const useAuthRestore = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // 둘 다 없으면 리턴
    if (!accessToken && !refreshToken) return;

    // accessToken 없거나 만료, refreshToken 있으면 silent refresh 요청
    if ((!accessToken || isExpired(accessToken)) && refreshToken) {
      axiosInstance
        .post('/api/auth/refresh', {}, { withCredentials: true })
        .then(res => {
          // 토큰 갱신 후 쿠키 재설정 (주석 처리된 부분 복구 필요)
          // document.cookie = `accessToken=${res.data.accessToken}; path=/;`;
        })
        .catch(() => {
          router.push('/login'); // 실패 시 로그인 페이지 이동
        });
    }
  }, []);
};
