/*
  회원가입 페이지 컴포넌트
  app/(route)/signup/page.tsx
*/

"use client";

// 라이브러리
import { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { useSearchParams } from "next/navigation";

// 스타일
import style from "@/_styles/auth/SignUp.module.css";

// 커스텀 훅
import { useSignupUser } from "@/(route)/signup/hooks/useSignupUser";
import { useSendSMS } from "@/(route)/signup/hooks/useSendSMS";
import { useVerifySMS } from "@/(route)/signup/hooks/useVerifySMS";

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
  // URL 파라미터로 tempId 추출
  const searchParams = useSearchParams();
  const tempId = searchParams.get("tempId");

  // 회원가입 요청 훅
  const { mutate: signup } = useSignupUser();

  // 문자 인증 요청 및 검증 훅
  const { mutate: sendSMS } = useSendSMS();
  const { mutate: verifySMS } = useVerifySMS();

  // 회원가입 폼 상태 관리
  const [form, dispatch] = useReducer(formReducer, initialState);

  // 상태값들
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [step, setStep] = useState(1);
  const [carrierSelected, setCarrierSelected] = useState(false);
  const residentBackRef = useRef<HTMLInputElement>(null);

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

    setTimeout(() => {
      residentBackRef.current?.focus();
    }, 0);
  };

  // 휴대폰 번호 포맷 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ name: "number", value: formatPhone(e.target.value) });
  };

  // 통신사 선택
  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ name: "carrier", value: e.target.value });
    setCarrierSelected(true);
  };

  // 토스 본인인증
  const handleEasyAuth = async () => {
    const tossCert = TossCert();
    tossCert.preparePopup();

    // 생년월일 계산 (residentFront 기준)
    const raw = form.residentFront;
    if (raw.length !== 6) {
      alert("주민등록번호 앞자리를 정확히 입력해 주세요.");
      return;
    }

    const birthYearPrefix = parseInt(raw.slice(0, 2)) <= 25 ? "20" : "19";
    const birthday = `${birthYearPrefix}${raw}`;

    const res = await fetch("/api/toss/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.fullName,
        phone: form.number.replace(/-/g, ""),
        birthday,
      }),
    });

    const { authUrl, txId, error } = await res.json();

    if (error || !authUrl || !txId) {
      console.error("토스 인증 에러:", error);
      alert("본인인증 요청 실패");
      return;
    }

    tossCert.start({
      authUrl,
      txId,
      onSuccess: () => {
        alert("본인인증 완료되었습니다.");
        setVerified(true);
        setStep(4); // 인증 후 다음 단계
      },
      onFail: (err) => {
        console.error("본인인증 실패", err);
        alert("본인인증 실패");
      },
    });
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
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => prev + 1)}
            className={style.Button}
          >
            다음
          </button>
        ) : verified ? (
          <button onClick={handleSubmit} className={style.Button}>
            가입 완료
          </button>
        ) : (
          <button onClick={handleEasyAuth} className={style.Button}>
            본인 인증
          </button>
        )}
      </div>
    </div>
  );
}
