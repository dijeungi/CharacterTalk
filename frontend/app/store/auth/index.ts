/**
 * @store        useSignupStore
 * @file         store/auth/index.ts
 * @desc         회원가입 단계에서 사용하는 입력값 전역 상태 관리
 *
 * @state
 *  - fullName: 사용자 이름 또는 닉네임
 *  - residentFront: 주민번호 앞 6자리
 *  - residentBack: 주민번호 뒤 1자리
 *  - number: 휴대폰 번호
 *
 * @actions
 *  - setFormField: 특정 필드 값을 개별 갱신
 *  - resetForm: 전체 상태 초기화
 *
 * @usage        회원가입 페이지 (step1~4)에서 입력값 유지 및 검증 용도로 사용
 * @dependencies Zustand
 *
 * @author       최준호
 * @since        2025.06.23
 * @updated      2025.06.23
 */

// modules
import { create } from 'zustand';

// types
import { SignupFormState, SignupFormActions } from '@/app/types/signup/index';

// 초기 상태
const initialState: SignupFormState = {
  fullName: '',
  residentFront: '',
  residentBack: '',
  number: '',
};

// 회원가입 muti-step에서 사용자 입력값 상태 관리 (위 초기상태 input)
export const useSignupStore = create<SignupFormState & SignupFormActions>(set => ({
  ...initialState,
  setFormField: (field, value) => set({ [field]: value }),
  resetForm: () => set(initialState),
}));
