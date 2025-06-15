// types/firebase.d.ts

import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
