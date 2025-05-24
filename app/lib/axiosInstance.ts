/*
  axios 인스턴스 및 401 에러 대응 인터셉터 설정
  lib/axios.ts
*/

import axios from 'axios';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

// 응답 인터셉터 - 토큰 만료 시 재발급 처리
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // 401 에러 발생 시 재시도 로직 실행
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axiosInstance.get('/api/auth/refresh').finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      try {
        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
