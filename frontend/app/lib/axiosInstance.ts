/*
  axios 인스턴스
  lib/axios.ts
*/

import axios from 'axios';
import { API_SERVER_HOST } from '@/app/_apis/config';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: `${API_SERVER_HOST}/api`,
  withCredentials: true,
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
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

export default axiosInstance;
