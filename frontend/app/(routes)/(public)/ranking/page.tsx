/**
 * @file         frontend/app/(routes)/(public)/ranking/page.tsx
 * @desc         캐릭터 인기 순위 페이지
 *
 * @author       최준호
 * @update       2025.08.06
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useFetchCharactersQuery } from '@/app/_apis/character/_hooks';
import { BsChatFill } from 'react-icons/bs';
import { CharacterCardSkeleton } from '@/app/_skeletons/Skeletons';

export default function RankingPage() {
  const { data, isLoading, isError } = useFetchCharactersQuery({
    sort: 'popular',
    page: 1,
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>인기 캐릭터 순위</h1>
      <div className={styles.list}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => <CharacterCardSkeleton key={index} />)
        ) : isError ? (
          <p>데이터를 불러오는 데 실패했습니다.</p>
        ) : (
          data?.characters.map((char, index) => (
            <Link href={`/characters/${char.code}`} key={char.code} className={styles.listItem}>
              <span className={styles.rank}>{index + 1}</span>
              <div className={styles.imageWrapper}>
                <Image
                  src={char.profile_image_url || '/img/default-profile.png'}
                  alt={char.name}
                  width={60}
                  height={60}
                  className={styles.image}
                />
              </div>
              <div className={styles.characterInfo}>
                <p className={styles.name}>{char.name}</p>
                <p className={styles.oneliner}>{char.oneliner}</p>
              </div>
              <div className={styles.conversationCount}>
                <BsChatFill />
                <span>{char.conversation_count}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
