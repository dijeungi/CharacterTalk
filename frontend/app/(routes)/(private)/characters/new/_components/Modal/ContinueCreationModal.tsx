/**
 * @component    ContinueCreationModal
 * @file         frontend/app/(routes)/(private)/characters/new/_components/Modal/ContinueCreationModal.tsx
 * @desc         캐릭터 생성 중단 시 복구 여부를 묻는 모달 컴포넌트
 *
 * @layout       characters New Layout
 * @access       private
 * @props
 *  - open: 모달 노출 여부
 *  - onNew: 새로 제작 콜백j
 *  - onContinue: 이어서 제작 콜백
 *
 * @features
 *  - 로컬 저장된 캐릭터 데이터 존재 시 사용자 복구 유도
 *  - 접근성 고려된 dialog role 및 aria 속성 포함
 *
 * @dependencies
 *  - CSS Module (ContinueCreationModal.module.css)
 *  - 타입 정의 (ContinueCreationModalProps)
 *
 * @todo         공통 모달 컴포넌트로 분리 고려
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.24
 */

'use client';

// css
import styles from './ContinueCreationModal.module.css';

export default function ContinueCreationModal({
  open,
  onNew,
  onContinue,
}: ContinueCreationModalProps) {
  if (!open) return null;

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
