/**
 * @file      frontend/app/_apis/character/_hooks/index.ts
 * @desc      React Query: 캐릭터 이미지 생성 및 업로드 훅과 키 정의
 *
 * @author    최준호
 * @update    2025.07.20
 */

import {
  fetchCharacters,
  fetchCharacterDetail,
  requestGenerateCharacterImage,
  uploadProfileImage,
} from '@/app/_apis/character';
import { CharacterListFilters, GenerateImageRequest } from '@/app/_apis/character/types';

import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation, useQuery } from '@tanstack/react-query';

// Query Key
export const characterKeys = createQueryKeys('character', {
  list: (filters: { sort: string; page: number }) => ['list', filters],
  detail: (code: string) => ['detail', code],
  generateImage: null,
  uploadProfile: null,
});

// [GET] /api/character?
export const useFetchCharactersQuery = (filters: CharacterListFilters) => {
  return useQuery({
    queryKey: characterKeys.list(filters).queryKey,
    queryFn: () => fetchCharacters(filters),
  });
};

// [GET] /api/character/[code]
export const useCharacterDetailQuery = (code: string) => {
  return useQuery({
    queryKey: characterKeys.detail(code).queryKey,
    queryFn: () => fetchCharacterDetail(code),
    enabled: !!code, // 코드가 있을 때만 쿼리 실행
  });
};

// [POST] /api/generate (캐릭터 이미지 생성)
export const useGenerateCharacterImage = () => {
  return useMutation({
    mutationKey: characterKeys.generateImage.queryKey,
    mutationFn: (payload: GenerateImageRequest) => requestGenerateCharacterImage(payload),
  });
};

// [POST] /api/upload-profile-image (클라우드 R2 업로드)
export const useUploadProfileImage = () => {
  return useMutation({
    mutationKey: characterKeys.uploadProfile.queryKey,
    mutationFn: (formData: FormData) => uploadProfileImage(formData),
  });
};

