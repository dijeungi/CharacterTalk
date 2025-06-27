interface TempUserData {
  email: string;
  oauth: string;
  name: string;
}

interface SignupRequest {
  email: string;
  oauth: string;
  name: string;
  gender: string;
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}
