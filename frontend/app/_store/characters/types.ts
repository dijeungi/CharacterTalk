interface CharacterCreationState {
  name: string;
  oneliner: string;
  // selectedVoice: string;
  profileImage: File | string | null;
  isDirty: boolean;
  currentStep: number;

  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  // setSelectedVoice: (voice: string) => void;
  setProfileImage: (image: File | string | null) => void;
  setDirty: () => void;
  resetDirty: () => void;
  setCurrentStep: (step: number) => void;
}
