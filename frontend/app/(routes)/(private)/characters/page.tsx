/**
 * @file         frontend/app/(routes)/(private)/characters/page.tsx
 * @desc         내 캐릭터 목록을 보여주고 새 캐릭터 생성으로 이동하는 페이지 컴포넌트
 *
 * @author       최준호
 * @update       2025.07.27
 */

'use client';
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
