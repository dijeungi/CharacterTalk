// types/character.d.ts

// Step1_Profile.tsx - State
export interface CharacterStep1State {
  name: string;
  oneliner: string;
  selectedVoice: string;
  profileImage: File | Blob | string | null;
}

// Step1_Profile.tsx - Actions
export interface CharacterStep1Actions {
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setSelectedVoice: (voice: string) => void;
  setProfileImage: (image: CharacterStep1State['profileImage']) => void;
  setDirty: () => void;
  resetDirty: () => void;
}

// `useCharacterStep1Store` Zustand 스토어의 전체 타입
export type CharacterStep1Store = CharacterStep1State & CharacterStep1Actions;

// '이어서 제작' 여부를 묻는 모달 컴포넌트의 Props 타입입니다.
export interface ContinueCreationModalProps {
  open: boolean;
  onNew: () => void;
  onContinue: () => void;
}

// 목소리 선택 모달 컴포넌트의 Props 타입입니다.
export interface VoiceSelectModalProps {
  open: boolean;
  onClose: () => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

// 프로필 이미지 생성 Drawer(슬라이드 패널) 컴포넌트의 Props 타입입니다.
export interface ProfileImageGeneratorDrawerProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (imageFile: File | Blob) => void;
}
