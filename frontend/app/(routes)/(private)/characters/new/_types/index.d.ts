// Step

export interface Step1Props {
  onNext: () => void;
  // muti-form으로 이전 버튼 시 /characters(이전페이지) 로 다시 이동시켜야하기 때문에
  fromStep2: boolean;
}

export interface StepComponentProps {
  onPrev: () => void;
  onNext: () => void;
}

export interface UnsavedChangesModalProps {
  onClose: () => void;
  onExit: () => void;
}

// ContinueCreationModal.tsx
export interface ContinueCreationModalProps {
  open: boolean;
  onNew: () => void;
  onContinue: () => void;
}
// ProfileImageGeneratorDrawer.tsx
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
