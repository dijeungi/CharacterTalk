/**
 * @file         frontend/app/(routes)/(private)/characters/new/_types/index.d.ts
 * @desc         캐릭터 제작 페이지에서 사용되는 인터페이스 정의 모음
 *
 * @author       최준호
 * @update       2025.07.26
 */

/**
 *  ========== Step ==========
 */

export interface Step1Props {
  onNext: () => void;
  // muti-form으로 이전 버튼 시 /characters(이전페이지) 로 다시 이동시켜야하기 때문에
  fromStep2: boolean;
}

export interface StepComponentProps {
  onPrev: () => void;
  onNext: () => void;
}

/**
 *  ========== Modal ==========
 *  ContinueCreationModal.tsx
 */

export interface ContinueCreationModalProps {
  open: boolean;
  onNew: () => void;
  onContinue: () => void;
}

// UnsavedChangesModalProps.tsx
export interface UnsavedChangesModalProps {
  onClose: () => void;
  onExit: () => void;
}

/**
 *  ========== Drawer ==========
 *  ProfileImageGeneratorDrawer.tsx
 */

export interface ProfileImageGeneratorDrawerProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
}

// HashtagDrawer.tsx
export interface HashtagDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddHashtag: (hashtag: string) => void;
  existingHashtags: string[];
  onRemoveHashtag: (hashtag: string) => void;
}
