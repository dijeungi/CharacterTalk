/**
 * @file      frontend/app/(routes)/(private)/characters/[code]/_types/index.d.ts
 * @desc      Type: 캐릭터 전체 데이터 구조를 나타내는 인터페이스 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export interface Character {
  id: number;
  code: string;
  creator_name: string;
  name: string;
  profile_image_url: string | null;
  oneliner: string;
  mbti: string | null;
  title: string;
  prompt_detail: string;
  speech_style: string;
  behavior_constraint: string | null;
  example_dialogs: { user: string; character: string }[] | null;
  scenario_title: string;
  scenario_greeting: string;
  scenario_situation: string;
  scenario_suggestions: string[] | null;
  genre: string;
  target: string;
  conversation_type: string;
  hashtags: string[] | null;
  created_at: string;
}
