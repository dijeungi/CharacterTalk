"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

import style from "@/_styles/auth/SignUp.module.css";

import { useTempUserData } from "@/(route)/signup/hooks/useTempUserData";
import { useSignupUser } from "@/(route)/signup/hooks/useSignupUser";
import { useSignUpForm } from "@/(route)/signup/hooks/useSignUpForm";
import { useSendSMS } from "@/(route)/signup/hooks/useSendSMS";
import { useVerifySMS } from "@/(route)/signup/hooks/useVerifySMS";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const tempId = searchParams.get("tempId");

  const { data: tempUserData } = useTempUserData(tempId!);
  const { mutate: signup } = useSignupUser();
  const { form, setForm } = useSignUpForm();
  const { mutate: sendSMS } = useSendSMS();
  const { mutate: verifySMS } = useVerifySMS();

  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [step, setStep] = useState(1);
  const [carrierSelected, setCarrierSelected] = useState(false);
  const residentBackRef = useRef<HTMLInputElement>(null);

  // 임시 데이터 반영 (필요시 삭제 가능)
  useEffect(() => {
    if (tempUserData) {
      setForm((prev) => ({
        ...prev,
        email: tempUserData.email,
        fullName: tempUserData.full_name,
      }));
    }
  }, [tempUserData, setForm]);

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

  const handleSendSMS = () => {
    if (!form.number) {
      alert("전화번호를 입력해 주세요.");
      return;
    }
    sendSMS(form.number);
  };

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

  // 이름 입력 처리
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      fullName: e.target.value,
    }));
  };

  // 주민등록번호 앞
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

  // 뒤
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

  // 휴대폰 번호 포맷팅
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length < 4) {
      // 3자리 이하
      value = value;
    } else if (value.length < 8) {
      // 3-3
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else {
      // 3-4-4
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

  // 주민번호 + 이름 입력 컴포넌트
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
