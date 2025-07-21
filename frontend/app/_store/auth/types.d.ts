/**
 * @file      frontend/app/_store/auth/types.d.ts
 * @desc      Type: 인증 상태 및 로그인/로그아웃 메서드를 포함한 Zustand 스토어 타입 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export interface AuthStore {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
