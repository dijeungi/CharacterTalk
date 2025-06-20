'use client';

import { SwipeableDrawer } from '@mui/material';
import { useState } from 'react';
import styles from './ProfileImage.module.css';
import { Toast } from '@/app/_utils/Swal';

interface ProfileImageGeneratorDrawerProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (imageFile: File) => void;
}

export default function ProfileImageGeneratorDrawer({
  open,
  onClose,
  onImageGenerated,
}: ProfileImageGeneratorDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      Toast.fire({
        icon: 'warning',
        title: '이미지에 대한 설명을 입력해주세요.',
      });
      return;
    }
    setIsLoading(true);
    console.log(`생성 프롬프트: ${prompt}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '2rem',
              backgroundColor: '#ffffff',
              color: '#000000',
            },
          },
        }}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerBar} />
          <h2 className={styles.drawerTitle}>AI 프로필 이미지 생성</h2>
          <p className={styles.drawerText}>
            캐릭터의 외형, 분위기, 배경 등을 자유롭게 설명해주세요.
          </p>
          <div className={styles.textareaWrapper}>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="예시: 은하수를 배경으로 한 푸른 머리의 신비로운 소녀"
              className={styles.textarea}
              rows={4}
            />
          </div>
          <div className={styles.fixedBottom}>
            <button onClick={handleGenerate} disabled={isLoading} className={styles.Button}>
              {isLoading ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
}
