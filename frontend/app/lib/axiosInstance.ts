/*
  axios 인스턴스
  lib/axios.ts
*/

import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '/',
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
