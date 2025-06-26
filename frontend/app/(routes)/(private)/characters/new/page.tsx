/**
 * @route        /characters/new
 * @file         frontend/app/(routes)/(private)/characters/new/page.tsx
 * @component    CharactersNewPage
 * @desc         캐릭터 생성 단계별 입력 폼 페이지
 *
 * @layout       default
 * @access       private
 * @props        없음
 *
 * @features
 *  - 단계별 입력 폼 구성 (현재 Step1만 연결됨)
 *  - MUI LinearProgress로 진행률 표시
 *
 * @dependencies
 *  - React (useState)
 *  - MUI LinearProgress
 *
 * @todo
 *  - Step2, Step3 컴포넌트 연결
 *  - 진행 상태 전역 관리로 분리 고려
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

'use client';
import { useState } from 'react';

// components
import Step1_Profile from './_components/Step1_Profile';
import Step2_Personality from './_components/Step2_Personality';

// library
import { LinearProgress } from '@mui/material';

const steps = ['1', '2', '3'];

export default function CharactersNewPage() {
  const [activeStep, setActiveStep] = useState(0);
  const progressValue = ((activeStep + 1) / steps.length) * 100;

  return (
    <>
      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          height: '4px',
          borderRadius: 0,
        }}
      />
      {activeStep === 0 && <Step1_Profile onNext={() => setActiveStep(1)} />}
      {activeStep === 1 && <Step2_Personality />}
    </>
  );
}
