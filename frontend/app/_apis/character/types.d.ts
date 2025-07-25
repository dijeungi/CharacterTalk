/**
 * @file      frontend/app/_apis/character/types.ts
 * @desc      Type:
 *
 * @author    최준호
 * @update    2025.07.19
 */

// =============== 캐릭터 목록 ===============

// [GET] /api/character API의 전체 응답 타입
export interface CharacterListResponse {
  characters: Character[];
  pagination: PaginationInfo;
}

// 캐릭터 목록 API 응답의 페이지네이션 정보
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCharacters: number;
  limit: number;
}

// 목록에 표시될 개별 캐릭터의 정보
export interface Character {
  id: number;
  code: string;
  name: string;
  profile_image_url: string | null;
  oneliner: string;
  genre: string;
  target: string;
  creator_name: string;
  hashtags: string[];
}

// 캐릭터 목록 필터 타입
export interface CharacterListFilters {
  sort: string;
  page: number;
}

// =============== 캐릭터 이미지 생성 ===============

// [Request] : AI 이미지 생성을 요청할 때 서버(Python)로 보내는 데이터의 타입
export interface GenerateImageRequest {
  prompt: string;
  width: number;
  height: number;
  num_images: number;
}

// [Response] : AI 이미지 생성 API의 성공 응답 타입
export interface GenerateImageResponse {
  image_urls: string[];
}

// [Response] : 캐릭터 생성 API의 성공 응답 타입
export interface CreateCharacterResponse {
  code: string;
  message: string;
}

// [Response] : 프로필 이미지 업로드 API의 성공 응답 타입
export interface UploadProfileImageResponse {
  imageUrl: string;
}
