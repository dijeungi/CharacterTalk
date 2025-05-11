// app/auth/signup/page.tsx

"use client";

// default
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// css
import style from "@/styles/auth/SignUp.module.css";

// Hooks
import { useTempUserData } from "@/hooks/auth/useTempUserData";
import { useSignupUser } from "@/hooks/auth/useSignupUser";
import { useSignUpForm } from "@/hooks/auth/useSignUpForm";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const tempId = searchParams.get("tempId");

  // 임시 사용자 데이터 fetching
  const { data: tempUserData } = useTempUserData(tempId!);

  // 회원가입 요청 mutation
  const { mutate: signup } = useSignupUser();

  // 폼 상태 관리
  const { form, handleChange, focusedField, setFocusedField, setForm } =
    useSignUpForm();

  // tempUserData가 로드되면 폼 상태 업데이트
  useEffect(() => {
    if (tempUserData) {
      setForm((prevForm) => ({
        ...prevForm,
        email: tempUserData.email,
        fullName: tempUserData.full_name,
      }));
    }
  }, [tempUserData, setForm]);

  // 회원가입 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitForm = {
      ...form,
      number: form.number.replace(/-/g, ""),
    };
    signup(submitForm);
  };

  return (
    <div className={style.Container}>
      <div className={style.Content}>
        <h2 className={style.Title}>
          회원가입 완료를 위해서
          <br />
          간단한 정보를 입력해 주세요.
          <p className={style.SubTitle}>
            회원가입을 완료하기 위해 몇 가지 정보를 더 입력해주세요.
          </p>
        </h2>

        {/* 이메일 입력 필드 */}
        <div className={style.InputGroup}>
          {(focusedField === "email" || form.email) && (
            <label className={style.ClickLabel}>이메일</label>
          )}
          <input
            className={style.Email}
            type="email"
            name="email"
            value={form.email}
            disabled
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            placeholder={
              focusedField !== "email" && !form.email ? "이메일" : ""
            }
          />
        </div>

        {/* 성함 입력 필드 */}
        <div className={style.InputGroup}>
          {(focusedField === "fullName" || form.fullName) && (
            <label className={style.ClickLabel}>성함</label>
          )}
          <input
            className={style.FullName}
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onFocus={() => setFocusedField("fullName")}
            onBlur={() => setFocusedField(null)}
            placeholder={
              focusedField !== "fullName" && !form.fullName ? "성함" : ""
            }
            required
          />
        </div>

        {/* 성별 선택 필드 */}
        <div className={style.InputGroup}>
          {(focusedField === "gender" || form.gender) && (
            <label className={style.ClickLabel}>성별</label>
          )}
          <select
            className={style.Select}
            name="gender"
            value={form.gender}
            onChange={handleChange}
            onFocus={() => setFocusedField("gender")}
            onBlur={() => setFocusedField(null)}
            required
          >
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        {/* 전화번호 입력 필드 */}
        <div className={style.InputGroup}>
          {(focusedField === "number" || form.number) && (
            <label className={style.ClickLabel}>전화번호</label>
          )}
          <input
            className={style.FullName}
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            onFocus={() => setFocusedField("number")}
            onBlur={() => setFocusedField(null)}
            placeholder={
              focusedField !== "number" && !form.number ? "전화번호" : ""
            }
            required
          />
        </div>
      </div>

      {/* 회원가입 완료 버튼 */}
      <button onClick={handleSubmit} className={style.Button}>
        가입 완료
      </button>
    </div>
  );
}
