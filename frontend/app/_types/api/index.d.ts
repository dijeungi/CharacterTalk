/**
 * @file      frontend/app/_types/api/index.d.ts
 * @desc      Type: 디코딩된 JWT 토큰에서 추출한 사용자 정보 구조 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export interface DecodedToken {
  code: string;
  id: string;
  name: string;
}
