import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Character
from api.services.gemini_service import gemini_service

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.character_code = self.scope['url_route']['kwargs']['character_code']
        self.room_group_name = f'chat_{self.character_code}'
        self.chat_history = []

        self.character = await self.get_character(self.character_code)

        if not self.character:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # 첫 접속 시 환영 메시지 전송
        initial_message = self.character.scenario_greeting
        self.chat_history.append({"sender": "ai", "message": initial_message})
        await self.send(text_data=json.dumps({
            'message': initial_message,
            'sender': 'ai'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        # 사용자 메시지 기록
        self.chat_history.append({"sender": "user", "message": message})

        # AI 응답 생성
        ai_response = await self.generate_ai_response(message)
        
        # AI 메시지 기록
        self.chat_history.append({"sender": "ai", "message": ai_response})

        # AI 응답을 보낸 클라이언트에게만 직접 전송
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
