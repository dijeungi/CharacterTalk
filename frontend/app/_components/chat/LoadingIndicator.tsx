/**
 * @file         frontend/app/_components/chat/LoadingIndicator.tsx
 * @desc         채팅 흐름에 표시되는 로딩 애니메이션
 *
 * @author       최준호
 * @update       2025.08.06
 */
import React from 'react';
import styles from './LoadingIndicator.module.css';

export const LoadingIndicator = () => {
  return (
    <div className={styles.indicatorRow}>
      <div className={styles.indicatorBubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
};
