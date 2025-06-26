/**
 * @route        /characters
 * @file         frontend/app/(routes)/(private)/characters/page.tsx
 * @component    CharacterPage
 * @desc         사용자 본인의 캐릭터 목록을 보여주는 페이지
 *
 * @layout       default
 * @access       private
 * @props        없음
 *
 * @features
 *  - 내 캐릭터 리스트 UI 렌더링
 *  - 캐릭터 생성 버튼 클릭 시 생성 페이지 이동
 *
 * @dependencies
 *  - next/navigation (router)
 *  - CSS Module (CharacterPage.module.css)
 *
 * @todo
 *  - 서버에서 캐릭터 목록 받아오는 기능 추가
 *  - 리스트 없을 때 Empty UI 구성
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

'use client';
import { useRouter } from 'next/navigation';

// css
import styles from './CharacterPage.module.css';

export default function CharacterPage() {
  const router = useRouter();

  // route
  const handleCreate = () => {
    router.push('/characters/new');
  };

  return (
    <main className={styles.page}>
      {/* 헤더 부분 */}
      <section className={styles.header}>
        <h1 className={styles.title}>내 캐릭터</h1>
        <button onClick={handleCreate} className={styles.createButton}>
          캐릭터 만들기
        </button>
      </section>

      {/* 캐릭터 목록 */}
      <section className={styles.list}>
        <div className={styles.card}>
          <p className={styles.name}>캐릭터 이름</p>
          <p className={styles.description}>설명 or 태그</p>
        </div>
      </section>
    </main>
  );
}
