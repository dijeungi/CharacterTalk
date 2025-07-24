/**
 * @file         frontend/app/(routes)/(private)/characters/new/_hooks/useStep4.ts
 * @desc         캐릭터 생성 Step4의 상태와 유효성 로직을 관리하는 커스텀 훅
 *
 * @author       최준호
 * @update       2025.07.24
 */

import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from '@/app/(routes)/(private)/characters/new/_hooks/useCharacterStepCommon';

export function useStep4() {
  const {
    visibility,
    genre,
    target,
    conversationType,
    userFilter,
    hashtags,
    commentsEnabled,
    setVisibility,
    setGenre,
    setTarget,
    setConversationType,
    setUserFilter,
    addHashtag,
    removeHashtag,
    setCommentsEnabled,
  } = useCharacterCreationStore();

  const isFormValid =
    !!visibility &&
    !!genre &&
    !!target &&
    !!conversationType &&
    !!userFilter &&
    hashtags.length > 0 &&
    commentsEnabled !== undefined;

  useCharacterStepCommon([
    'visibility',
    'genre',
    'target',
    'conversationType',
    'userFilter',
    'hashtags',
    'commentsEnabled',
  ]);

  return {
    visibility,
    genre,
    target,
    conversationType,
    userFilter,
    hashtags,
    commentsEnabled,
    setVisibility,
    setGenre,
    setTarget,
    setConversationType,
    setUserFilter,
    addHashtag,
    removeHashtag,
    setCommentsEnabled,
    isFormValid,
  };
}
