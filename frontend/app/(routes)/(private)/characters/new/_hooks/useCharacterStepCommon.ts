// /_hooks/characters/useCharacterStepCommon.ts
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useEffect } from 'react';

// Step들의 Form 필드의 수정 여부를 감지해 isDirty 상태를 자동으로 설정/해제하는 공통 훅
export function useCharacterStepCommon(affectedKeys: (keyof CharacterCreationState)[]) {
  const store = useCharacterCreationStore();

  useEffect(
    () => {
      const hasValue = affectedKeys.some(key => {
        const value = store[key];
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
      });

      hasValue ? store.setDirty() : store.resetDirty();
    },
    affectedKeys.map(k => store[k])
  );
}
