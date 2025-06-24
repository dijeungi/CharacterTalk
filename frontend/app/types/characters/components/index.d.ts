/**
 * @types        characters/components (modal or Drawer)
 * @file         frontend/app/types/characters/components/index.d.ts
 * @desc         캐릭터 생성 중단 복구 모달 관련 Props 정의
 *
 * @state        없음
 * @actions      없음
 *
 * @usage        Step1_Profile.tsx > ContinueCreationModal.tsx
 * @dependencies 없음
 *
 * @author       최준호
 * @since        2025.06.24
 * @updated      2025.06.24
 */

// ============================ M o d a l ============================

// frontend/app/(routes)/(private)/characters/new/_components/Modal/ContinueCreationModal.tsx
export interface ContinueCreationModalProps {
  open: boolean;
  onNew: () => void;
  onContinue: () => void;
}

// ============================ D r a w e r ============================

// frontend/app/(routes)/(private)/characters/new/_components/Drawer/ProfileImageGeneratorDrawer.tsx
export interface ProfileImageGeneratorDrawerProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (imageFile: File) => void;
}
