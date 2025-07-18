/**
 * @store        useCharacterCreationStore
 * @file         frontend/app/store/characters/index.ts
 * @desc         캐릭터 생성 1단계 상태 관리 (이름, 한줄소개, 보이스, 이미지 등 입력값 및 변경 여부 상태 포함)
 *
 * @state
 *  - name: 캐릭터 이름
 *  - oneliner: 한 줄 소개 문구
 *  - selectedVoice: 선택된 음성 ID
 *  - profileImage: 업로드된 이미지 (File/Blob/URL)
 *  - isDirty: 변경 여부 플래그
 *
 * @actions
 *  - setName: 이름 설정
 *  - setOneliner: 한 줄 소개 설정
 *  - setSelectedVoice: 음성 선택 설정
 *  - setProfileImage: 이미지 설정
 *  - setDirty: dirty 상태 true로 설정
 *  - resetDirty: dirty 상태 초기화
 *
 * @usage        캐릭터 생성 페이지 (step1) 입력 상태 관리
 * @dependencies Zustand
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.23
 */

// store
import { create } from 'zustand';

export const useCharacterCreationStore = create<CharacterCreationState>(set => ({
  // Step1
  name: '',
  oneliner: '',
  profileImage: null,
  mbti: '',

  // Step2
  title: '',
  promptDetail: '',
  exampleDialogs: [],
  speech: '',
  behaviorConstraint: '',

  // Step3
  scenarioTitle: '기본 설정',
  scenarioGreeting: '',
  scenarioSituation: '',
  scenarioSuggestions: ['', '', ''],

  // 공통
  isDirty: false,
  currentStep: 1,

  // Step 1
  setName: name => set({ name, isDirty: true }),
  setOneliner: oneliner => set({ oneliner, isDirty: true }),
  setProfileImage: image => set({ profileImage: image, isDirty: true }),
  setMbti: mbti => set({ mbti, isDirty: true }),

  // Step 2
  setTitle: title => set({ title, isDirty: true }),
  setPromptDetail: text => set({ promptDetail: text, isDirty: true }),
  addExampleDialog: dialog =>
    set(state => ({
      exampleDialogs: [...state.exampleDialogs, dialog],
      isDirty: true,
    })),
  updateExampleDialog: (index, dialog) =>
    set(state => {
      const copy = [...state.exampleDialogs];
      copy[index] = dialog;
      return { exampleDialogs: copy, isDirty: true };
    }),
  removeExampleDialog: index =>
    set(state => ({
      exampleDialogs: state.exampleDialogs.filter((_, i) => i !== index),
      isDirty: true,
    })),
  setSpeech: style => set({ speech: style, isDirty: true }),
  setBehaviorConstraint: text => set({ behaviorConstraint: text, isDirty: true }),

  // Step 3
  setScenarioTitle: (title: string) => set({ scenarioTitle: title }),
  setScenarioGreeting: (greeting: string) => set({ scenarioGreeting: greeting }),
  setScenarioSituation: (situation: string) => set({ scenarioSituation: situation }),
  updateScenarioSuggestion: (index: number, text: string) =>
    set(state => {
      const updated = [...state.scenarioSuggestions];
      updated[index] = text;
      return { scenarioSuggestions: updated };
    }),

  // 공통 actions
  setDirty: () => set({ isDirty: true }),
  resetDirty: () => set({ isDirty: false }),
  setCurrentStep: step => set({ currentStep: step }),

  resetAll: () =>
    set({
      name: '',
      oneliner: '',
      profileImage: null,
      promptDetail: '',
      exampleDialogs: [],
      speech: '',
      behaviorConstraint: '',
      isDirty: false,
      currentStep: 1,
    }),
}));
