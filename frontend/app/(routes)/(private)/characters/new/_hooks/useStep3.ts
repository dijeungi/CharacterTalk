// /_hooks/characters/useStep3.ts
import { useCharacterCreationStore } from '@/app/_store/characters';
import { useCharacterStepCommon } from './useCharacterStepCommon';

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
