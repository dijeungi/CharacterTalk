/**
 * @store        useSignupStore
 * @file         store/signup.ts
 * @desc         회원가입 단계에서 사용하는 입력값 전역 상태 관리
 *
 * @author       최준호
 * @since        2025.06.23
 * @updated      2025.06.25
 */

import { create } from 'zustand';

// 회원가입 추가정보 - 초기 상태
const initialState: SignupFormState = {
  fullName: '',
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
