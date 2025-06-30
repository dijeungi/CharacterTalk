// frontend/app/_apis/auth.ts

import axiosInstance from '@/app/_lib/axiosNext';

// 회원가입 요청
export const postSignup = async (userData: SignupRequest) => {
  const res = await axiosInstance.post('/auth/signup', userData);
  return res.data;
};

// 임시 유저 정보 가져오기
export const fetchTempUser = async (tempId: string): Promise<TempUserData> => {
  const res = await axiosInstance.get<TempUserData>('/auth/temp-user', {
    params: { tempId },
  });
  return res.data;
};
