/**
 * @file      frontend/app/_lib/axiosPython.ts
 * @desc      Lib: 토큰 자동 갱신 및 401 처리 로직 포함된 Axios 인스턴스 설정
 *
 * @author    최준호
 * @update    2025.07.21
 */

import axios from 'axios';

import { PYTHON_API_HOST } from '@/app/_apis/config';

// axiosInstance
const axiosPython = axios.create({
  baseURL: `${PYTHON_API_HOST}/api`,
});

export default axiosPython;

// 401 응답 : console message
axiosPython.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      console.warn('인증 실패: Python 서버');
    }
    return Promise.reject(error);
  }
);
