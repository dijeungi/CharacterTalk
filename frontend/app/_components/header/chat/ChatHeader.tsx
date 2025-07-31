/**
 * @file      frontend/app/_components/header/chat/ChatHeader.tsx
 * @desc      Component: 채팅 페이지 전용 헤더
 *
 * @author    최준호
 * @update    2025.07.29
 */

'use client';

import { useRouter, useParams } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import styles from './ChatHeader.module.css';
import { useCharacterDetailQuery } from '@/app/_apis/character/_hooks';

export default function ChatHeader() {
  const router = useRouter();
  const params = useParams();

  // URL characterCode 추출
  const characterCode = Array.isArray(params.characterCode)
    ? params.characterCode[0]
    : params.characterCode;

  const { data: character, isLoading } = useCharacterDetailQuery(characterCode!);

  const characterName = isLoading ? '로딩 중...' : character?.name || '캐릭터 정보 없음';

  return (
    <header className={styles.container}>
      <div className={styles.leftSection}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <IoArrowBack />
        </button>
      </div>
      <div className={styles.centerSection}>
        <h1 className={styles.title}>{characterName}</h1>
      </div>
      <div className={styles.rightSection}>{/* 오른쪽은 비워둠 */}</div>
    </header>
  );
}
