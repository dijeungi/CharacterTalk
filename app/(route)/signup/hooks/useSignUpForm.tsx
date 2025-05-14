/*
  회원가입 입력값 관리 로직
  app/(route)/signup/hooks/useSignUpForm.tsx
*/

// 라이브러리
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// 포커스 필드 타입 정의
type FocusedField = "email" | "fullName" | "gender" | "number" | null;

// 회원가입 폼 상태 관리 훅
export const useSignUpForm = () => {
  const searchParams = useSearchParams();
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    oauth: "KAKAO",
    fullName: searchParams.get("fullName") || "",
    gender: "",
    number: "",
    carrier: "",
    residentFront: "",
    residentBack: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "number") {
      let onlyNums = value.replace(/[^0-9]/g, "");
      let formattedNumber = onlyNums;
      if (onlyNums.length < 4) {
        formattedNumber = onlyNums;
      } else if (onlyNums.length < 8) {
        formattedNumber = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      } else {
        formattedNumber = `${onlyNums.slice(0, 3)}-${onlyNums.slice(
          3,
          7
        )}-${onlyNums.slice(7, 11)}`;
      }
      setForm({ ...form, [name]: formattedNumber });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return { form, handleChange, focusedField, setFocusedField, setForm };
};
