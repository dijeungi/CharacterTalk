/*
  Route: '/characters'
  Path: app/(routes)/(private)/characters/page.tsx
  Description:
    - 이 컴포넌트는 사용자의 캐릭터 목록 페이지입니다.
    - '캐릭터 만들기' 버튼을 클릭하면 새로운 캐릭터 생성 화면( '/characters/new' ) 으로 이동합니다.
*/

'use client';

// next.js
import { useRouter } from 'next/navigation';

// css
import styles from './CharacterPage.module.css';

export default function CharacterPage() {
  const router = useRouter();

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
