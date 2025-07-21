/**
 * @file      frontend/app/_types/lib/index.d.ts
 * @desc      Type: 액세스 토큰 페이로드(JWT) 데이터 구조 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export interface AccessTokenPayload {
  code: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}
