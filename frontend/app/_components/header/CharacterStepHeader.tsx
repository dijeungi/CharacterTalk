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
import { useCharacterStep1Store } from '@/app/_store/characters';

// lib
import { MdKeyboardBackspace } from 'react-icons/md';
import { Toast } from '@/app/_utils/Swal';

export default function CharacterStepHeader() {
  // store 상태 호출
  const { isDirty, setDirty, resetDirty } = useCharacterStep1Store();

  // 로컬스토리지에 JSON 형식으로 임시 저장하는 함수
  const handleSaveToLocalStorage = () => {
    const state = useCharacterStep1Store.getState();

    const dataToSave = {
      name: state.name,
      oneliner: state.oneliner,
      selectedVoice: state.selectedVoice,
      profileImage: state.profileImage,
    };

    localStorage.setItem('tempCharacterData', JSON.stringify(dataToSave));

    Toast.fire({
      icon: 'success',
      title: '임시저장 되었습니다.',
      didOpen: () => {
        resetDirty();
      },
      didClose: () => {
        setDirty();
      },
    });
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
          <span className={styles.Title}>캐릭터 만들기</span>
        </div>

        {/* 오른쪽 섹션 - 로그인 아이콘 */}
        <div className={styles.Right_Section}>
          <button
            className={styles.Title_Button}
            disabled={!isDirty}
            onClick={handleSaveToLocalStorage}
          >
            임시저장
          </button>
        </div>
      </header>
    </>
  );
}
