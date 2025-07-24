/**
 * @file         frontend/app/(routes)/(private)/characters/new/_hooks/useCharacterStepCommon.ts
 * @desc         캐릭터 생성 단계의 값 변경 여부를 감지해 isDirty(input[Form]) 상태를 자동으로 설정하는 훅
 *
 * @author       최준호
 * @update       2025.07.22
 */

'use client';
import { useEffect } from 'react';

import { useCharacterCreationStore } from '@/app/_store/characters';
import { CharacterCreationState } from '@/app/_store/characters/types';

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
