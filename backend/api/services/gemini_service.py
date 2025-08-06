"""
@file         backend/api/services/gemini_service.py
@desc         Gemini API를 이용한 챗봇 응답 생성 서비스 파일
 
@summary      GeminiService 클래스 정의
@description  Google Gemini API를 사용하여 캐릭터 설정과 대화 기록을 기반으로 자연스러운 역할극 응답을 생성합니다.

@author       최준호
@update       2025.08.05
"""
import httpx
from django.conf import settings
from api.models import Character

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY가 설정되지 않았습니다.")
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"

    async def generate_response(self, character: Character, user_message: str, chat_history: list) -> str:
        system_prompt = self._create_system_prompt(character)
        
        history_for_api = []
        for msg in chat_history:
            role = 'user' if msg['sender'] == 'user' else 'model'
            history_for_api.append({'role': role, 'parts': [{'text': msg['message']}]})

        # 시스템 프롬프트는 대화 기록에 포함시키지 않고, 최종 요청에만 결합합니다.
        # 이렇게 하면 API가 시스템 지시사항을 더 명확하게 인식합니다.
        final_user_prompt = f"{system_prompt}\n\n---\n\n{user_message}"
        full_conversation = history_for_api + [{'role': 'user', 'parts': [{'text': final_user_prompt}]}]

        payload = {
            "contents": full_conversation,
            "generationConfig": {
                "temperature": 0.9,
                "topK": 1,
                "topP": 1,
                "maxOutputTokens": 2048,
            }
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.api_url, json=payload, timeout=60.0)
                response.raise_for_status()
                result = response.json()
                
                # API 응답 구조에 따라 안전하게 텍스트 추출
                if 'candidates' in result and result['candidates']:
                    content = result['candidates'][0].get('content', {})
                    if 'parts' in content and content['parts']:
                        return content['parts'][0].get('text', '')
                
                print(f"[!] Gemini API 응답 형식 오류: {result}")
                return "응답 형식이 올바르지 않아 답변을 생성할 수 없습니다."

            except httpx.HTTPStatusError as e:
                print(f"[!] Gemini API HTTP 오류: {e.response.status_code} - {e.response.text}")
                return "API 서버 오류로 답변을 생성할 수 없습니다."
            except Exception as e:
                print(f"[!] Gemini API 호출 중 알 수 없는 오류: {e}")
                return "죄송합니다. 지금은 답변을 생성할 수 없습니다."

    def _create_system_prompt(self, character: Character) -> str:
        dialogs = "\n".join([f"사용자: {d['user']}\n{character.name}: {d['ai']}" for d in character.example_dialogs]) if character.example_dialogs else "없음"
        
        prompt = f"""
당신은 지금부터 '{character.name}'이라는 이름의 캐릭터가 되어 사용자와 역할극을 진행해야 합니다. 아래 규칙을 반드시 따르세요.

### **규칙 (매우 중요)**
1.  **최우선 목표: 자연스러운 상호작용.** 당신의 가장 중요한 임무는 사용자와의 대화를 자연스럽고 재미있게 만드는 것입니다. 캐릭터 설정에 너무 얽매여 대화의 흐름을 깨서는 안 됩니다.
2.  **역할 몰입:** 당신은 AI가 아닌, '{character.name}'입니다. 어떤 상황에서도 AI임을 드러내지 마세요.
3.  **유연한 답변 길이:** 대화의 흐름에 맞춰 답변의 길이를 자연스럽게 조절하세요. 짧은 질문에는 간결하게, 사용자가 감정이나 상황을 길게 설명하면 그에 맞춰 풍부하게 응답하며 대화의 깊이를 맞추는 것이 중요합니다. 단, 어떤 경우에도 4문장을 넘지 않도록 하여 대화가 늘어지지 않게 주의하세요.
4.  **응답 중심의 대화:** 사용자의 말에 충실히 반응하고 답변하는 것에 집중하세요. **불필요한 꼬리물기식 질문은 자제하고,** 대화의 흐름상 꼭 필요할 때만 가끔 질문을 던져야 합니다. 사용자가 대화를 이끌어갈 수 있도록 여지를 주는 것이 중요합니다.
5.  **생각 및 행동 표현:** 캐릭터의 속마음, 행동, 상황 묘사는 반드시 별표(`*`)로 감싸서 표현하세요. (예: `*혼자 중얼거린다*`, `*창밖을 바라보며*`) 절대로 괄호(`()`)를 사용하지 마세요.

6.  **사용자 행동 인지:** 사용자 또한 별표(`*`)를 사용하여 행동이나 상황을 묘사할 수 있습니다. 이를 인지하고 자연스럽게 반응하여 역할극을 이어가세요.
7.  **설정은 연기 가이드:** 아래의 '캐릭터 설정'은 당신의 역할극을 위한 참고자료입니다. 이 설정을 바탕으로 하되, 사용자와의 상호작용을 더 중요하게 생각하세요. 예를 들어, 캐릭터가 특정 행동을 좋아한다고 해서 그 행동만 반복해서는 안 됩니다.

---

### **캐릭터 설정 (참고자료)**

# 1. 기본 정보
- **이름:** {character.name}
- **한 줄 소개:** {character.oneliner}
- **MBTI:** {character.mbti or '설정 안됨'}

# 2. 상세 페르소나
- **주제:** {character.title}
- **상세 설정:** {character.prompt_detail}
- **말투:** {character.speech_style}
- **행동 제약:** {character.behavior_constraint or '없음'}
- **대화 예시:**
{dialogs}

# 3. 대화 시작 시나리오
- **제목:** {character.scenario_title}
- **첫인사:** {character.scenario_greeting}
- **현재 상황:** {character.scenario_situation}
"""
        return prompt

gemini_service = GeminiService()