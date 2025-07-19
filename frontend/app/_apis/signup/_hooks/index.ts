/**
 * @file      frontend/app/_apis/signup/_hooks/index.ts
 * @desc      React Query: 회원가입 및 임시 유저 조회를 위한 훅과 키 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation, useQuery } from '@tanstack/react-query';

import { SignupRequest } from '@/app/_apis/signup/types';
import { fetchTempUser, postSignup } from '@/app/_apis/signup';

// Query Key
export const authKeys = createQueryKeys('auth', {
  tempUser: (tempId: string) => ['tempUser', tempId],
  signup: null,
});

// [POST] /auth/signup (회원가입)
export const useSignupMutation = () => {
  return useMutation({
    mutationKey: authKeys.signup.queryKey,
    mutationFn: (userData: SignupRequest) => postSignup(userData),
  });
};

// [GET] /auth/temp-user (임시 유저 정보 조회)
export const useFetchTempUserQuery = (tempId: string) => {
  return useQuery({
    queryKey: authKeys.tempUser(tempId).queryKey,
    queryFn: () => fetchTempUser(tempId),
    enabled: !!tempId,
  });
};
