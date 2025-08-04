# backend/api/services/gemini_service.py
import os
import google.generativeai as genai
from django.conf import settings
from api.models import Character

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY가 설정되지 않았습니다.")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_response(self, character: Character, user_message: str, chat_history: list) -> str:
        system_prompt = self._create_system_prompt(character)
        
        # 대화 기록을 Gemini API 형식에 맞게 변환
        history_for_api = []
        for msg in chat_history:
            role = 'user' if msg['sender'] == 'user' else 'model'
            history_for_api.append({'role': role, 'parts': [{'text': msg['message']}]})

        try:
            chat_session = self.model.start_chat(history=history_for_api)
            
            # 시스템 프롬프트를 첫 메시지로 추가 (API 정책에 따라)
            full_prompt = f"{system_prompt}\n\n---\n\n{user_message}"
            
            response = chat_session.send_message(full_prompt)
            return response.text
        except Exception as e:
            print(f"[!] Gemini API 오류: {e}")
            return "죄송합니다. 지금은 답변을 생성할 수 없습니다."

    def _create_system_prompt(self, character: Character) -> str:
        dialogs = "\n".join([f"사용자: {d['user']}\n{character.name}: {d['ai']}" for d in character.example_dialogs]) if character.example_dialogs else "없음"
        
        prompt = f"""
당신은 '{character.name}'이라는 이름의 캐릭터입니다. 다음 설정을 완벽하게 숙지하고 사용자와 대화하세요.

# 캐릭터 기본 설정
- 이름: {character.name}
- 한 줄 소개: {character.oneliner}
- MBTI: {character.mbti or '설정 안됨'}

# 캐릭터 페르소나
- 주제: {character.title}
- 상세 설정: {character.prompt_detail}
- 말투: {character.speech_style}
- 행동 제약: {character.behavior_constraint or '없음'}
- 대화 예시:
{dialogs}

# 대화 시작 시나리오
- 제목: {character.scenario_title}
- 첫인사: {character.scenario_greeting}
- 현재 상황: {character.scenario_situation}

# 대화 규칙
- 당신의 역할에 완전히 몰입하여 '{character.name}'으로서만 대답해야 합니다.
- 답변은 1~3개의 문장으로 간결하게 유지하여 사용자가 대화에 집중할 수 있도록 하세요.
- 사용자의 말에 적절히 반응하고, 때로는 질문을 던지며 대화가 자연스럽게 이어지도록 유도하세요.

위 설정과 규칙을 반드시 지켜주세요.
"""
        return prompt

gemini_service = GeminiService()
