interface Step1Props {
  onNext: () => void;
}

// frontend/app/(routes)/(private)/characters/new/_components/Modal/ContinueCreationModal.tsx
interface ContinueCreationModalProps {
  open: boolean;
  onNew: () => void;
  onContinue: () => void;
}

// frontend/app/(routes)/(private)/characters/new/_components/Drawer/ProfileImageGeneratorDrawer.tsx
interface ProfileImageGeneratorDrawerProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (file: File) => void;
}
