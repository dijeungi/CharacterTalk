/**
 * @file      frontend/app/_types/firebase/index.d.ts
 * @desc      Type: 전역 객체에 Firebase RecaptchaVerifier 속성 확장 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

// modules
import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
