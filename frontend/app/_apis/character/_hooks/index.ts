/**
 * @file         /app/_apis/character/_hooks/index.ts
 * @desc         캐릭터 생성 및 관리에 관련된 React Query 뮤테이션 훅 모음
 *
 * @exports
 * - `useGenerateCharacterImage`: 서버에 텍스트 프롬프트로 이미지 생성을 요청하는 훅
 * - `useUploadProfileImage`: 이미지를 서버에 업로드하고 URL을 반환받는 훅
 *
 * @dependencies
 * - @tanstack/react-query
 * - @lukemorales/query-key-factory
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.07.18
 */

// module
import { requestGenerateCharacterImage, uploadProfileImage } from '@/app/_apis/character/index';

// lib
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation } from '@tanstack/react-query';

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
