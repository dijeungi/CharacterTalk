/*
  route: '/header/character-step'
  Path: app/_components/header/CharacterStepHeader.tsx
  Description:
    - 이 페이지는 캐릭터 만들기 화면에서 상단 헤더를 구현하는 컴포넌트입니다.
*/

'use client';

// Next.js
import Link from 'next/link';

// 스타일
import styles from '@/_styles/header/CharacterStepHeader.module.css';

// 아이콘
import { GoPerson } from 'react-icons/go';
import { MdKeyboardBackspace } from 'react-icons/md';

export default function CharacterStepHeader() {
  return (
    <>
      <header className={styles.container}>
        {/* 왼쪽 섹션 - 뒤로 가기 버튼 및 제목 */}
        <div className={styles.leftSection}>
          <Link href="/">
            <MdKeyboardBackspace className={styles.Icon} />
          </Link>
          <span className={styles.title}>캐릭터 만들기</span>
        </div>

        {/* 오른쪽 섹션 - 로그인 아이콘 */}
        <div className={styles.rightSection}>
          <Link href="/login">
            <GoPerson className={styles.Icon} />
          </Link>
        </div>
      </header>
    </>
  );
}
