/*
  회원가입 API 요청 로직
  app/(route)/signup/hooks/useSignupUser.tsx
*/

'use client';

// 라이브러리
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Toast } from '@/_utils/Swal';
import axiosInstance from '@/lib/axiosInstance';

// 회원가입 API 호출 함수
const signupUserFn = async (userData: {
  email: string;
  oauth: string;
  fullName: string;
  gender: string;
  number: string;
  residentFront: string;
  residentBack: string;
  verified: boolean;
  birthDate: string;
}) => {
  const response = await axiosInstance.post('/api/auth/signup', userData);
  return response.data;
};

// 회원가입 요청 훅
export const useSignupUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: signupUserFn,
    onSuccess: () => {
      Toast.fire({
        icon: 'success',
        title: '회원가입 성공!',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push('/');
      });
    },
    onError: (err: Error) => {
      if (!err.message || typeof window === 'undefined') return;

      Toast.fire({
        icon: 'error',
        title: `회원가입 실패: ${err.message}`,
      });
    },
  });
};
