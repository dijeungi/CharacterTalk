/*
  Route: '/header/character-step'
  Path: app/_components/header/CharacterStepHeader.tsx
  Description:
    - 이 페이지는 캐릭터 만들기 화면에서 상단 헤더를 구현하는 컴포넌트입니다.
*/

'use client';

// Next.js
import { useState } from 'react';

// css
import styles from './CharacterStepHeader.module.css';

// 상태
import { useCharacterCreationStore } from '@/app/_store/characters';

// components
import UnsavedChangesModal from '../../../(routes)/(private)/characters/new/_components/Modal/UnsavedChangesModal';

// lib
import { Toast } from '@/app/_utils/Swal';
import { LinearProgress } from '@mui/material';
import { MdKeyboardBackspace } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { IoMdPaper } from 'react-icons/io';
import { GoShieldCheck } from 'react-icons/go';

// DB
import { saveDraftToDB, saveImageToDB } from '@/app/_utils/indexedDBUtils';

export default function CharacterStepHeader() {
  // store 상태 호출
  const { isDirty, currentStep, resetDirty } = useCharacterCreationStore();

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // bar 계산
  const progress = (currentStep / 3) * 100;

  // step별 header Title
  const getHeaderTitle = (step: number) => {
    switch (step) {
      case 1:
        return (
          <>
            <CgProfile style={{ marginRight: '0.5rem', position: 'relative', top: '2.5px' }} />
            프로필 설정
          </>
        );
      case 2:
        return (
          <>
            <IoMdPaper style={{ marginRight: '0.5rem', position: 'relative', top: '2.5px' }} />
            성격 및 기본 정보
          </>
        );
      case 3:
        return (
          <>
            <GoShieldCheck style={{ marginRight: '0.5rem', position: 'relative', top: '2.5px' }} />
            시작 설정
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

  // 뒤로가기 버튼 모달 창
  const handleBackClick = () => {
    if (isDirty) {
      setIsModalOpen(true);
    } else {
      // 임시 저장 안 해도 뒤로 가기 실행
      window.history.back();
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 나가기 클릭 시 뒤로 가기
  const handleExit = () => {
    setIsModalOpen(false);
    window.history.back();
  };

  return (
    <>
      <header className={styles.Container}>
        {/* 왼쪽 섹션 - 뒤로 가기 버튼 및 제목 */}
        <div className={styles.Left_Section}>
          <button onClick={handleBackClick} className={styles.IconButton}>
            <MdKeyboardBackspace className={styles.Icon} />
          </button>
        </div>

        <div className={styles.Center_Section}>
          <span className={styles.Title}>{getHeaderTitle(currentStep)}</span>
        </div>

        {/* 오른쪽 섹션 - 로그인 아이콘 */}
        <div className={styles.Right_Section}>
          <button
            className={styles.Title_Button}
            disabled={!isDirty}
            onClick={handleSaveToIndexedDB}
          >
            임시저장
          </button>
        </div>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '5px',
            borderRadius: 0,
          }}
        />
      </header>
      {/* 모달 컴포넌트 */}
      {isModalOpen && <UnsavedChangesModal onClose={closeModal} onExit={handleExit} />}
    </>
  );
}
