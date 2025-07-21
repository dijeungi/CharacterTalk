/**
 * @file      frontend/app/_store/signup/index.ts
 * @desc      Store: 회원가입 추가정보 입력값을 위한 상태 및 액션 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { create } from 'zustand';
import { SignupFormActions, SignupFormState } from '@/app/_store/signup/types';

// 회원가입 추가정보 - 초기 상태
const initialState: SignupFormState = {
  name: '',
  residentFront: '',
  residentBack: '',
  number: '',
};

// 회원가입 추가정보 - 사용자 입력값 상태 관리 (위 초기상태 input)
export const useSignupStore = create<SignupFormState & SignupFormActions>(set => ({
  ...initialState,
  setFormField: (field, value) => set({ [field]: value }),
  resetForm: () => set(initialState),
}));
