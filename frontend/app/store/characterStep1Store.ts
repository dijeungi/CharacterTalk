import { create } from 'zustand';

interface Step1State {
  name: string;
  oneliner: string;
  selectedVoice: string;
  profileImage: File | null;
  isDirty: boolean;
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setSelectedVoice: (voice: string) => void;
  setProfileImage: (file: File | null) => void;
  setDirty: () => void;
  resetDirty: () => void;
}

export const useCharacterStep1Store = create<Step1State>(set => ({
  name: '',
  oneliner: '',
  selectedVoice: '',
  profileImage: null,
  isDirty: false,
  setName: name => set({ name }),
  setOneliner: oneliner => set({ oneliner }),
  setSelectedVoice: selectedVoice => set({ selectedVoice }),
  setProfileImage: file => set({ profileImage: file }),
  setDirty: () => set({ isDirty: true }),
  resetDirty: () => set({ isDirty: false }),
}));
