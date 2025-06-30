/**
 * @hook         useFirebaseAuth
 * @file         frontend/app/(routes)/(public)/signup/_hooks/useFirebaseAuth.tsx
 * @desc         Firebase 휴대폰 인증 및 reCAPTCHA 초기화 훅
 *
 * @usage        인증번호 요청 및 확인 로직에서 호출
 *
 * @features
 *  - invisible reCAPTCHA 초기화
 *  - 휴대폰 번호로 인증번호 전송
 *  - confirmation 상태 전달
 *
 * @dependencies
 *  - firebase/auth, Toast, useEffect
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.23
 */

import { useEffect } from 'react';

// Firebase Authentication Module
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

// config
import { auth } from '@/app/_firebase/config';

// hooks & utils
import { Toast } from '@/app/_utils/Swal';

export function useFirebaseAuth(setConfirmation: (c: ConfirmationResult) => void) {
  // reCAPTCHA가 없을 경우 invisible 방식으로 클라이언트에 동적 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      setTimeout(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }, 0);
    }
  }, []);

  // 인증번호 요청 후 confirmation 상태 저장 및 결과 알림 처리
  const requestSMS = async (rawPhone: string) => {
    try {
      const phone = '+82' + rawPhone.replace(/-/g, '').slice(1);
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) throw new Error('reCAPTCHA 초기화 안됨');

      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmation);

      Toast.fire({
        icon: 'success',
        title: '인증번호가 전송되었습니다.',
      });
      return true;
    } catch (error: any) {
      Toast.fire({
        icon: 'error',
        title: error.message || 'SMS 전송 실패',
      });
      throw error;
    }
  };

  return { requestSMS };
}
