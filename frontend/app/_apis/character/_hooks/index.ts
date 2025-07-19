/**
 * @file      frontend/app/_apis/character/_hooks/index.ts
 * @desc      캐릭터 생성 및 관리에 필요한 React Query 훅과 키를 정의합니다.
 *
 * @author    최준호
 * @update      2025.07.19
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

// [POST] /api/generate
export const useGenerateCharacterImage = () => {
  return useMutation({
    mutationKey: characterKeys.generateImage.queryKey,
    mutationFn: (payload: GenerateImageRequest) => requestGenerateCharacterImage(payload),
  });
};

// [POST] /api/upload-profile-image
export const useUploadProfileImage = (setProfileImage: (url: string) => void) => {
  return useMutation({
    mutationKey: characterKeys.uploadProfile.queryKey,
    mutationFn: (formData: FormData) => uploadProfileImage(formData),
    onSuccess: data => {
      setProfileImage(data.imageUrl);
    },
  });
};
