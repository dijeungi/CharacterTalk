interface CharacterStep1Store {
  name: string;
  oneliner: string;
  selectedVoice: string;
  profileImage: File | null;
  isDirty: boolean;
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setSelectedVoice: (voice: string) => void;
  setProfileImage: (image: File | String | null) => void;
  setDirty: () => void;
  resetDirty: () => void;
}
