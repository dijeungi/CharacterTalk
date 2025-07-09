// frontend/app/_apis/_hooks/useCreateCharacterFormData.ts

import { useCharacterCreationStore } from '@/app/_store/characters';

export const useCreateCharacterFormData = () => {
  const {
    name,
    oneliner,
    profileImage,
    mbti,

    title,
    promptDetail,
    exampleDialogs,
    speech,
    behaviorConstraint,

    scenarioTitle,
    scenarioGreeting,
    scenarioSituation,
    scenarioSuggestions,

    visibility,
    userFilter,
    genre,
    target,
    conversationType,
    hashtags,
    commentsEnabled,
  } = useCharacterCreationStore();

  const createFormData = () => {
    const formData = new FormData();

    // zustand에 저장된 데이터들을 FormData에 추가
    formData.append(
      'characterData',
      JSON.stringify({
        name,
        oneliner,
        profileImage,
        mbti,

        title,
        promptDetail,
        exampleDialogs,
        speech,
        behaviorConstraint,

        scenarioTitle,
        scenarioGreeting,
        scenarioSituation,
        scenarioSuggestions,

        visibility,
        userFilter,
        genre,
        target,
        conversationType,
        hashtags,
        commentsEnabled,
      })
    );

    // profileImage가 존재하면 FormData에 추가
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return formData;
  };

  return createFormData;
};
