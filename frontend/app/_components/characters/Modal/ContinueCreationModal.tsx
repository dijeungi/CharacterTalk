'use client';

// types
import { ContinueCreationModalProps } from '@/types/CharacterCreate';

// style
import styles from './ContinueCreationModal.module.css';

export default function ContinueCreationModal({
  open,
  onNew,
  onContinue,
}: ContinueCreationModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogTitle"
        aria-description="dialogDesc"
        tabIndex={-1}
      >
        <h2 className={styles.modalTitle}>작성하시던 내용을 찾았어요 🔍</h2>
        <p className={styles.modalMessage}>
          이전에 작성하던 캐릭터 정보가 있습니다.
          <br />
          이어서 제작하시겠습니까?
        </p>
        <div className={styles.modalButtonRow}>
          <button className={`${styles.modalButton} ${styles.secondary}`} onClick={onNew}>
            새로 제작
          </button>
          <button className={`${styles.modalButton} ${styles.primary}`} onClick={onContinue}>
            이어서 제작
          </button>
        </div>
      </div>
    </div>
  );
}
