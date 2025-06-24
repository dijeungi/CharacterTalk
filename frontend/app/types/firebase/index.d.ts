/**
 * @types        WindowRecaptchaExtension
 * @file         types/firebase/window.d.ts
 * @desc         Firebase 휴대폰 인증을 위한 window.recaptchaVerifier 타입 확장
 *
 * @state
 *  - window.recaptchaVerifier: Firebase에서 사용할 invisible reCAPTCHA 인스턴스
 *
 * @actions
 *  - 없음 (전역 객체 확장 목적)
 *
 * @usage        Firebase Auth 휴대폰 인증에서 reCAPTCHA 인스턴스를 전역으로 재사용할 때 사용
 * @dependencies firebase/auth
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.24
 */

// modules
import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
