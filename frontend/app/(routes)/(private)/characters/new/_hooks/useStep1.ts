/**
 * @file         frontend/app/(routes)/(private)/characters/new/_hooks/useStep1.ts
 * @desc         캐릭터 생성 Step1의 상태와 유효성 로직을 관리하는 커스텀 훅
 *
 * @author       최준호
 * @update       2025.07.24
 */

import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from '@/app/(routes)/(private)/characters/new/_hooks/useCharacterStepCommon';

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

  const isFormValid = !!(name && oneliner && profileImage);

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
