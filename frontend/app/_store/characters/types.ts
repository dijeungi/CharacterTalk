// frontend/app/_store/characters/types.ts

interface CharacterCreationState {
  // Step1
  name: string;
  oneliner: string;
  profileImage: File | string | null;

  // Step2
  title: string;
  promptDetail: string;
  exampleDialogs: { user: string; ai: string }[];

  // 공통
  isDirty: boolean;
  currentStep: number;

  // Actions
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setProfileImage: (image: File | string | null) => void;

  setTitle: (title: string) => void;
  setPromptDetail: (text: string) => void;
  addExampleDialog: (dialog: { user: string; ai: string }) => void;
  updateExampleDialog: (index: number, dialog: { user: string; ai: string }) => void;
  removeExampleDialog: (index: number) => void;

  setDirty: () => void;
  resetDirty: () => void;
  setCurrentStep: (step: number) => void;
  resetAll: () => void;
}
