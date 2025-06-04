'use client';

import { useRouter } from 'next/navigation';
import styles from './CharacterPage.module.css';

export default function CharacterPage() {
  const router = useRouter();

  const handleCreate = () => {
    router.push('/characters/new');
  };

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>내 캐릭터</h1>
        <button onClick={handleCreate} className={styles.createButton}>
          캐릭터 만들기
        </button>
      </section>

      <section className={styles.list}>
        <div className={styles.card}>
          <p className={styles.name}>캐릭터 이름</p>
          <p className={styles.description}>설명 or 태그</p>
        </div>
      </section>
    </main>
  );
}
