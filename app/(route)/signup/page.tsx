/*
  회원가입 페이지 컴포넌트
  app/(route)/signup/page.tsx
*/

"use client";

// 라이브러리
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

// 스타일
import style from "@/_styles/auth/SignUp.module.css";

// 커스텀 훅
import { useSignupUser } from "@/(route)/signup/hooks/useSignupUser";
import { useSignUpForm } from "@/(route)/signup/hooks/useSignUpForm";
import { useSendSMS } from "@/(route)/signup/hooks/useSendSMS";
import { useVerifySMS } from "@/(route)/signup/hooks/useVerifySMS";

export default function SignUpPage() {
  // URL 파라미터로 tempId 추출
  const searchParams = useSearchParams();
  const tempId = searchParams.get("tempId");

  // 회원가입 요청 훅
  const { mutate: signup } = useSignupUser();

  // 회원가입 폼 상태 관리
  const { form, setForm } = useSignUpForm();

  // 문자 인증 요청 및 검증 훅
  const { mutate: sendSMS } = useSendSMS();
  const { mutate: verifySMS } = useVerifySMS();

  // 상태값들
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [step, setStep] = useState(1);
  const [carrierSelected, setCarrierSelected] = useState(false);
  const residentBackRef = useRef<HTMLInputElement>(null);

  // 가입 최종 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      alert("휴대폰 인증을 완료해 주세요.");
      return;
    }
    const submitForm = {
      ...form,
      residentNumber: `${form.residentFront}-${form.residentBack}`,
      number: form.number.replace(/-/g, ""),
    };
    signup(submitForm);
  };

  // 문자 인증 요청
  const handleSendSMS = () => {
    if (!form.number) {
      alert("전화번호를 입력해 주세요.");
      return;
    }
    sendSMS(form.number);
  };

  // 문자 인증번호 확인
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

  // 이름 입력 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      fullName: e.target.value,
    }));
  };

  // 주민등록번호 앞자리 입력
  const handleResidentFrontChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);

    setForm((prev) => {
      if (raw.length === 6 && prev.residentFront.length < 6) {
        setTimeout(() => {
          residentBackRef.current?.focus();
        }, 0);
      }

      return {
        ...prev,
        residentFront: raw,
      };
    });
  };

  // 주민등록번호 뒷자리 (첫 자리만)
  const handleResidentBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    setForm((prev) => ({
      ...prev,
      residentBack: value,
    }));

    setTimeout(() => {
      residentBackRef.current?.focus();
    }, 0);
  };

  // 휴대폰 번호 포맷 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length < 4) {
      value = value;
    } else if (value.length < 8) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
    }
    setForm((prev) => ({
      ...prev,
      number: value,
    }));
  };

  // 통신사 선택
  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      carrier: e.target.value,
    }));
    setCarrierSelected(true);
  };

  // 이름 + 주민등록번호
  function NameAndResidentInputs() {
    return (
      <>
        <div className={style.InputGroup}>
          <label className={style.ClickLabel}>주민등록번호</label>
          <div className={style.ResidentWrapper}>
            <input
              className={style.ResidentInput}
              type="text"
              value={form.residentFront}
              onChange={handleResidentFrontChange}
              placeholder="앞 6자리"
              maxLength={6}
              required
              autoFocus
            />
            <span className={style.Hyphen}>-</span>
            <div className={style.BackWrapper}>
              <input
                className={style.ResidentBackInput}
                type="text"
                value={form.residentBack}
                onChange={handleResidentBackChange}
                placeholder=""
                maxLength={1}
                required
                ref={residentBackRef}
              />
              <input
                className={style.MaskingInput}
                type="text"
                value={"●●●●●●"}
                readOnly
                tabIndex={-1}
              />
            </div>
          </div>
        </div>

        <div className={style.InputGroup}>
          <label className={style.ClickLabel}>이름</label>
          <input
            className={style.FullName}
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleNameChange}
            placeholder="이름을 입력해 주세요"
            required
          />
        </div>
      </>
    );
  }

  return (
    <div className={style.Container}>
      <div className={style.Content}>
        <h2 className={style.Title}>
          회원가입을 위해
          <br /> 간단한 정보를 입력해 주세요
          <p className={style.SubTitle}>정확한 정보 입력이 필요합니다.</p>
        </h2>

        {step === 1 && (
          <div className={style.InputGroup}>
            <label className={style.ClickLabel}>이름</label>
            <input
              className={style.FullName}
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleNameChange}
              placeholder="이름을 입력해 주세요"
              required
            />
          </div>
        )}

        {step === 2 && <NameAndResidentInputs />}

        {step === 3 && (
          <>
            <div className={style.InputGroup}>
              <label className={style.ClickLabel}>통신사 선택</label>
              <select
                className={style.Select}
                name="carrier"
                value={form.carrier || ""}
                onChange={handleCarrierChange}
                required
              >
                <option value="">통신사를 선택해 주세요</option>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LG U+">LG U+</option>
                <option value="알뜰폰">알뜰폰</option>
              </select>
            </div>

            {carrierSelected && (
              <>
                <div className={style.InputGroup}>
                  <label className={style.ClickLabel}>휴대폰 번호</label>
                  <input
                    className={style.FullName}
                    type="text"
                    name="number"
                    value={form.number}
                    onChange={handlePhoneNumberChange}
                    placeholder="휴대폰 번호를 입력해 주세요"
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
              </>
            )}

            {verified && <p className={style.Verified}>휴대폰 인증 완료</p>}

            {/* NameAndResidentInputs를 아래로 이동 */}
            <NameAndResidentInputs />
          </>
        )}
      </div>

      <div className={style.ButtonGroup}>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => prev + 1)}
            className={style.Button}
          >
            다음
          </button>
        ) : (
          <button onClick={handleSubmit} className={style.Button}>
            가입 완료
          </button>
        )}
      </div>
    </div>
  );
}
