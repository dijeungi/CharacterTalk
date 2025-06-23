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
