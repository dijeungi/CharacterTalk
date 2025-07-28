/**
 * @file      frontend/app/_lib/axiosNext.ts
 * @desc      Lib: 토큰 자동 갱신 및 401 처리 로직 포함된 Axios 인스턴스 설정
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { NEXT_API_HOST } from '@/app/_apis/config';
import { useAuthStore } from '@/app/_store/auth';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// AxiosInstance
const axiosNext = axios.create({
  baseURL: `${NEXT_API_HOST}/api`,
  withCredentials: true,
});

// reRefreshingToken 요청이 진행 중인지 여부
let isRefreshing = false;

// refreshToken 중 대기 중인 요청들 저장
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

// refreshToken 발급 후 대기 중이던 요청들 순서대로 처리
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// 401 응답 : '/login' Redirect
axiosNext.interceptors.response.use(
  response => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러가 아니면 에러를 그대로 반환
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // 갱신 로직이 이미 실행 중이면, 현재 요청을 큐에 추가하고 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosNext(originalRequest));
    }

    // 재시도 플래그 설정 (무한 루프 방지)
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log('액세스 토큰 만료. 토큰 갱신을 시작합니다...');
      // 새로운 액세스 토큰을 요청합니다.
      await axiosNext.post('/auth/refresh');
      console.log('토큰 갱신 성공!');

      // 갱신 성공 후, 큐에 쌓여있던 다른 요청들을 모두 재시도합니다.
      processQueue(null);

      // 원래 실패했던 요청을 RefreshToken으로 다시 실행
      return axiosNext(originalRequest);
    } catch (refreshError) {
      console.error('리프레시 토큰도 만료되었거나 유효하지 않습니다.', refreshError);
      // 4. 토큰 갱신마저 실패한 경우
      processQueue(refreshError as AxiosError);

      // Zustand 스토어의 상태를 로그아웃으로 변경
      useAuthStore.getState().logout();

      // 로그인 페이지로 이동
      if (typeof window !== 'undefined') {
        window.location.href = '/login?reason=session_expired';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosNext;
