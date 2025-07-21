/**
 * @file      frontend/app/_store/characters/index.ts
 * @desc      Store: 캐릭터 생성 단계별 상태 관리 및 관련 액션 정의 (Zustand 기반)
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import { create } from 'zustand';
import { CharacterCreationState } from '@/app/_store/characters/types';

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

  // Step 4
  // 공개 범위, 이용자 필터, 장르 설정, 타겟 설정, 대화 형태, 해시태그, 댓글 기능
  visibility: 'private',
  userFilter: 'initial',
  genre: 'romance',
  target: 'all',
  conversationType: '1to1',
  hashtags: [],
  commentsEnabled: true,

  // 공통
  isDirty: false,
  currentStep: 1,
  creationCompleted: false,

  // Step 1
  setName: name => set({ name, isDirty: true }),
  setOneliner: oneliner => set({ oneliner, isDirty: true }),
  setProfileImage: image => set({ profileImage: image, isDirty: true }),
  setMbti: mbti => set({ mbti, isDirty: true }),

  // Step 2
  setTitle: title => set({ title, isDirty: true }),
  setPromptDetail: text => set({ promptDetail: text, isDirty: true }),
  setExampleDialogs: dialogs => set({ exampleDialogs: dialogs, isDirty: true }),
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
  setScenarioSuggestions: suggestions => set({ scenarioSuggestions: suggestions, isDirty: true }),
  setScenarioSituation: (situation: string) => set({ scenarioSituation: situation }),
  updateScenarioSuggestion: (index: number, text: string) =>
    set(state => {
      const updated = [...state.scenarioSuggestions];
      updated[index] = text;
      return { scenarioSuggestions: updated };
    }),

  // Step4
  setVisibility: (visibility: 'private' | 'public' | 'link') => set({ visibility, isDirty: true }),
  setUserFilter: (filter: 'initial' | 'fixed') => set({ userFilter: filter, isDirty: true }),
  setGenre: (genre: 'romance' | 'fantasy' | 'sci-fi' | 'daily' | 'historical' | 'other') =>
    set({ genre, isDirty: true }),
  setTarget: (target: 'male' | 'female' | 'all') => set({ target, isDirty: true }),
  setConversationType: (type: '1to1' | 'simulation') =>
    set({ conversationType: type, isDirty: true }),
  setHashtags: (hashtags: string[]) => set({ hashtags, isDirty: true }),
  addHashtag: (hashtag: string) =>
    set(state => {
      if (state.hashtags.length >= 10) {
        return {};
      }
      const newHashtags = [...new Set([...state.hashtags, hashtag])];
      return { hashtags: newHashtags, isDirty: true };
    }),

  removeHashtag: (hashtag: string) =>
    set(state => {
      const updatedHashtags = state.hashtags.filter(h => h !== hashtag);
      return { hashtags: updatedHashtags, isDirty: true };
    }),
  setCommentsEnabled: (enabled: boolean) => set({ commentsEnabled: enabled, isDirty: true }),

  // 공통 actions
  setDirty: () => set({ isDirty: true }),
  resetDirty: () => set({ isDirty: false }),
  setCurrentStep: step => set({ currentStep: step }),
  setCreationCompleted: status => set({ creationCompleted: status }),

  resetAllData: () =>
    set({
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

      // Step 4
      visibility: 'private',
      userFilter: 'initial',
      genre: 'romance',
      target: 'all',
      conversationType: '1to1',
      hashtags: [],
      commentsEnabled: true,

      // 공통
      isDirty: false,
      currentStep: 1,
      creationCompleted: false,
    }),
}));
