/**
 * @file         frontend/app/(routes)/(public)/signup/_types/index.d.ts
 * @desc         회원가입 폼들의 타입
 *
 * @author       최준호
 * @update       2025.07.27
 */

export interface BaseInputProps {
  editable?: boolean;
  onChangeOnly?: boolean;
}

export interface VerifyCodeInputProps extends BaseInputProps {
  onConfirm: (code: string) => void;
}

// custom hooks
export interface TempUserData {
  email: string;
  oauth: string;
  name: string;
}

// pages
export interface SignupPayload {
  email: string;
  oauth: string;
  name: string;
  gender: 'M' | 'F';
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}
