// frontend/app/_apis/user/index.ts

import axiosInstance from '@/app/_lib/axiosNext';

// 현재 로그인 상태 확인
export const checkUserStatus = async (): Promise<AuthState> => {
  const response = await axiosInstance.get<AuthState>('/user');
  console.log('/user 응답:', response.data);
  return response.data;
};

// 액세스 토큰 리프레시
export const refreshAuthToken = async (): Promise<any> => {
  const response = await axiosInstance.post('/auth/refresh');
  console.log('/refresh 응답:', response.data);
  return response.data;
};
