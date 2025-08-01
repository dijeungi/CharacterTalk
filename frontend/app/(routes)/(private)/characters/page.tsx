/**
 * @file         frontend/app/(routes)/(private)/characters/page.tsx
 * @desc         내 캐릭터 목록을 보여주고 새 캐릭터 생성으로 이동하는 페이지 컴포넌트
 *
 * @author       최준호
 * @update       2025.07.27
 */

'use client';
import { useState } from 'react';
import styles from '@/app/(routes)/(private)/characters/CharacterPage.module.css';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useMyCharacters } from '@/app/(routes)/(private)/characters/_hooks/useMyCharacters';
import { CharacterCardSkeleton } from '@/app/_skeletons/Skeletons';

import { BsFillGridFill, BsList } from 'react-icons/bs';

type ViewMode = 'grid' | 'list';

export default function CharacterPage() {
  const router = useRouter();
  const { characters, loading } = useMyCharacters();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleCreate = () => {
    router.push('/characters/new');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            내 캐릭터
            {!loading && <span className={styles.count}>{characters.length}개</span>}
          </h1>
          <p className={styles.subtitle}>나만의 특별한 캐릭터를 만나보세요!</p>
        </div>
        <div className={styles.viewToggle}>
          <button
            onClick={() => setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))}
            className={styles.toggleButton}
            aria-label="보기 모드 전환"
          >
            {viewMode === 'grid' ? <BsList /> : <BsFillGridFill />}
          </button>
        </div>
      </div>
      <div className={styles.listWrapper}>
        {loading ? (
          <section className={viewMode === 'grid' ? styles.list : styles.list_list_view}>
            {Array.from({ length: 6 }).map((_, index) =>
              viewMode === 'grid' ? <CharacterCardSkeleton key={index} /> : <div key={index} />
            )}
          </section>
        ) : characters.length > 0 ? (
          <section className={viewMode === 'grid' ? styles.list : styles.list_list_view}>
            {characters.map(char => (
              <Link
                href={`/characters/${char.code}`}
                key={char.code}
                className={`${styles.card} ${viewMode === 'list' ? styles.card_list_view : ''}`}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={char.profile_image_url}
                    alt={char.name}
                    width={160}
                    height={160}
                    className={styles.image}
                  />
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>{char.name}</p>
                  <p className={styles.oneliner}>{char.oneliner}</p>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <section className={styles.empty}>
            <p>아직 생성한 캐릭터가 없어요.</p>
            <p>첫 번째 캐릭터를 만들어보세요!</p>
          </section>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleCreate} className={styles.createButton}>
          + 캐릭터 만들기
        </button>
      </div>
    </div>
  );
}
