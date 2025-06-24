/**
 * @types        SignupTypes
 * @file         types/signup/index.d.ts
 * @desc         회원가입 단계에서 사용되는 폼 상태, 요청 페이로드, 컴포넌트 props, 임시 사용자 타입 정의
 *
 * @state
 *  - SignupFormState: 이름, 주민번호, 휴대폰번호 입력값 상태
 *  - TempUserData: 소셜 로그인 후 받아오는 임시 사용자 정보
 *
 * @actions
 *  - SignupFormActions: 상태 필드별 setter 및 전체 초기화 액션
 *  - TempUserAction: 상태 디스패치용 액션 타입
 *
 * @usage
 *  - Zustand store 상태 관리
 *  - 회원가입 요청 payload
 *  - 각 컴포넌트 입력 props 타입 지정
 *
 * @dependencies 없음
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.24
 */

// frontend/app/(routes)/(public)/signup/page.tsx
export interface SignupPayload {
  email: string;
  oauth: string;
  fullName: string;
  residentFront: string;
  residentBack: string;
  gender: 'M' | 'F';
  birthDate: string;
  number: string;
  verified: boolean;
}

// frontend/app/(routes)/(public)/signup/_components/FullNameInput.tsx
export interface FullNameInputProps {
  editable?: boolean;
}

// frontend/app/(routes)/(public)/signup/_components/PhoneInput.tsx
export interface PhoneInputProps {
  onChangeOnly?: boolean;
}

// frontend/app/(routes)/(public)/signup/_components/ResidentInput.tsx
export interface ResidentInputProps {
  editable?: boolean;
}

// frontend/app/(routes)/(public)/signup/_components/VerifyCodeInput.tsx
export interface VerifyCodeInputProps {
  onConfirm: (code: string) => Promise<void>;
}

// frontend/app/(routes)/(public)/signup/_hooks/useTempUser.tsx
export interface TempUserData {
  email: string;
  oauth: string;
  nick_name: string;
}

export interface TempUserAction {
  name: 'nickName';
  value: string;
}

// frontend/app/store/signupStore.ts
export interface SignupFormState {
  fullName: string;
  residentFront: string;
  residentBack: string;
  number: string;
}

export interface SignupFormActions {
  setFormField: <K extends keyof SignupFormState>(field: K, value: SignupFormState[K]) => void;
  resetForm: () => void;
}
