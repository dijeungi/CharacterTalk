/**
 * @file         frontend/app/(routes)/(public)/ranking/page.tsx
 * @desc         캐릭터 인기 순위 페이지
 *
 * @author       최준호
 * @update       2025.08.06
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useFetchRankingQuery } from '@/app/_apis/character/_hooks';
import { BsChatFill } from 'react-icons/bs';
import { CharacterCardSkeleton } from '@/app/_skeletons/Skeletons';

type Period = 'realtime' | 'daily' | 'weekly' | 'monthly';

export default function RankingPage() {
  const [period, setPeriod] = useState<Period>('realtime');
  const { data: characters, isLoading, isError } = useFetchRankingQuery(period);

  const tabs: { period: Period; label: string }[] = [
    { period: 'realtime', label: '실시간' },
    { period: 'daily', label: '일간' },
    { period: 'weekly', label: '주간' },
    { period: 'monthly', label: '월간' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>인기 캐릭터 순위</h1>
      
      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.period}
            className={`${styles.tabButton} ${period === tab.period ? styles.active : ''}`}
            onClick={() => setPeriod(tab.period)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => <CharacterCardSkeleton key={index} />)
        ) : isError ? (
          <p>데이터를 불러오는 데 실패했습니다.</p>
        ) : characters && characters.length > 0 ? (
          characters.map((char, index) => (
            <Link href={`/characters/${char.code}`} key={char.code} className={styles.listItem}>
              <span className={styles.rank}>{char.rank || index + 1}</span>
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
        ) : (
          <div className={styles.noDataMessage}>
            <p>랭킹 데이터가 없습니다.</p>
            <p>아직 오늘 자 순위가 집계되지 않았거나, 해당 기간에 집계된 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}