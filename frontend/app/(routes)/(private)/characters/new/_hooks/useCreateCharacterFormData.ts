/**
 * @file         frontend/app/(routes)/(private)/characters/new/_hooks/useCreateCharacterFormData.ts
 * @desc         캐릭터 생성 데이터를 FormData 형태로 변환하여 서버 전송에 활용하는 커스텀 훅
 *
 * @author       최준호
 * @update       2025.07.24
 */

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
