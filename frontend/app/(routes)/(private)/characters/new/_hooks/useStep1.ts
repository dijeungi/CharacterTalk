// /_hooks/characters/useStep1.ts
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from './useCharacterStepCommon';

export function useStep1() {
  const {
    name,
    oneliner,
    profileImage,
    mbti,
    setName,
    setOneliner,
    setProfileImage,
    setMbti,
    resetDirty,
  } = useCharacterCreationStore();

  const isFormValid = !!(name && oneliner && profileImage && mbti);

  useCharacterStepCommon(['name', 'oneliner', 'profileImage', 'mbti']);

  return {
    name,
    oneliner,
    profileImage,
    mbti,
    setMbti,
    setName,
    setOneliner,
    setProfileImage,
    isFormValid,
    resetDirty,
  };
}
