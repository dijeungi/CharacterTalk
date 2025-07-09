/**
 * @hook         useRestoreCharacterDraft
 * @file         frontend/app/_hooks/characters/useRestoreCharacterDraft.ts
 * @desc         캐릭터 생성 임시저장 데이터를 복원하는 범용 훅
 *
 * @author       최준호
 * @since        2025.07.07
 */
import { useEffect, useState } from 'react';
import { getDraftFromDB, getImageFromDB } from '@/app/_utils/indexedDBUtils';
import { useCharacterCreationStore } from '@/app/_store/characters';

export const useRestoreCharacterDraft = (
  fromLaterStep: boolean,
  setContinueModalOpen: (isOpen: boolean) => void
): boolean => {
  const [isDataLoaded, setIsDataLoaded] = useState(fromLaterStep);

  // store import
  const {
    setName,
    setOneliner,
    setProfileImage,
    setMbti,
    setTitle,
    setPromptDetail,
    setExampleDialogs,
    setSpeech,
    setBehaviorConstraint,
    setScenarioTitle,
    setScenarioGreeting,
    setScenarioSituation,
    setScenarioSuggestions,
    setVisibility,
    setUserFilter,
    setGenre,
    setTarget,
    setConversationType,
    setHashtags,
    setCommentsEnabled,
  } = useCharacterCreationStore();

  // 다음 단계에서 돌아온 경우에는 복원 로직을 실행하지 않습니다.
  useEffect(() => {
    if (fromLaterStep) {
      return;
    }

    const restore = async () => {
      try {
        // DB에서 텍스트 데이터와 이미지 데이터를 병렬로 가져옵니다.
        const [saved, imageFile] = await Promise.all([
          getDraftFromDB(),
          getImageFromDB('profileImage'),
        ]);

        // 저장된 데이터가 있을 경우에만 복원을 진행합니다.
        if (saved) {
          // Step 1
          setName(saved.name || '');
          setOneliner(saved.oneliner || '');
          setMbti(saved.mbti || '');
          if (imageFile) setProfileImage(imageFile);

          // Step 2
          setTitle(saved.title || '');
          setPromptDetail(saved.promptDetail || '');
          setExampleDialogs(saved.exampleDialogs || []);
          setSpeech(saved.speech || '');
          setBehaviorConstraint(saved.behaviorConstraint || '');

          // Step 3
          setScenarioTitle(saved.scenarioTitle || '기본 설정');
          setScenarioGreeting(saved.scenarioGreeting || '');
          setScenarioSituation(saved.scenarioSituation || '');
          setScenarioSuggestions(saved.scenarioSuggestions || ['', '', '']);

          // Step 4
          setVisibility(saved.visibility || 'private');
          setUserFilter(saved.userFilter || 'initial');
          setGenre(saved.genre || '');
          setTarget(saved.target || 'all');
          setConversationType(saved.conversationType || '1to1');
          setHashtags(saved.hashtags || []);
          setCommentsEnabled(saved.commentsEnabled !== undefined ? saved.commentsEnabled : true);

          // "이어서 만들기" 모달
          setContinueModalOpen(true);
        }
      } catch (error) {
        console.error('Failed to restore character draft:', error);
      } finally {
        // 성공하든 실패하든 로딩 완료 상태로 변경합니다.
        setIsDataLoaded(true);
      }
    };

    restore();
  }, [fromLaterStep]);

  return isDataLoaded;
};
