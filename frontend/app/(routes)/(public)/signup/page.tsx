/*
  회원가입 페이지 컴포넌트 (Firebase 인증 기반 + OAuth 임시 사용자 정보 활용)
  app/(route)/signup/page.tsx
*/

'use client';

// css
import styles from './page.module.css';

// library
import { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import { ConfirmationResult } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';

// custom hooks | utils
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useSignupUser } from './hooks/useSignupUser';
import { useTempUser } from './hooks/useTempUser';
import { Toast } from '../../../_utils/Swal';

// 회원가입 폼 초기 상태
const initialState = {
  fullName: '',
  residentFront: '',
  residentBack: '',
  number: '',
  carrier: '',
};

// 회원가입 폼 reducer 함수
function formReducer(state: typeof initialState, action: any) {
  return { ...state, [action.name]: action.value };
}

// 전화번호 포맷 함수
const formatPhone = (value: string) => {
  const raw = value.replace(/\D/g, '');
  if (raw.length < 4) return raw;
  if (raw.length < 8) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
};

// 회원가입 페이지 컴포넌트
export default function SignUpPage() {
  // 타이틀 렌더링 함수
  const renderTitle = () => {
    switch (step) {
      case 1:
      case 2:
      case 3:
        return (
          <>
            회원가입을 위해
            <br />
            간단한 정보를 입력해 주세요
            <p className={styles.subTitle}>정확한 정보 입력이 필요합니다.</p>
          </>
        );
      case 4:
        return (
          <>
            휴대폰에서 확인하신
            <br />
            인증번호를 입력해 주세요
            <p className={styles.subTitle}>문자로 받은 인증번호 6자리를 입력하세요.</p>
          </>
        );
      case 5:
        return (
          <>
            ~~님,
            <br />
            가입을 축하드립니다 !
            <p className={styles.subTitle}>모든 정보가 정확한지 마지막으로 확인해 주세요.</p>
          </>
        );
      default:
        return null;
    }
  };

  // URL
  const [form, dispatch] = useReducer(formReducer, initialState);

  // OAuth 임시 사용자 정보 가져오기
  const searchParams = useSearchParams();
  const tempId = searchParams.get('tempId');

  const oauthInfo = useTempUser(tempId, dispatch);

  // 상태 초기
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const residentBackRef = useRef<HTMLInputElement>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  // 회원가입 요청 API Custom Hooks
  const signupMutation = useSignupUser();

  // Firebase 인증 요청
  const { requestSMS } = useFirebaseAuth(setConfirmation, () => setStep(4));

  // 이름 입력
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ name: 'fullName', value: e.target.value });
  }, []);

  // 주민등록번호 앞자리 입력
  const handleResidentFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    if (raw.length === 6) {
      setTimeout(() => {
        residentBackRef.current?.focus();
      }, 0);
    }
    dispatch({ name: 'residentFront', value: raw });
  };

  // 주민등록번호 뒷자리 입력
  const handleResidentBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    dispatch({ name: 'residentBack', value });
  };

  // 휴대폰 번호 입력
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ name: 'number', value: formatPhone(e.target.value) });
  };

  // 회원가입 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      alert('본인인증을 먼저 완료해 주세요.');
      return;
    }

    const birthDate = form.residentFront;
    const yearPrefix = form.residentBack === '1' || form.residentBack === '2' ? '19' : '20';

    const payload = {
      email: oauthInfo.email,
      oauth: oauthInfo.oauth,
      fullName: form.fullName,
      gender: form.residentBack === '1' || form.residentBack === '3' ? 'M' : 'F',
      number: form.number.replace(/-/g, ''),
      residentFront: form.residentFront,
      residentBack: form.residentBack,
      verified,
      birthDate: `${yearPrefix}${birthDate.slice(0, 2)}-${birthDate.slice(2, 4)}-${birthDate.slice(
        4,
        6
      )}`,
    };

    signupMutation.mutate(payload);
  };

  // 인증번호 요청
  const handleRequestSMS = async () => {
    const rawPhone = form.number.replace(/-/g, '');
    const isValid = /^010\d{7,8}$/.test(rawPhone);

    if (!isValid) {
      Toast.fire({
        icon: 'error',
        title: '유효한 휴대폰 번호를 입력해 주세요.',
      });
      return;
    }

    try {
      await requestSMS(form.number);
      setStep(4);
    } catch {}
  };

  // 인증번호 확인
  const handleConfirmCode = async () => {
    if (!confirmation) return;

    try {
      await confirmation.confirm(code);
      setVerified(true);
      Toast.fire({ icon: 'success', title: '인증에 성공했습니다.' });
      setStep(5);
    } catch (error: any) {
      Toast.fire({
        icon: 'error',
        title: error.message || '인증에 실패했습니다. 인증번호를 확인해 주세요.',
      });
    }
  };

  // step 5 진입 시 버튼 표시 딜레이 처리
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        setShowCompleteButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowCompleteButton(false);
    }
  }, [step]);

  return (
    <div className={styles.container}>
      <div id="recaptcha-container" />

      <div className={styles.content}>
        <h2 className={styles.title}>{renderTitle()}</h2>

        {step === 1 && (
          <div className={styles.inputGroup}>
            <label className={styles.clickLabel}>이름</label>
            <input
              className={styles.input}
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
            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>주민등록번호</label>
              <div className={styles.residentWrapper}>
                <input
                  className={styles.residentInput}
                  type="number"
                  value={form.residentFront}
                  onChange={handleResidentFrontChange}
                  placeholder="앞 6자리"
                  maxLength={6}
                  required
                  autoFocus
                />
                <span className={styles.hyphen}>-</span>
                <div className={styles.backWrapper}>
                  <input
                    className={styles.residentBackInput}
                    type="number"
                    value={form.residentBack}
                    onChange={handleResidentBackChange}
                    placeholder=""
                    maxLength={1}
                    required
                    ref={residentBackRef}
                  />
                  <div className={styles.masking}>
                    <div className={styles.dotWrapper}>
                      {'●●●●●●'.split('').map((char, i) => (
                        <span key={i} className={styles.dot}>
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>이름</label>
              <input
                className={styles.input}
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
            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>휴대폰 번호</label>
              <input
                className={styles.input}
                type="text"
                name="number"
                value={form.number}
                onChange={handlePhoneNumberChange}
                placeholder="예: 010-1234-5678"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>주민등록번호</label>
              <div className={styles.residentWrapper}>
                <input className={styles.input} type="text" value={form.residentFront} readOnly />
                <span className={styles.hyphen}>-</span>
                <div className={styles.backWrapper}>
                  <input
                    className={styles.residentBackInput}
                    type="number"
                    value={form.residentBack}
                    onChange={handleResidentBackChange}
                    placeholder=""
                    maxLength={1}
                    required
                    ref={residentBackRef}
                  />
                  <div className={styles.masking}>
                    <div className={styles.dotWrapper}>
                      {'●●●●●●'.split('').map((char, i) => (
                        <span key={i} className={styles.dot}>
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>이름</label>
              <input
                className={styles.input}
                type="text"
                name="fullName"
                value={form.fullName}
                readOnly
              />
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>인증번호</label>
              <input
                className={styles.input}
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="인증번호 6자리"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>이름</label>
              <input className={styles.input} type="text" value={form.fullName} readOnly />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>주민등록번호</label>
              <div className={styles.residentWrapper}>
                <input className={styles.input} type="text" value={form.residentFront} readOnly />
                <span className={styles.hyphen}>-</span>
                <div className={styles.backWrapper}>
                  <input
                    className={styles.residentBackInput}
                    type="number"
                    value={form.residentBack}
                    onChange={handleResidentBackChange}
                    placeholder=""
                    maxLength={1}
                    required
                    ref={residentBackRef}
                  />
                  <div className={styles.masking}>
                    <div className={styles.dotWrapper}>
                      {'●●●●●●'.split('').map((char, i) => (
                        <span key={i} className={styles.dot}>
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.clickLabel}>휴대폰 번호</label>
              <input className={styles.input} type="text" value={form.number} readOnly />
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.button}
                onClick={handleConfirmCode}
                disabled={code.length !== 6}
              >
                인증 확인
              </button>
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <div className={styles.imageWrapper}>
              <img
                src="https://raw.githubusercontent.com/dijeungi/charactertalk/main/public/icon/signup_icon.png"
                alt="회원가입 아이콘"
                className={styles.completeImage}
              />
            </div>

            {showCompleteButton && (
              <div className={`${styles.buttonGroup} ${styles.fadeIn}`}>
                <button className={styles.button} onClick={handleSubmit}>
                  회원가입 완료
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.buttonGroup}>
        {step === 1 || step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(prev => prev + 1)}
            className={styles.button}
            disabled={
              (step === 1 && !form.fullName.trim()) ||
              (step === 2 && (form.residentFront.length !== 6 || form.residentBack.length !== 1))
            }
          >
            다음
          </button>
        ) : step === 3 ? (
          <button
            className={styles.button}
            onClick={handleRequestSMS}
            disabled={
              !form.fullName.trim() ||
              form.residentFront.length !== 6 ||
              form.residentBack.length !== 1 ||
              form.number.replace(/\D/g, '').length !== 11
            }
          >
            휴대폰 번호 인증
          </button>
        ) : null}
      </div>
    </div>
  );
}
