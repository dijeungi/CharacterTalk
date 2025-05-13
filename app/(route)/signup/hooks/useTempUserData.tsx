/*
  임시 사용자 데이터 조회 로직
  app/(route)/signup/hooks/useTempUserData.tsx
*/

// 라이브러리
import { useQuery } from "@tanstack/react-query";

// 임시 사용자 데이터 조회 API 함수
const fetchTempUserData = async (tempId: string) => {
  const response = await fetch(`/api/auth/temp-user?tempId=${tempId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "임시 정보 로딩 실패");
  }
  return response.json();
};

// 임시 사용자 데이터 조회 훅
export const useTempUserData = (tempId: string) => {
  return useQuery({
    queryKey: ["tempUserData", tempId],
    queryFn: () => fetchTempUserData(tempId!),
    enabled: !!tempId,
    staleTime: Infinity,
  });
};
