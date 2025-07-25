// components
export interface BaseInputProps {
  editable?: boolean;
  onChangeOnly?: boolean;
}

export interface VerifyCodeInputProps extends BaseInputProps {
  onConfirm: (code: string) => void;
}

// custom hooks
interface TempUserData {
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
