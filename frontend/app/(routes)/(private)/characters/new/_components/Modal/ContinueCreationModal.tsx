/**
 * @file      frontend/app/(routes)/(private)/characters/new/_components/Modal/ContinueCreationModal.tsx
 * @desc      Component: 이전 캐릭터 작성 데이터 감지 시 새로 시작 또는 이어서 제작 선택 안내 모달
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import styles from '@/app/(routes)/(private)/characters/new/_components/Modal/Modal.module.css';
import { ContinueCreationModalProps } from '@/app/(routes)/(private)/characters/new/_types';

export default function ContinueCreationModal({
  open,
  onNew,
  onContinue,
}: ContinueCreationModalProps) {
  if (!open) return null;

  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogTitle"
        aria-description="dialogDesc"
        tabIndex={-1}
      >
        <h2 className={styles.title}>작성하시던 내용을 찾았어요 🔍</h2>
        <p className={styles.description}>
          이전에 작성하던 캐릭터 정보가 있습니다.
          <br />
          이어서 제작하시겠습니까?
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.restartButton} onClick={onNew}>
            새로 제작
          </button>
          <button className={styles.confirmButton} onClick={onContinue}>
            이어서 제작
          </button>
        </div>
      </div>
    </div>
  );
}
