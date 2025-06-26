// components
export interface SignUpInputProps {
  editable?: boolean;
  onChangeOnly?: boolean;
  onConfirm?: (code: string) => void;
}

// custom hooks
interface TempUserData {
  email: string;
  oauth: string;
  nick_name: string;
}

// pages
export interface SignupPayload {
  email: string;
  oauth: string;
  fullName: string;
  gender: 'M' | 'F';
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}
