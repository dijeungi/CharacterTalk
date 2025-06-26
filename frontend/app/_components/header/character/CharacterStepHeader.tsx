/*
  Route: '/header/character-step'
  Path: app/_components/header/CharacterStepHeader.tsx
  Description:
    - 이 페이지는 캐릭터 만들기 화면에서 상단 헤더를 구현하는 컴포넌트입니다.
*/

'use client';

// Next.js
import Link from 'next/link';

// css
import styles from './CharacterStepHeader.module.css';

// 상태
import { useCharacterCreationStore } from '@/app/_store/characters';

// lib
import { MdKeyboardBackspace } from 'react-icons/md';
import { Toast } from '@/app/_utils/Swal';

// DB
import { saveDraftToDB, saveImageToDB } from '@/app/_utils/indexedDBUtils';

export default function CharacterStepHeader() {
  // store 상태 호출
  const { isDirty, currentStep, setDirty, resetDirty } = useCharacterCreationStore();

  // step별 header Title
  const getHeaderTitle = (step: number) => {
    switch (step) {
      case 1:
        return '프로필 인적사항';
      case 2:
        return '기본 프롬프트 설정';
      case 3:
        return '고급 설정';
      default:
        return '캐릭터 만들기';
    }
  };

  const handleSaveToIndexedDB = async () => {
    const state = useCharacterCreationStore.getState();

    await saveDraftToDB({
      name: state.name,
      oneliner: state.oneliner,
      title: state.title,
      promptDetail: state.promptDetail,
      exampleDialogs: state.exampleDialogs,
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

  return (
    <>
      <header className={styles.Container}>
        {/* 왼쪽 섹션 - 뒤로 가기 버튼 및 제목 */}
        <div className={styles.Left_Section}>
          <Link href="/characters">
            <MdKeyboardBackspace className={styles.Icon} />
          </Link>
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
      </header>
    </>
  );
}
