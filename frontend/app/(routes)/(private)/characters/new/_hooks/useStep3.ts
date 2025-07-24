/**
 * @file         frontend/app/(routes)/(private)/characters/new/_hooks/useStep3.ts
 * @desc         캐릭터 생성 Step3의 상태와 유효성 로직을 관리하는 커스텀 훅
 *
 * @author       최준호
 * @update       2025.07.24
 */

import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from '@/app/(routes)/(private)/characters/new/_hooks/useCharacterStepCommon';

export function useStep3() {
  const {
    scenarioTitle,
    scenarioGreeting,
    scenarioSituation,
    scenarioSuggestions,
    setScenarioTitle,
    setScenarioGreeting,
    setScenarioSituation,
    updateScenarioSuggestion,
  } = useCharacterCreationStore();

  const isFormValid = !!(scenarioTitle && scenarioGreeting && scenarioSituation);

  useCharacterStepCommon([
    'scenarioTitle',
    'scenarioGreeting',
    'scenarioSituation',
    'scenarioSuggestions',
  ]);

  return {
    scenarioTitle,
    scenarioGreeting,
    scenarioSituation,
    scenarioSuggestions,
    setScenarioTitle,
    setScenarioGreeting,
    setScenarioSituation,
    updateScenarioSuggestion,
    isFormValid,
  };
}
