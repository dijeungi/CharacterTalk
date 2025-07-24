/**
 * @file         frontend/app/(routes)/(private)/characters/new/_hooks/useStep2.ts
 * @desc         캐릭터 생성 Step2의 상태와 유효성 로직을 관리하는 커스텀 훅
 *
 * @author       최준호
 * @update       2025.07.24
 */

import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from '@/app/(routes)/(private)/characters/new/_hooks/useCharacterStepCommon';

export function useStep2() {
  const {
    title,
    promptDetail,
    speech,
    behaviorConstraint,
    exampleDialogs,
    setTitle,
    setPromptDetail,
    setSpeech,
    setBehaviorConstraint,
    addExampleDialog,
    updateExampleDialog,
    removeExampleDialog,
  } = useCharacterCreationStore();

  const isFormValid = !!(title.trim() && promptDetail.trim() && speech.trim());

  useCharacterStepCommon([
    'title',
    'promptDetail',
    'speech',
    'behaviorConstraint',
    'exampleDialogs',
  ]);

  return {
    title,
    promptDetail,
    speech,
    behaviorConstraint,
    exampleDialogs,
    setTitle,
    setPromptDetail,
    setSpeech,
    setBehaviorConstraint,
    addExampleDialog,
    updateExampleDialog,
    removeExampleDialog,
    isFormValid,
  };
}
