/**
 * @lib          axiosNext
 * @file         frontend/app/lib/axiosNext.ts
 * @desc         클라이언트 전용 Axios 인스턴스 설정 및 인증 실패 시 리다이렉션 처리
 *
 * @config
 *  - baseURL: NEXT_API_HOST + '/api'
 *  - withCredentials: 쿠키 기반 인증을 위해 true 설정
 *
 * @interceptors
 *  - 401 응답 시 로그인 페이지로 리다이렉트 (비로그인 상태 대응)
 *
 * @usage        클라이언트에서 API 요청 시 axiosNext import하여 사용
 * @dependencies axios, window, NEXT_API_HOST
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

// library
import axios from 'axios';

// config
import { NEXT_API_HOST } from '@/app/_apis/config';

// AxiosInstance
const axiosNext = axios.create({
  baseURL: `${NEXT_API_HOST}/api`,
  withCredentials: true,
});

export default axiosNext;

// 401 응답 : '/login' Redirect
axiosNext.interceptors.response.use(
  res => res,
  error => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
