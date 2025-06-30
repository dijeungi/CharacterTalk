// /_hooks/characters/useStep1.ts
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from './useCharacterStepCommon';

export function useStep1() {
  const { name, oneliner, profileImage, setName, setOneliner, setProfileImage, resetDirty } =
    useCharacterCreationStore();

  const isFormValid = !!(name && oneliner && profileImage);

  useCharacterStepCommon(['name', 'oneliner', 'profileImage']);

  return {
    name,
    oneliner,
    profileImage,
    setName,
    setOneliner,
    setProfileImage,
    isFormValid,
    resetDirty,
  };
}
