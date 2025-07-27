/**
 * @file         frontend/app/(routes)/(public)/signup/_hooks/useTempUser.tsx
 * @desc         tempId로 임시 유저 정보를 조회하고, 성공 시 콜백을 실행하는 커스텀 훅입니다.
 *
 * @author       최준호
 * @update       2025.07.27
 */

import { useEffect } from 'react';

// modules
import { useQuery } from '@tanstack/react-query';

// types
import { TempUserData } from '@/app/(routes)/(public)/signup/_types';

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
    if (isSuccess && data?.name) {
      onSuccess?.(data);
    }
  }, [isSuccess, data?.name]);

  return {
    email: data?.email ?? '',
    oauth: data?.oauth ?? '',
  };
};
