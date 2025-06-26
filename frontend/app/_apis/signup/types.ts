interface TempUserData {
  email: string;
  oauth: string;
  nick_name: string;
}

interface User {
  id: string;
  nickname: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  reason?: 'token_expired' | 'no_token';
}

interface SignupRequest {
  email: string;
  oauth: string;
  fullName: string;
  gender: string;
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}
