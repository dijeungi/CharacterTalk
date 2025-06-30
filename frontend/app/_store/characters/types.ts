// frontend/app/_store/characters/types.ts

interface CharacterCreationState {
  // Step1
  name: string;
  oneliner: string;
  profileImage: File | string | null;

  // Step2
  title: string;
  promptDetail: string;
  exampleDialogs: { user: string; ai: string }[];
  speech: SpeechStyle;
  behaviorConstraint: string;

  // Step3
  scenarioTitle: string;
  scenarioGreeting: string;
  scenarioSituation: string;
  scenarioSuggestions: string[];

  // 공통
  isDirty: boolean;
  currentStep: number;

  // Actions
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setProfileImage: (image: File | string | null) => void;

  setTitle: (title: string) => void;
  setPromptDetail: (text: string) => void;
  addExampleDialog: (dialog: { user: string; ai: string }) => void;
  updateExampleDialog: (index: number, dialog: { user: string; ai: string }) => void;
  removeExampleDialog: (index: number) => void;
  setSpeech: (style: SpeechStyle) => void;
  setBehaviorConstraint: (text: string) => void;

  setScenarioTitle: (title: string) => void;
  setScenarioGreeting: (greeting: string) => void;
  setScenarioSituation: (situation: string) => void;
  updateScenarioSuggestion: (index: number, text: string) => void;

  setDirty: () => void;
  resetDirty: () => void;
  setCurrentStep: (step: number) => void;
  resetAll: () => void;
}

// 말투 스타일 타입 정의
type SpeechStyle =
  | 'formal-polite' // 존댓말 / 정중함
  | 'casual-friendly' // 반말 / 친근함
  | 'direct-blunt' // 직설적 / 쿨한 말투
  | 'cheerful' // 명랑하고 밝은 말투
  | 'tsundere' // 츤데레 스타일
  | ''; // 선택 안 함
