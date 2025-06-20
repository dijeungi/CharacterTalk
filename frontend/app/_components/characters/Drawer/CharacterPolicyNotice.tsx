/*
  Route: '/characters/new'
  Path: app/(routes)/(private)/characters/new/CharactersNew.tsx
  Description:
    - 이 컴포넌트는 캐릭터 만들기 화면에서 부적절한 캐릭터에 대한 정책을 안내하는 화면입니다.
*/

'use client';

// default
import { useState } from 'react';

// library
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

// css
import styles from './CharacterPolicyNotice.module.css';

export default function CharacterPolicyNotice() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.helpNotice}>
        ※ 부적절한 캐릭터는 삭제될 수 있어요
        <button className={styles.helpButton} onClick={() => setOpen(true)}>
          더보기
        </button>
      </div>

      {/* 슬라이드형 Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => {}}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
              padding: '2rem',
              backgroundColor: '#ffffff',
              color: '#000000',
            },
          },
        }}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerBar} />
          <h2 className={styles.drawerTitle}>캐릭터 제작 시 꼭 확인해주세요!</h2>
          <p className={styles.drawerText}>
            아래 항목에 해당하는 캐릭터는 제작이 제한되거나 삭제될 수 있습니다:
            <br />
            <br />
            • 노골적인 선정성, 폭력성, 차별/혐오 표현 포함
            <br />
            • 타인의 저작권/초상권을 침해하는 설정
            <br />
            • 미성년자 대상 부적절한 내용, 딥페이크, 가짜뉴스 기반
            <br />
            • 특정 인물에 대한 조롱, 명예훼손 목적 설정
            <br />
            <br />
            반복 위반 시 제작 차단 등 추가 제재가 적용됩니다.
          </p>
          <button className={styles.Button} onClick={() => setOpen(false)}>
            확인했어요
          </button>
        </div>
      </SwipeableDrawer>
    </>
  );
}
