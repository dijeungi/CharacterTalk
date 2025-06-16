'use client';

import Step1_Profile from '../../../../_components/characters/Step1_Profile';
import { LinearProgress } from '@mui/material';
import { useState } from 'react';

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
          margin: 0,
          padding: 0,
        }}
      />
      {activeStep === 0 && <Step1_Profile />}
    </>
  );
}
