/**
 * @file      frontend/app/_apis/character/_hooks/index.ts
 * @desc      React Query: 캐릭터 이미지 생성 및 업로드 훅과 키 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

import { requestGenerateCharacterImage, uploadProfileImage } from '@/app/_apis/character';
import { GenerateImageRequest } from '@/app/_apis/character/types';

import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation } from '@tanstack/react-query';

// Query Key
export const characterKeys = createQueryKeys('character', {
  list: (filters: { sort: string; page: number }) => ['list', filters],
  detail: (code: string) => ['detail', code],

  generateImage: null,
  uploadProfile: null,
});

// [POST] /api/generate (캐릭터 이미지 생성)
export const useGenerateCharacterImage = () => {
  return useMutation({
    mutationKey: characterKeys.generateImage.queryKey,
    mutationFn: (payload: GenerateImageRequest) => requestGenerateCharacterImage(payload),
  });
};

// [POST] /api/upload-profile-image (클라우드 R2 업로드)
export const useUploadProfileImage = (setProfileImage: (url: string) => void) => {
  return useMutation({
    mutationKey: characterKeys.uploadProfile.queryKey,
    mutationFn: (formData: FormData) => uploadProfileImage(formData),
    onSuccess: data => {
      setProfileImage(data.imageUrl);
    },
  });
};
