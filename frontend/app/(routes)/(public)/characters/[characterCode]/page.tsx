/**
 * @file      frontend/app/(routes)/(public)/characters/[code]/page.tsx
 * @desc      Page: 캐릭터 코드 기반 상세 정보 조회 및 UI 렌더링 (Skeleton, 예외 처리 포함)
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import styles from '@/app/(routes)/(public)/characters/[characterCode]/page.module.css';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { BsChatFill } from 'react-icons/bs';

import axiosNext from '@/app/_lib/axiosNext';
import { CharacterDetailSkeleton } from '@/app/_skeletons/Skeletons';
import { CharacterDetailResponse as Character } from '@/app/_apis/character/types';

import { useQuery } from '@tanstack/react-query';

// API 호출 함수
const fetchCharacterDetail = async (characterCode: string): Promise<Character> => {
  const { data } = await axiosNext.get(`/character/${characterCode}`);
  return data;
};

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const characterCode = Array.isArray(params.characterCode)
    ? params.characterCode[0]
    : params.characterCode;

  const {
    data: character,
    isLoading,
    isError,
    error,
  } = useQuery<Character, Error>({
    queryKey: ['character', characterCode],
    queryFn: () => fetchCharacterDetail(characterCode!),
    enabled: !!characterCode,
  });

  // isLoading 상태일 때 SkeletonUI를 렌더링합니다.
  if (isLoading) {
    return <CharacterDetailSkeleton />;
  }

  if (isError) {
    return <div className={styles.loadingContainer}>{error.message}</div>;
  }

  if (!character) {
    return <div className={styles.loadingContainer}></div>;
  }

  const handleChatStart = () => {
    console.log('대화 시작하기 버튼 클릭됨, characterCode:', characterCode);
    if (characterCode) {
      router.push(`/chat/${characterCode}`);
    } else {
      console.error('캐릭터 코드가 없어 채팅방으로 이동할 수 없습니다.');
    }
  };

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
          <div className={styles.conversationCountOverlay}>
            <BsChatFill />
            <span>{character.conversation_count}</span>
          </div>
        </div>
        <button className={styles.chatButton} onClick={handleChatStart}>
          대화 시작하기
        </button>
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
