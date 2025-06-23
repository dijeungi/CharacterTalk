/**
 * @hook         useSignupUser
 * @file         frontend/app/(routes)/(public)/signup/_hooks/useSignupUser.tsx
 * @desc         회원가입 API 요청 훅
 *
 * @usage        회원가입 버튼 클릭 시 호출
 *
 * @features
 *  - 서버에 POST 요청
 *  - 성공 시 홈 리디렉션
 *  - 실패 시 토스트 알림
 *
 * @dependencies
 *  - react-query, axiosInstance, Toast, useRouter
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

'use client';
import { useRouter } from 'next/navigation';

// modules
import { useMutation } from '@tanstack/react-query';

// components
import { postSignup } from '@/app/_apis/signup/auth';

// utils
import { Toast } from '@/app/_utils/Swal';

// 회원가입 요청 hooks
export const useSignupUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postSignup,
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
      Toast.fire({ icon: 'error', title: `회원가입 실패: ${err.message}` });
    },
  });
};
