// /_hooks/characters/useStep2.ts
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from './useCharacterStepCommon';

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
