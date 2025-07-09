// Step

interface Step1Props {
  onNext: () => void;
  fromStep2: boolean;
}

interface Step2Props {
  onPrev: () => void;
  onNext: () => void;
}

interface Step3Props {
  onPrev: () => void;
  onNext: () => void;
}

// UnsavedChangesModal.tsx
interface UnsavedChangesModalProps {
  onClose: () => void;
  onExit: () => void;
}

// ContinueCreationModal.tsx
interface ContinueCreationModalProps {
  open: boolean;
  onNew: () => void;
  onContinue: () => void;
}

// Drawer

// ProfileImageGeneratorDrawer.tsx
interface ProfileImageGeneratorDrawerProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
}

// HashtagDrawer.tsx
interface HashtagDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddHashtag: (hashtag: string) => void;
  existingHashtags: string[];
  onRemoveHashtag: (hashtag: string) => void;
}
