/**
 * @hook         useTempUser
 * @file         frontend/app/(routes)/(public)/signup/_hooks/useTempUser.tsx
 * @desc         소셜 로그인 후 생성된 임시 사용자 정보 조회 훅
 *
 * @usage        회원가입 단계에서 이메일, 닉네임 등의 기본 정보 불러올 때 사용
 *
 * @features
 *  - tempId 기반 사용자 정보 fetch
 *  - Zustand 등 외부 상태로 값 전달
 *
 * @dependencies
 *  - react-query, axiosInstance
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

import { useEffect } from 'react';

// modules
import { useQuery } from '@tanstack/react-query';

// api
import { fetchTempUser } from '@/app/_apis/signup';

// 임시 사용자 정보를 불러오고 상태 전달
export const useTempUser = (
  tempId: string | null,
  onSuccess?: (userData: TempUserData) => void
) => {
  // React Query로 tempId 기반 사용자 정보 fetch
  const { data, isSuccess } = useQuery<TempUserData, Error>({
    queryKey: ['tempUser', tempId],
    queryFn: () => fetchTempUser(tempId!),
    enabled: !!tempId,
  });

  // 닉네임 정보가 있으면 dispatch로 store 저장
  useEffect(() => {
    if (isSuccess && data?.nick_name) {
      onSuccess?.(data);
    }
  }, [isSuccess, data?.nick_name]);

  return {
    email: data?.email ?? '',
    oauth: data?.oauth ?? '',
  };
};
