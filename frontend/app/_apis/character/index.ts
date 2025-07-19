/**
 * @file      frontend/app/_apis/character/index.ts
 * @desc      API: 캐릭터 생성, 이미지 생성 및 프로필 업로드 요청 함수 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

import axiosNext from '@/app/_lib/axiosNext';
import axiosPython from '@/app/_lib/axiosPython';

import { GenerateImageRequest } from '@/app/_apis/character/types';

// 캐릭터 프로필 사진 생성 API 호출 함수 - [POST] /api/generate
export const requestGenerateCharacterImage = async (payload: GenerateImageRequest) => {
  const res = await axiosPython.post('/generate/', payload);
  return res.data;
};

// 캐릭터 생성 API 호출 함수 - [POST] /api/character/new
export const createCharacter = async (formData: FormData) => {
  const response = await axiosNext.post('/character/new', formData);
  return response.data;
};

// 캐릭터 프로필 업로드 시 파일을 서버로 전송 함수 - [POST] /api/upload-profile-image
export const uploadProfileImage = async (formData: FormData) => {
  const response = await axiosNext.post('/character/profile/upload', formData);
  return response.data;
};
