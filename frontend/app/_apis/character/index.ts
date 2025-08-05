/**
 * @file      frontend/app/_apis/character/index.ts
 * @desc      API: 캐릭터 목록, 생성, 이미지 생성 및 프로필 업로드 요청 함수 정의
 *
 * @author    최준호
 * @update    2025.08.05
 */

import axiosNext from '@/app/_lib/axiosNext';
import axiosPython from '@/app/_lib/axiosPython';

import {
  CharacterListFilters,
  CharacterListResponse,
  CreateCharacterResponse,
  GenerateImageRequest,
  GenerateImageResponse,
  UploadProfileImageResponse,
  CharacterDetailResponse,
} from '@/app/_apis/character/types';

// 캐릭터 목록을 불러오는 API 함수 - [GET] /api/character?
export const fetchCharacters = async (filters: CharacterListFilters) => {
  const res = await axiosNext.get<CharacterListResponse>(
    `/character?sort=${filters.sort}&page=${filters.page}&limit=8`
  );
  return res.data;
};

// 캐릭터 프로필 사진 생성 API 호출 함수 - [POST] /api/generate
export const requestGenerateCharacterImage = async (payload: GenerateImageRequest) => {
  const res = await axiosPython.post<GenerateImageResponse>('/generate/', payload);
  return res.data;
};

// 캐릭터 생성 API 호출 함수 - [POST] /api/character/new
export const createCharacter = async (formData: FormData) => {
  const response = await axiosNext.post<CreateCharacterResponse>('/character/new', formData);
  return response.data;
};

// 캐릭터 프로필 업로드 시 파일을 서버로 전송 함수 - [POST] /api/upload-profile-image
export const uploadProfileImage = async (formData: FormData) => {
  const response = await axiosNext.post<UploadProfileImageResponse>(
    '/character/profile/upload',
    formData
  );
  return response.data;
};

// 캐릭터 상세 정보를 불러오는 API 함수 - [GET] /api/character/[code]
export const fetchCharacterDetail = async (code: string) => {
  const res = await axiosNext.get<CharacterDetailResponse>(`/character/${code}`);
  return res.data;
};

// 메시지 반응(이모티콘) 추가/삭제 API 함수 - [POST] /api/messages/{message_uuid}/reactions/
export const toggleReaction = async (messageUuid: string, emoji: string) => {
  const res = await axiosNext.post(`/messages/${messageUuid}/reactions/`, { emoji });
  return res.data;
};
