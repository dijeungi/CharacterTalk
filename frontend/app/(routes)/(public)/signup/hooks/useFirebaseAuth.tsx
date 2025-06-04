import { useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../../../../firebase/config';
import { Toast } from '../../../../_utils/Swal';

export function useFirebaseAuth(setConfirmation: (c: ConfirmationResult) => void) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      setTimeout(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }, 0);
    }
  }, []);

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
