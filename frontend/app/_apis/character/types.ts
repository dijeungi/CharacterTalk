/**
 * @file      frontend/app/_apis/character/types.ts
 * @desc      Type: 캐릭터 이미지 생성 요청 타입 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

export interface GenerateImageRequest {
  prompt: string;
  width: number;
  height: number;
  num_images: number;
}
