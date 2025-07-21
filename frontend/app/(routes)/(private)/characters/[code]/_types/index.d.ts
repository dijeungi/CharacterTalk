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
