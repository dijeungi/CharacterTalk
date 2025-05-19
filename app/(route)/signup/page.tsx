/*
  회원가입 페이지 컴포넌트
  app/(route)/signup/page.tsx
*/

"use client";

// 라이브러리
import { useState, useRef, useCallback, useReducer } from "react";

// 스타일
import style from "@/_styles/auth/SignUp.module.css";
import { ConfirmationResult } from "firebase/auth";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { Toast } from "@/_utils/Swal";

// 상태 초기값
const initialState = {
  fullName: "",
  residentFront: "",
  residentBack: "",
  number: "",
  carrier: "",
};

// reducer
function formReducer(state: typeof initialState, action: any) {
  return { ...state, [action.name]: action.value };
}

// 전화번호 포맷 유틸
const formatPhone = (value: string) => {
  const raw = value.replace(/\D/g, "");
  if (raw.length < 4) return raw;
  if (raw.length < 8) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
};

export default function SignUpPage() {
  // 회원가입 폼 상태 관리
  const [form, dispatch] = useReducer(formReducer, initialState);

  // 상태값들
  const [step, setStep] = useState(1);
  const residentBackRef = useRef<HTMLInputElement>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null
  );
  const { requestSMS } = useFirebaseAuth(setConfirmation, () => setStep(4));
  const [code, setCode] = useState("");

  // 이름 입력 핸들러
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ name: "fullName", value: e.target.value });
    },
    []
  );

  // 주민등록번호 앞자리 입력
  const handleResidentFrontChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);

    if (raw.length === 6) {
      setTimeout(() => {
        residentBackRef.current?.focus();
      }, 0);
    }

    dispatch({ name: "residentFront", value: raw });
  };

  // 주민등록번호 뒷자리 (첫 자리만)
  const handleResidentBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    dispatch({ name: "residentBack", value });

    // setTimeout(() => {
    //   residentBackRef.current?.focus();
    // }, 0);
  };

  // 휴대폰 번호 포맷 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ name: "number", value: formatPhone(e.target.value) });
  };

  // 회원가입 완료 폼
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verified) {
      alert("본인인증을 먼저 완료해 주세요.");
      return;
    }

    const residentRaw = form.residentFront;
    const birthYearPrefix =
      parseInt(residentRaw.slice(0, 2)) <= 25 ? "20" : "19";
    const birthday = `${birthYearPrefix}${residentRaw}`;

    const payload = {
      name: form.fullName,
      phone: form.number.replace(/-/g, ""),
      birthday,
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("회원가입 요청 실패");

      alert("가입이 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  // SMS 인증 요청
  const handleRequestSMS = async () => {
    const rawPhone = form.number;
    const phoneDigits = rawPhone.replace(/-/g, "");
    const isValid = /^010\d{7,8}$/.test(phoneDigits);

    if (!isValid) {
      Toast.fire({
        icon: "error",
        title: "유효한 휴대폰 번호를 입력해 주세요.",
      });
      return;
    }

    try {
      await requestSMS(rawPhone);
      setStep(4);
    } catch {}
  };

  // 본인 인증 완료 여부
  const handleConfirmCode = async () => {
    if (!confirmation) return;

    try {
      await confirmation.confirm(code);
      Toast.fire({ icon: "success", title: "인증에 성공했습니다." });
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title:
          error.message || "인증에 실패했습니다. 인증번호를 확인해 주세요.",
      });
    }
  };

  return (
    <div className={style.Container}>
      <div id="recaptcha-container" />

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

        {step === 2 && (
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
        )}

        {step === 3 && (
          <>
            <div className={style.InputGroup}>
              <label className={style.ClickLabel}>휴대폰 번호</label>
              <input
                className={style.FullName}
                type="text"
                name="number"
                value={form.number}
                onChange={handlePhoneNumberChange}
                placeholder="예: 010-1234-5678"
                required
              />
            </div>

            <div className={style.InputGroup}>
              <label className={style.ClickLabel}>주민등록번호</label>
              <div className={style.ResidentWrapper}>
                <input
                  className={style.ResidentInput}
                  type="text"
                  value={form.residentFront}
                  readOnly
                />
                <span className={style.Hyphen}>-</span>
                <div className={style.BackWrapper}>
                  <input
                    className={style.ResidentBackInput}
                    type="text"
                    value={form.residentBack}
                    readOnly
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
                readOnly
              />
            </div>
          </>
        )}
      </div>

      <div className={style.ButtonGroup}>
        {step === 1 || step === 2 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => prev + 1)}
            className={style.Button}
            disabled={
              (step === 1 && !form.fullName.trim()) ||
              (step === 2 &&
                (form.residentFront.length !== 6 ||
                  form.residentBack.length !== 1))
            }
          >
            다음
          </button>
        ) : step === 3 ? (
          <button
            className={style.Button}
            onClick={handleRequestSMS}
            disabled={
              !form.fullName.trim() ||
              form.residentFront.length !== 6 ||
              form.residentBack.length !== 1 ||
              form.number.replace(/\D/g, "").length !== 11
            }
          >
            본인 인증
          </button>
        ) : null}
      </div>
      <div className={style.ButtonGroup}>
        {step === 4 && (
          <>
            <div className={style.InputGroup}>
              <label className={style.ClickLabel}>인증번호</label>
              <input
                className={style.FullName}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 6자리"
              />
            </div>
            <div className={style.ButtonGroup}>
              <button
                className={style.Button}
                onClick={handleConfirmCode}
                disabled={code.length !== 6}
              >
                인증 확인
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
