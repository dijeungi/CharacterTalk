/**
 * @file      frontend/app/_apis/user/_hooks/index.ts
 * @desc      React Query: 로그인 상태 확인 및 토큰 갱신을 위한 훅과 키 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation, useQuery } from '@tanstack/react-query';

import { checkUserStatus, refreshAuthToken } from '@/app/_apis/user';

export const authKeys = createQueryKeys('auth', {
  // [GET]: 임시 유저 정보 조회
  tempUser: (tempId: string) => ['tempUser', tempId],
  // [GET]: 현재 로그인 상태 확인
  status: null,
  // [POST]: 회원가입 (Mutation)
  signup: null,
  // [POST]: 토큰 리프레시 (Mutation)
  refreshToken: null,
});

// [GET] /user (현재 로그인 상태 확인)
export const useCheckUserStatusQuery = () => {
  return useQuery({
    queryKey: authKeys.status.queryKey,
    queryFn: checkUserStatus,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// [POST] /auth/refresh (토큰 리프레시)
export const useRefreshAuthTokenMutation = () => {
  return useMutation({
    mutationKey: authKeys.refreshToken.queryKey,
    mutationFn: refreshAuthToken,
  });
};
