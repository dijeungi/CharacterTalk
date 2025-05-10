// hooks/useSignUpForm.ts
import { useState } from "react";
import { useSearchParams } from "next/navigation";

type FocusedField = "email" | "fullName" | "gender" | "number" | null;

export const useSignUpForm = () => {
  const searchParams = useSearchParams();
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    oauth: "KAKAO",
    fullName: searchParams.get("fullName") || "",
    gender: "",
    number: "",
  });

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
