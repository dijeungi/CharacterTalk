/**
 * @lib          axiosPython
 * @file         frontend/app/lib/axiosPython.ts
 * @desc         클라이언트 전용 Axios 인스턴스 설정 및 인증 실패 시 console 인증 실패
 *
 * @config
 *  - baseURL: PYTHON_API_HOST + '/api'
 *  - withCredentials: 쿠키 기반 인증을 위해 true 설정
 *
 * @interceptors
 *  - 401 응답 시 로그인 페이지로 리다이렉트 (비로그인 상태 대응)
 *
 * @usage        클라이언트에서 API 요청 시 axiosPython import하여 사용
 * @dependencies axios, window, PYTHON_API_HOST
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

// library
import axios from 'axios';

// config
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
