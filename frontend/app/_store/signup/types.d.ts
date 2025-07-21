/**
 * @file      frontend/app/_store/signup/types.d.ts
 * @desc      Type: 회원가입 추가정보 입력 상태 및 필드 수정 액션 타입 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export interface SignupFormState {
  name: string;
  residentFront: string;
  residentBack: string;
  number: string;
}

export interface SignupFormActions {
  setFormField: <K extends keyof SignupFormState>(field: K, value: SignupFormState[K]) => void;
  resetForm: () => void;
}
