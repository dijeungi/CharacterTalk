/*
  회원가입 페이지 UI
  app/(route)/signup/page.tsx
*/

"use client";

// 라이브러리
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// 스타일
import style from "@/_styles/auth/SignUp.module.css";

// 커스텀 훅
import { useTempUserData } from "@/(route)/signup/hooks/useTempUserData";
import { useSignupUser } from "@/(route)/signup/hooks/useSignupUser";
import { useSignUpForm } from "@/(route)/signup/hooks/useSignUpForm";
import { useSendSMS } from "@/(route)/signup/hooks/useSendSMS";
import { useVerifySMS } from "@/(route)/signup/hooks/useVerifySMS";

export default function SignUpPage() {
  // 검색 파라미터
  const searchParams = useSearchParams();
  const tempId = searchParams.get("tempId");

  // API 및 폼 상태
  const { data: tempUserData } = useTempUserData(tempId!);
  const { mutate: signup } = useSignupUser();
  const { form, handleChange, focusedField, setFocusedField, setForm } =
    useSignUpForm();
  const { mutate: sendSMS } = useSendSMS();
  const { mutate: verifySMS } = useVerifySMS();

  // 입력 상태
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  // 임시 사용자 데이터 반영
  useEffect(() => {
    if (tempUserData) {
      setForm((prevForm) => ({
        ...prevForm,
        email: tempUserData.email,
        fullName: tempUserData.full_name,
      }));
    }
  }, [tempUserData, setForm]);

  // 가입 요청
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      alert("휴대폰 인증을 완료해 주세요.");
      return;
    }
    const submitForm = {
      ...form,
      number: form.number.replace(/-/g, ""),
    };
    signup(submitForm);
  };

  // 인증번호 전송
  const handleSendSMS = () => {
    if (!form.number) {
      alert("전화번호를 입력해 주세요.");
      return;
    }
    sendSMS(form.number);
  };

  // 인증번호 검증
  const handleVerifySMS = () => {
    if (!form.number || !code) {
      alert("전화번호와 인증번호를 모두 입력해 주세요.");
      return;
    }
    verifySMS(
      { phoneNumber: form.number, code },
      {
        onSuccess: () => {
          setVerified(true);
          alert("휴대폰 인증이 완료되었습니다.");
        },
        onError: (error: any) => {
          alert(error.message || "인증 실패");
        },
      }
    );
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

        {/* 이메일 입력 */}
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

        {/* 성함 입력 */}
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

        {/* 성별 선택 */}
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

        {/* 전화번호 입력 */}
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
          <button
            type="button"
            onClick={handleSendSMS}
            className={style.SMSButton}
          >
            인증요청
          </button>
        </div>

        {/* 인증번호 입력 */}
        <div className={style.InputGroup}>
          <input
            className={style.FullName}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
          />
          <button
            type="button"
            onClick={handleVerifySMS}
            className={style.SMSButton}
          >
            인증확인
          </button>
        </div>

        {/* 인증 완료 표시 */}
        {verified && <p className={style.Verified}>휴대폰 인증 완료</p>}
      </div>

      {/* 가입 완료 버튼 */}
      <button onClick={handleSubmit} className={style.Button}>
        가입 완료
      </button>
    </div>
  );
}
