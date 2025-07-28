/**
 * @file      frontend/app/_components/main/GridSwiper.tsx
 * @desc      Component: 메인 페이지 그리드 스와이퍼 UI, AI 추천 캐릭터 목록 표시
 *
 * @author    최준호
 * @update    2025.07.20
 */

'use client';

import { useState } from 'react';
import styles from '@/app/_components/main/GridSwiper.module.css';
import GridSwiperSkeleton from '@/app/_components/main/GridSwiperSkeleton';

import Link from 'next/link';
import Image from 'next/image';

import { useFetchCharactersQuery } from '@/app/_apis/character/_hooks';

export default function GridSwiper() {
  const [sort, setSort] = useState('latest');
  const { data, isLoading, isError, refetch } = useFetchCharactersQuery({
    sort: sort,
    page: 1,
  });

  const renderContent = () => {
    if (isLoading) {
      return <GridSwiperSkeleton />;
    }

    if (isError) {
      return (
        <div className={styles.errorContainer}>
          <p>캐릭터를 불러오는 데 실패했습니다.</p>
          <button onClick={() => refetch()} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {data?.characters.map(char => (
          <Link href={`/characters/${char.code}`} key={char.code} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={char.profile_image_url || '/img/default-profile.png'}
                  alt={`${char.name}의 프로필`}
                  width={300}
                  height={300}
                  className={styles.img}
                />
              </div>
              <div className={styles.info}>
                <p className={styles.name}>{char.name}</p>
                <p className={styles.oneliner}>{char.oneliner}</p>
                <div className={styles.tagList}>
                  {char.hashtags?.map((tag, idx) => (
                    <p key={idx} className={styles.tag}>
                      {tag}
                    </p>
                  ))}
                </div>
                <p className={styles.creator}>@{char.creator_name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>이것만은 꼭!</div>
      <div className={styles.subTitle}>AI에게 추천받은 캐릭터들을 소개합니다.</div>
      {renderContent()}
    </div>
  );
}
