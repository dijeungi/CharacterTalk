/*
  문자 인증번호 인증 로직
  app/(route)/signup/hooks/useVerifySMS.tsx
*/

// 라이브러리
import { useMutation } from "@tanstack/react-query";

// 문자 인증번호 검증 API 함수
const verifySMSFn = async (data: { phoneNumber: string; code: string }) => {
  const response = await fetch("/api/auth/verify-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "인증 실패");
  }

  return response.json();
};

// 문자 인증번호 검증 훅
export const useVerifySMS = () => {
  return useMutation({
    mutationFn: verifySMSFn,
  });
};
