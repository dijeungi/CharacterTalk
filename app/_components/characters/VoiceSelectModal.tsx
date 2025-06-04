/*
  Route: '/characters/new/voice-select'
  Path: app/(routes)/(private)/characters/new/CharactersNew.tsx
  Description:
    - 이 컴포넌트는 캐릭터 만들기 과정에서 사용자가 목소리를 선택할 수 있는 드로어입니다.
    - 드로어는 화면 하단에서 슬라이드로 열리며, 목소리 선택 기능과 관련된 내용이 표시됩니다.
    - 드로어의 열림과 닫힘 상태는 `open` 및 `onClose`, `onOpen` 함수로 관리됩니다.
*/

'use client';

// MUI
import { SwipeableDrawer } from '@mui/material';

// css
import styles from '@/(routes)/(private)/characters/new/CharactersNew.module.css';

export default function VoiceSelectDrawer({
  open,
  onClose,
  onOpen,
  selectedVoice,
  setSelectedVoice,
}) {
  const HEADER_HEIGHT = 56;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      swipeAreaWidth={20}
      disableSwipeToOpen={false}
    >
      <div className={styles.drawerContent}>
        <div className={styles.drawerBar} />
      </div>

      {/* 본문 내용 (목소리 선택 등) */}
    </SwipeableDrawer>
  );
}
