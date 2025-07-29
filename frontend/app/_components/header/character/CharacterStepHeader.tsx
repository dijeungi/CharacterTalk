/**
 * @file      frontend/app/_components/header/character/CharacterStepHeader.tsx
 * @desc      Component: 캐릭터 생성 단계별 헤더 UI, 진행 상태 표시 및 임시저장 기능 정의
 *
 * @author    최준호
 * @update    2025.07.20
 */

'use client';

import { useState } from 'react';
import styles from '@/app/_components/header/character/CharacterStepHeader.module.css';

import { useCharacterCreationStore } from '@/app/_store/characters';

import UnsavedChangesModal from '@/app/(routes)/(private)/characters/new/_components/Modal/UnsavedChangesModal';

import { Toast } from '@/app/_utils/Swal';
import { LinearProgress } from '@mui/material';
import { MdKeyboardBackspace } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { IoMdPaper } from 'react-icons/io';
import { BiCommand } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';

import { saveDraftToDB, saveImageToDB } from '@/app/_utils/indexedDBUtils';

export default function CharacterStepHeader() {
  // store 상태 호출
  const { isDirty, currentStep, resetDirty } = useCharacterCreationStore();
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // bar 계산
  const progress = (currentStep / 3) * 100;
  // step 4 처리
  const isStep4 = currentStep === 4;
  // step별 header title
  const getHeaderTitle = (step: number) => {
    switch (step) {
      case 1:
        return (
          <>
            <CgProfile className={styles.stepIcon} />
            프로필 설정
          </>
        );
      case 2:
        return (
          <>
            <IoMdPaper className={styles.stepIcon} />
            성격 및 기본 정보
          </>
        );
      case 3:
        return (
          <>
            <BiCommand className={styles.stepIcon} />
            시작 설정
          </>
        );
      case 4:
        return (
          <>
            <IoSettingsOutline className={styles.stepIcon} />
            등록 설정
          </>
        );
      default:
        return '캐릭터 만들기';
    }
  };

  // 임시저장 Btn - IndexedDB 저장
  const handleSaveToIndexedDB = async () => {
    const state = useCharacterCreationStore.getState();

    await saveDraftToDB({
      // step 1
      name: state.name,
      oneliner: state.oneliner,
      mbti: state.mbti,
      // step 2
      title: state.title,
      promptDetail: state.promptDetail,
      exampleDialogs: state.exampleDialogs,
      speech: state.speech,
      behaviorConstraint: state.behaviorConstraint,
      // step 3
      scenarioTitle: state.scenarioTitle,
      scenarioGreeting: state.scenarioGreeting,
      scenarioSituation: state.scenarioSituation,
      scenarioSuggestions: state.scenarioSuggestions,
      // step 4
      genre: state.genre,
      visibility: state.visibility,
      target: state.target,
      conversationType: state.conversationType,
      userFilter: state.userFilter,
      hashtags: state.hashtags,
      commentsEnabled: state.commentsEnabled,
    });

    if (state.profileImage instanceof File) {
      await saveImageToDB('profileImage', state.profileImage);
    }

    Toast.fire({
      icon: 'success',
      title: '임시저장 되었습니다.',
    });

    resetDirty();
  };

  // 뒤로가기
  const handleBackClick = () => {
    if (isDirty) {
      setIsModalOpen(true);
    } else {
      window.history.back();
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 모달 - 뒤로가기
  const handleExit = () => {
    setIsModalOpen(false);
    window.history.back();
  };

  return (
    <>
      <header className={styles.container}>
        {/* left btn - background */}
        <div className={styles.leftSection}>
          <button onClick={handleBackClick} className={styles.iconButton}>
            <MdKeyboardBackspace className={styles.icon} />
          </button>
        </div>

        <div className={styles.centerSection}>
          <span className={styles.title}>{getHeaderTitle(currentStep)}</span>
        </div>

        {/* right btn - login */}
        <div className={styles.rightSection}>
          <button
            className={styles.titleButton}
            disabled={!isDirty}
            onClick={handleSaveToIndexedDB}
          >
            임시저장
          </button>
        </div>

        {/* ProgressBar */}
        <LinearProgress
          variant="determinate"
          value={isStep4 ? 100 : progress}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '5px',
            borderRadius: 0,
            backgroundColor: isStep4 ? '#d3d3d3' : undefined,
            '& .MuiLinearProgress-bar': {
              backgroundColor: isStep4 ? '#4caf50' : undefined,
            },
          }}
        />
      </header>

      {/* Modal */}
      {isModalOpen && <UnsavedChangesModal onClose={closeModal} onExit={handleExit} />}
    </>
  );
}
