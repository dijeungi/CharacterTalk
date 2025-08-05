import json
import re
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Character, ChatMessage, User
from api.services.gemini_service import gemini_service
import redis

# Redis 클라이언트 설정
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            query_string = self.scope['query_string'].decode()
            params = parse_qs(query_string)
            ticket = params.get('ticket', [None])[0]

            if not ticket:
                await self.close(code=4001)
                return

            user_id = await self.get_user_id_from_ticket(ticket)
            if not user_id:
                await self.close(code=4001)
                return

            self.user = await self.get_user(user_id)
            if not self.user:
                await self.close(code=4001)
                return

            self.character_code = self.scope['url_route']['kwargs']['character_code']
            self.room_group_name = f'chat_{self.character_code}'
            self.chat_history = []

            self.character = await self.get_character(self.character_code)
            if not self.character:
                await self.close()
                return

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            await self.load_chat_history()

            if not self.chat_history:
                initial_message = self.character.scenario_greeting
                self.chat_history.append({"sender": "ai", "message": initial_message})
                await self.save_chat_message('ai', initial_message)
                await self.send(text_data=json.dumps({'message': initial_message, 'sender': 'ai'}))
            else:
                for record in self.chat_history:
                    await self.send(text_data=json.dumps({'message': record['message'], 'sender': record['sender']}))
        except Exception as e:
            print(f"WebSocket 연결 오류: {e}")
            await self.close()

    async def get_user_id_from_ticket(self, ticket):
        key = f"ws-ticket:{ticket}"
        user_id = redis_client.get(key)
        if user_id:
            redis_client.delete(key)
            return user_id
        return None

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    def format_ai_response(self, text: str) -> str:
        # AI 응답의 앞뒤 공백 제거
        processed_text = text.strip()
        # `*...*` 패턴을 기준으로 텍스트를 분리 (패턴도 유지)
        parts = re.split(r'(\*.*?\*)', processed_text)
        # 각 부분을 정리하고 빈 문자열 제거
        cleaned_parts = [p.strip() for p in parts if p.strip()]
        # 정리된 부분들을 두 개의 줄바꿈 문자로 연결하여 최종 결과 생성
        return '\n\n'.join(cleaned_parts)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        # 사용자 메시지 기록 및 저장
        self.chat_history.append({"sender": "user", "message": message})
        await self.save_chat_message('user', message)

        # AI 응답 생성
        raw_ai_response = await self.generate_ai_response(message)
        ai_response = self.format_ai_response(raw_ai_response)
        
        # AI 메시지 기록 및 저장
        self.chat_history.append({"sender": "ai", "message": ai_response})
        await self.save_chat_message('ai', ai_response)

        # AI 응답을 클라이언트에게 전송
        await self.send(text_data=json.dumps({
            'message': ai_response,
            'sender': 'ai'
        }))

    @database_sync_to_async
    def get_character(self, code):
        try:
            return Character.objects.get(code=code)
        except Character.DoesNotExist:
            return None

    @database_sync_to_async
    def generate_ai_response(self, user_message):
        # 마지막 10개 대화만 히스토리로 사용 (토큰 제한)
        recent_history = self.chat_history[-10:]
        return gemini_service.generate_response(self.character, user_message, recent_history)

    @database_sync_to_async
    def load_chat_history(self):
        messages = ChatMessage.objects.filter(
            user_id=self.user.id,
            character_id=self.character.id
        ).order_by('created_at').values('sender_type', 'content')[:50]
        
        for msg in messages:
            self.chat_history.append({
                "sender": msg['sender_type'],
                "message": msg['content']
            })

    @database_sync_to_async
    def save_chat_message(self, sender_type, content):
        ChatMessage.objects.create(
            user_id=self.user.id,
            character_id=self.character.id,
            sender_type=sender_type,
            content=content
        )
