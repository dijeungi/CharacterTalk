/**
 * @file      frontend/app/_apis/signup/types.ts
 * @desc      Type: 임시 유저 및 회원가입 요청 데이터 구조 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

export interface TempUserData {
  email: string;
  oauth: string;
  name: string;
}

export interface SignupRequest {
  email: string;
  oauth: string;
  name: string;
  gender: string;
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}
