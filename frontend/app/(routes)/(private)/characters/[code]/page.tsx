/**
 * @file      frontend/app/(routes)/(private)/characters/[code]/page.tsx
 * @desc      Page: 캐릭터 코드 기반 상세 정보 조회 및 UI 렌더링 (Skeleton, 예외 처리 포함)
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import styles from './page.module.css';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import axiosNext from '@/app/_lib/axiosNext';
import SkeletonUI from '@/app/(routes)/(private)/characters/[code]/SkeletonUI';
import { Character } from '@/app/(routes)/(private)/characters/[code]/_types';

import { useQuery } from '@tanstack/react-query';

// API 호출 함수
const fetchCharacterDetail = async (code: string): Promise<Character> => {
  const { data } = await axiosNext.get(`/character/${code}`);
  return data;
};

export default function CharacterDetailPage() {
  const params = useParams();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;

  const {
    data: character,
    isLoading,
    isError,
    error,
  } = useQuery<Character, Error>({
    queryKey: ['character', code],
    queryFn: () => fetchCharacterDetail(code),
    enabled: !!code,
  });

  // 2. isLoading 상태일 때 SkeletonUI를 렌더링합니다.
  if (isLoading) {
    return <SkeletonUI />;
  }

  if (isError) {
    return <div className={styles.loadingContainer}>{error.message}</div>;
  }

  if (!character) {
    return <div className={styles.loadingContainer}></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.imageWrapper}>
          <Image
            src={character.profile_image_url || '/default-profile.png'}
            alt={`${character.name}의 프로필`}
            width={300}
            height={300}
            className={styles.profileImage}
          />
        </div>
        <button className={styles.chatButton}>대화 시작하기</button>
      </div>

      <div className={styles.rightColumn}>
        <section className={styles.headerSection}>
          <div className={styles.nameAndCreator}>
            <h1 className={styles.name}>{character.name}</h1>
            <span className={styles.creator}>by @{character.creator_name}</span>
          </div>
          <div className={styles.hashtagContainer}>
            {character.hashtags?.map(tag => (
              <span key={tag} className={styles.hashtag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={styles.oneliner}>{character.oneliner}</p>
        </section>

        <section className={styles.detailsSection}>
          <div className={styles.detailItem}>
            <h2 className={styles.detailTitle}>상세 설정</h2>
            <p className={styles.preWrap}>{character.prompt_detail}</p>
          </div>
          <div className={styles.detailItem}>
            <h2 className={styles.detailTitle}>인트로</h2>
            <p className={styles.scenarioGreeting}>"{character.scenario_greeting}"</p>
            <p>{character.scenario_situation}</p>
          </div>
          <div className={styles.detailItem}>
            <h2 className={styles.detailTitle}>대화 예시</h2>
            <div className={styles.dialogContainer}>
              {character.example_dialogs?.map((dialog, index) => (
                <div key={index} className={styles.dialog}>
                  <p>
                    <strong>사용자:</strong> {dialog.user}
                  </p>
                  <p>
                    <strong>{character.name}:</strong> {dialog.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
