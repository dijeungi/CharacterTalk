// frontend/app/_apis/auth.ts

import axiosInstance from '@/app/lib/axiosNext';
import { TempUserData } from '@/app/types/signup/index';

// 회원가입 요청 API
export const postSignup = async (userData: {
  email: string;
  oauth: string;
  fullName: string;
  gender: string;
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}) => {
  const res = await axiosInstance.post('/auth/signup', userData);
  return res.data;
};

// 임시 저장 Redis에서 유저 데이터 가져오기
export const fetchTempUser = async (tempId: string): Promise<TempUserData> => {
  const res = await axiosInstance.get<TempUserData>('/auth/temp-user', {
    params: { tempId },
  });
  return res.data;
};
