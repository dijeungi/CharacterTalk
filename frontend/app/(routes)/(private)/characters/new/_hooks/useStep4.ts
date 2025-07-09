// /_hooks/characters/useStep3.ts
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from './useCharacterStepCommon';

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
