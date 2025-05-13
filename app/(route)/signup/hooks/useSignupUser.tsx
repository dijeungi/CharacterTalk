/*
  회원가입 API 요청 로직
  app/(route)/signup/hooks/useSignupUser.tsx
*/

// 라이브러리
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Toast } from "@/_utils/Swal";

// 회원가입 API 호출 함수
const signupUserFn = async (userData: {
  email: string;
  oauth: string;
  fullName: string;
  gender: string;
  number: string;
}) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "회원가입 실패");
  }

  return response.json();
};

// 회원가입 요청 훅
export const useSignupUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: signupUserFn,
    onSuccess: () => {
      Toast.fire({
        icon: "success",
        title: "회원가입 성공!",
      }).then(() => {
        router.push("/");
      });
    },
    onError: (err: Error) => {
      Toast.fire({
        icon: "error",
        title: `회원가입 실패: ${err.message}`,
      });
    },
  });
};
