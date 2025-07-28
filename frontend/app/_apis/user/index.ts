/**
 * @file      frontend/app/_apis/user/index.ts
 * @desc      API: 로그인 상태 확인 및 토큰 갱신 요청 함수 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

import axiosInstance from '@/app/_lib/axiosNext';

import { AuthState, Character } from '@/app/_apis/user/types';

// 현재 로그인 상태 확인 - [GET] /api/user
export const checkUserStatus = async (): Promise<AuthState> => {
  const response = await axiosInstance.get<AuthState>('/user');
  console.log('[', new Date().toLocaleString(), '] /user 응답:', response.data);
  return response.data;
};

// 액세스 토큰 리프레시 - [POST] /api/auth/refresh
export const refreshAuthToken = async (): Promise<any> => {
  const response = await axiosInstance.post('/auth/refresh');
  console.log('/refresh 응답:', response.data);
  return response.data;
};

// 내 캐릭터 목록 조회 - [GET] /api/user/characters
export const getMyCharacters = async (): Promise<Character[]> => {
  const response = await axiosInstance.get<Character[]>('/user/characters');
  return response.data;
};
