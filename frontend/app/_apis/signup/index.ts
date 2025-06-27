// frontend/app/_apis/auth.ts

import axiosInstance from '@/app/lib/axiosNext';

// 회원가입 요청
export const postSignup = async (userData: SignupRequest) => {
  const res = await axiosInstance.post('/auth/signup', userData);
  return res.data;
};

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

// 임시 유저 정보 가져오기
export const fetchTempUser = async (tempId: string): Promise<TempUserData> => {
  const res = await axiosInstance.get<TempUserData>('/auth/temp-user', {
    params: { tempId },
  });
  return res.data;
};
