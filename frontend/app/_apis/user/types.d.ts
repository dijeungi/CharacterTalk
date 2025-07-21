/**
 * @file      frontend/app/_apis/user/types.ts
 * @desc      Type: 유저 정보와 인증 상태 데이터 구조 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  reason?: 'token_expired' | 'no_token';
}
