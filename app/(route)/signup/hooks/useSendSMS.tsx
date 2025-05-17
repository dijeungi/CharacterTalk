/*
  문자 메시지 전송 로직
  app/(route)/signup/hooks/useSendSMS.tsx
*/

// 라이브러리
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/_utils/Swal";

// 문자 메시지 전송 API 호출 함수
const sendSMSFn = async (phoneNumber: string) => {
  const response = await fetch("/api/auth/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "문자 전송 실패");
  }

  return response.json();
};

// 문자 메시지 전송 훅
export const useSendSMS = () => {
  return useMutation({
    mutationFn: sendSMSFn,
    onSuccess: () => {
      Toast.fire({ icon: "success", title: "문자가 발송되었습니다." });
    },
    onError: (err: Error) => {
      Toast.fire({ icon: "error", title: `문자 발송 실패: ${err.message}` });
    },
  });
};
