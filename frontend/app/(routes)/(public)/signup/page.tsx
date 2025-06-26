/**
 * @route        /signup
 * @file         frontend/app/(routes)/(public)/signup/page.tsx
 * @component    SignUpPage
 * @desc         소셜 로그인 이후 회원가입 정보를 입력받는 폼 구성 페이지
 *
 * @layout       default
 * @access       public
 * @props        -
 *
 * @features
 *  - 소셜 로그인으로 받은 닉네임 자동 입력
 *  - 이름, 주민번호, 휴대폰번호, 인증번호 순 입력
 *  - Firebase 인증 기반 휴대폰 인증
 *  - Zustand로 사용자 입력 상태 관리
 *  - 인증 완료 시 서버에 회원가입 요청
 *
 * @dependencies
 *  - Firebase Auth (휴대폰 인증)
 *  - Zustand (입력 상태 관리)
 *  - React Toast (사용자 알림)
 *
 * @todo
 *  - 전화번호 중복 확인 기능 추가
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// css
import styles from './page.module.css';

// modules
import { ConfirmationResult } from 'firebase/auth';

// custom hooks, utils
import { useFirebaseAuth } from './_hooks/useFirebaseAuth';
import { useSignupUser } from './_hooks/useSignupUser';
import { useTempUser } from './_hooks/useTempUser';
import { Toast } from '@/app/_utils/Swal';

// store
import { useSignupStore } from '@/app/_store/signup/index';

// Components
import FullNameInput from './_components/FullNameInput';
import ResidentInput from './_components/ResidentInput';
import PhoneInput from './_components/PhoneInput';
import VerifyCodeInput from './_components/VerifyCodeInput';

// types
import { SignupPayload } from './_types/index';

export default function SignUpPage() {
  // 상태 관리
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  // store
  const { resetForm } = useSignupStore();

  // Params
  const searchParams = useSearchParams();
  const tempId = searchParams.get('tempId');

  // 임시 사용자 정보 불러오기 및 이름 초기화
  const { email, oauth } = useTempUser(tempId, userData => {
    if (userData?.nick_name) {
      useSignupStore.getState().setFormField('fullName', userData.nick_name);
    }
  });

  // 회원가입 요청 및 SMS 인증 함수
  const signupMutation = useSignupUser();
  const { requestSMS } = useFirebaseAuth(setConfirmation);

  // 컴포넌트 언마운트 시(탈주 시) Store 상태 초기화
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  // 핸들러 함수 (자식 컴포넌트에 props로 전달될 로직)
  const handleNextStep = () => setStep(prev => prev + 1);

  // SMS 인증번호 전송 함수
  const handleRequestSMS = async () => {
    const number = useSignupStore.getState().number;
    const rawPhone = number.replace(/-/g, '');
    const isValid = /^010\d{7,8}$/.test(rawPhone);

    if (!isValid) {
      Toast.fire({
        icon: 'error',
        title: '유효한 휴대폰 번호를 입력해 주세요.',
      });
      return;
    }

    try {
      await requestSMS(number);
      handleNextStep();
    } catch (error) {
      console.error('SMS 전송 실패:', error);
    }
  };

  // 인증번호 확인 함수
  const handleConfirmCode = async (code: string) => {
    if (!confirmation) return;

    try {
      await confirmation.confirm(code);

      await handleSubmit();
      setStep(5);
    } catch (error: any) {
      Toast.fire({
        icon: 'error',
        title: '인증에 실패했습니다. 인증번호를 확인해 주세요.',
      });
    }
  };

  // 주민번호로 생년월일·성별 계산 후 유효성 검증 및 회원가입 payload 생성
  const handleSubmit = async () => {
    const form = useSignupStore.getState();
    const birth = form.residentFront;
    if (!/^\d{6}$/.test(birth)) {
      Toast.fire({ icon: 'error', title: '생년월일 6자리를 입력해 주세요.' });
      return;
    }

    const yearPrefix = ['3', '4', '7', '8'].includes(form.residentBack) ? '20' : '19';
    const year = parseInt(`${yearPrefix}${birth.slice(0, 2)}`, 10);
    const month = parseInt(birth.slice(2, 4), 10);
    const day = parseInt(birth.slice(4, 6), 10);

    const isValidDate =
      !isNaN(new Date(`${year}-${month}-${day}`).getTime()) &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31;

    if (!isValidDate) {
      Toast.fire({ icon: 'error', title: '올바른 생년월일을 입력해 주세요.' });
      return;
    }

    const payload: SignupPayload = {
      email,
      oauth,
      fullName: form.fullName,
      residentFront: form.residentFront,
      residentBack: form.residentBack,
      gender: ['1', '3', '5', '7'].includes(form.residentBack) ? 'M' : 'F',
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      number: form.number.replace(/-/g, ''),
      verified: true,
    };

    signupMutation.mutate(payload);
  };

  // 현재 단계(step)에 따라 상단 안내 문구 메시지 <div> 렌더링
  const renderTitle = () => {
    const fullName = useSignupStore.getState().fullName;
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
            {fullName}님,
            <br />
            가입을 축하드립니다 !
            <p className={styles.subTitle}>모든 정보가 정확한지 마지막으로 확인해 주세요.</p>
          </>
        );
      default:
        return null;
    }
  };

  // 현재 단계(step)에 따라 입력 폼 및 버튼 컴포넌트 동적으로 렌더링
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FullNameInput editable />
            <div className={styles.fixedBottom}>
              <button
                className={styles.button}
                onClick={handleNextStep}
                disabled={!useSignupStore.getState().fullName.trim()}
              >
                다음
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <ResidentInput editable />
            <FullNameInput editable={false} />
            <div className={styles.fixedBottom}>
              <button
                className={styles.button}
                onClick={handleNextStep}
                disabled={
                  useSignupStore.getState().residentFront.length !== 6 ||
                  useSignupStore.getState().residentBack.length !== 1
                }
              >
                다음
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <PhoneInput onChangeOnly={false} />
            <ResidentInput editable={false} />
            <FullNameInput editable={false} />
            <div className={styles.fixedBottom}>
              <button
                className={styles.button}
                onClick={handleRequestSMS}
                disabled={useSignupStore.getState().number.replace(/\D/g, '').length !== 11}
              >
                휴대폰 번호 인증
              </button>
            </div>
          </>
        );
      case 4:
        return <VerifyCodeInput onConfirm={handleConfirmCode} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div id="recaptcha-container" />

      <div className={styles.content}>
        <h2 className={styles.title}>{renderTitle()}</h2>
        {renderStepComponent()}
      </div>
    </div>
  );
}
