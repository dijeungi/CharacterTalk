// hooks/useTempUserData.ts
import { useQuery } from "@tanstack/react-query";

const fetchTempUserData = async (tempId: string) => {
  const response = await fetch(`/api/auth/temp-user?tempId=${tempId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "임시 정보 로딩 실패");
  }
  return response.json();
};

export const useTempUserData = (tempId: string) => {
  return useQuery({
    queryKey: ["tempUserData", tempId],
    queryFn: () => fetchTempUserData(tempId!),
    enabled: !!tempId,
    staleTime: Infinity,
  });
};
