'use client';

// modules
import { useQuery } from '@tanstack/react-query';

// api
import { checkUserStatus } from '@/app/_apis/user';

// 현재 사용자의 로그인 상태를 확인
export const useCheckUserStatus = () => {
  return useQuery<AuthState, Error>({
    queryKey: ['userStatus'],
    queryFn: checkUserStatus,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
