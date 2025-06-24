/**
 * @types        CharacterStepState 1 ~ 3
 * @file         types/characters/step1~3.d.ts
 * @desc         캐릭터 생성 1 ~ 3단계까지 사용되는 상태 및 액션 타입 정의
 *
 * @state
 *  - name: 캐릭터 이름
 *  - oneliner: 한 줄 소개 문구
 *  - selectedVoice: 선택된 음성 ID
 *  - profileImage: 프로필 이미지 (파일 또는 URL)
 *  - isDirty: 값 변경 여부를 나타내는 플래그
 *
 * @actions
 *  - setName: name 상태 변경
 *  - setOneliner: oneliner 상태 변경
 *  - setSelectedVoice: selectedVoice 상태 변경
 *  - setProfileImage: profileImage 상태 변경
 *  - setDirty: isDirty true로 설정
 *  - resetDirty: isDirty false로 초기화
 *
 * @usage        frontend 캐릭터 생성 페이지 (step1) 입력 상태 관리에 사용
 * @dependencies 없음
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.23
 */

export interface CharacterStep1State {
  name: string;
  oneliner: string;
  selectedVoice: string;
  profileImage: File | Blob | string | null;
  isDirty: boolean;
}

export interface CharacterStep1Actions {
  setName: (name: string) => void;
  setOneliner: (oneliner: string) => void;
  setSelectedVoice: (voice: string) => void;
  setProfileImage: (image: File | string | null) => void;
  setDirty: () => void;
  resetDirty: () => void;
}

export type CharacterStep1Store = CharacterStep1State & CharacterStep1Actions;
