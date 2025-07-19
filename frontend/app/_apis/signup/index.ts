/**
 * @file      frontend/app/_apis/signup/index.ts
 * @desc      API: 회원가입 및 임시 유저 정보 조회 요청 함수 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

import axiosInstance from '@/app/_lib/axiosNext';

import { SignupRequest, TempUserData } from '@/app/_apis/signup/types';

// 회원가입 요청 함수 - [POST] /api/generate
export const postSignup = async (userData: SignupRequest) => {
  const res = await axiosInstance.post('/auth/signup', userData);
  return res.data;
};

// redis에서 임시 유저 정보 가져오기 - [GET] /api/auth/temp-user
export const fetchTempUser = async (tempId: string): Promise<TempUserData> => {
  const res = await axiosInstance.get<TempUserData>('/auth/temp-user', {
    params: { tempId },
  });
  return res.data;
};
