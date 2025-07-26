/**
 * @file         frontend/app/(routes)/(private)/characters/new/page.tsx
 * @desc         캐릭터 생성 절차를 단계별로 진행하고 최종 등록까지 처리하는 페이지 컴포넌트
 *
 * @author       최준호
 * @update       2025.07.26
 */

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// components
import Step1_Profile from './_components/Step1_Profile';
import Step2_Personality from './_components/Step2_Personality';
import Step3_Scenario from './_components/Step3_Scenario';
import Step4_RegistrationSettings from './_components/Step4_RegistrationSettings';

// lib
import { Toast } from '@/app/_utils/Swal';

// store
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCreateCharacterFormData } from './_hooks/useCreateCharacterFormData';
import { createCharacter } from '@/app/_apis/character';

export default function CharactersNewPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [fromStep2, setFromStep2] = useState(false);
  const setCurrentStep = useCharacterCreationStore(state => state.setCurrentStep);
  const resetAllData = useCharacterCreationStore(state => state.resetAllData);
  const createFormData = useCreateCharacterFormData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // prosBar Update
  useEffect(() => {
    setCurrentStep(activeStep + 1);
  }, [activeStep, setCurrentStep]);

  // (route)/characters/new 를 벗어나면 상태 초기화
  useEffect(() => {
    return () => {
      resetAllData();
    };
  }, [resetAllData]);

  // 최종 단계에서 "등록하기" 버튼을 눌렀을 때 실행될 함수
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 로딩 모달 보여주기
    Toast.fire({
      title: '캐릭터를 등록하고 있어요...',
      text: '잠시만 기다려 주세요.',
      allowOutsideClick: false,
      didOpen: () => {
        Toast.showLoading();
      },
    });

    try {
      const formData = createFormData();
      const response = await createCharacter(formData);

      Toast.close();

      // 성공 토스트 보여주기
      Toast.fire({
        icon: 'success',
        title: '캐릭터가 성공적으로 등록되었습니다!',
      });

      resetAllData();

      router.push(`/character/${response.characterCode}`);
    } catch (error: any) {
      Toast.close();

      console.error('캐릭터 등록 실패:', error);
      const errorMessage = error.response?.data?.error || '등록 중 오류가 발생했습니다.';

      Toast.fire({
        icon: 'error',
        title: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {activeStep === 0 && <Step1_Profile onNext={() => setActiveStep(1)} fromStep2={fromStep2} />}
      {activeStep === 1 && (
        <Step2_Personality
          onPrev={() => {
            setFromStep2(true);
            setActiveStep(0);
          }}
          onNext={() => setActiveStep(2)}
        />
      )}
      {activeStep === 2 && (
        <Step3_Scenario onPrev={() => setActiveStep(1)} onNext={() => setActiveStep(3)} />
      )}
      {activeStep === 3 && (
        <Step4_RegistrationSettings
          onPrev={() => setActiveStep(2)}
          onNext={() => {
            handleFinalSubmit();
          }}
        />
      )}
    </>
  );
}
