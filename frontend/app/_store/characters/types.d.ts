/**
 * @file      frontend/app/_store/characters/types.d.ts
 * @desc      Type: 캐릭터 생성 상태 및 단계별 입력 값과 액션 타입 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export interface CharacterCreationState {
  // Step1
  name: string;
  oneliner: string;
  profileImage: File | string | null;
  mbti: MBTI | '';

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

  // Step 4
  visibility: 'private' | 'public' | 'link';
  userFilter: 'initial' | 'fixed';
  genre: 'romance' | 'fantasy' | 'sci-fi' | 'daily' | 'historical' | 'other';
  target: 'male' | 'female' | 'all';
  conversationType: '1to1' | 'simulation';
  hashtags: string[];
  commentsEnabled: boolean;

  // 공통
  isDirty: boolean;
  currentStep: number;

  // Actions
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setProfileImage: (image: File | string | null) => void;
  setMbti: (mbti: MBTI) => void;

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

  // Step 4 Actions
  setVisibility: (visibility: 'private' | 'public' | 'link') => void;
  setUserFilter: (filter: 'initial' | 'fixed') => void;
  setGenre: (genre: 'romance' | 'fantasy' | 'sci-fi' | 'daily' | 'historical' | 'other') => void;
  setTarget: (target: 'male' | 'female' | 'all') => void;
  setConversationType: (type: '1to1' | 'simulation') => void;
  setHashtags: (hashtags: string[]) => void;
  addHashtag: (hashtag: string) => void;
  removeHashtag: (hashtag: string) => void;
  setCommentsEnabled: (enabled: boolean) => void;

  setDirty: () => void;
  resetDirty: () => void;
  setCurrentStep: (step: number) => void;
  resetAllData: () => void;
}

// MBTI 타입 정의 (16개 성격 유형)
type MBTI =
  | 'ISTJ'
  | 'ISFJ'
  | 'INFJ'
  | 'INTJ'
  | 'ISTP'
  | 'ISFP'
  | 'INFP'
  | 'INTP'
  | 'ESTP'
  | 'ESFP'
  | 'ENFP'
  | 'ENTP'
  | 'ESTJ'
  | 'ESFJ'
  | 'ENFJ'
  | 'ENTJ';

// 말투 스타일 타입 정의
type SpeechStyle =
  | 'formal-polite' // 존댓말 / 정중함
  | 'casual-friendly' // 반말 / 친근함
  | 'direct-blunt' // 직설적 / 쿨한 말투
  | 'cheerful' // 명랑하고 밝은 말투
  | 'tsundere' // 츤데레 스타일
  | ''; // 선택 안 함
