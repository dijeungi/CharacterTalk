"""
@file         backend/api/consumers.py
@desc         WebSocket 컨슈머 정의 파일
 
@summary      ChatConsumer 클래스 정의
@description  Django Channels를 사용하여 WebSocket 연결 및 실시간 채팅 메시지 처리를 담당합니다.

@author       최준호
@update       2025.08.05
"""
import json
import re
import asyncio
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from django.db.models import Count, F
from api.models import Character, ChatMessage, User, Reaction
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
            self.room_group_name = f'chat_{self.character_code}_{self.user.id}'
            self.chat_history = []

            self.character = await self.get_character(self.character_code)
            if not self.character:
                await self.close()
                return

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            history = await self.get_chat_history()

            if not history:
                initial_message = self.character.scenario_greeting
                new_greeting = await self.save_chat_message('ai', initial_message)
                self.chat_history.append({"sender": "ai", "message": initial_message})
                await self.send_message_to_client(new_greeting)
            else:
                for message in history:
                    self.chat_history.append({
                        "sender": message.sender_type,
                        "message": message.content
                    })
                    await self.send_message_to_client(message)
        except Exception as e:
            print(f"WebSocket 연결 오류: {e}")
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        
        # 1. 사용자 메시지 저장
        user_message = await self.save_chat_message('user', message_content)
        self.chat_history.append({"sender": "user", "message": message_content})

        # 2. 사용자 메시지를 클라이언트에게 즉시 전송
        await self.send_message_to_client(user_message)

        # 3. AI 응답 생성을 백그라운드 작업으로 시작
        asyncio.create_task(self.generate_and_send_ai_response(message_content))

    async def generate_and_send_ai_response(self, user_message_content):
        """AI 응답을 생성하고 그룹에 브로드캐스트합니다."""
        raw_ai_response = await self.generate_ai_response(user_message_content)
        ai_response_content = self.format_ai_response(raw_ai_response)
        
        ai_message = await self.save_chat_message('ai', ai_response_content)
        self.chat_history.append({"sender": "ai", "message": ai_response_content})

        # AI 메시지를 채널 그룹으로 전송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message_uuid': str(ai_message.uuid)
            }
        )

    async def chat_message(self, event):
        # 그룹에서 받은 메시지(AI 메시지)를 클라이언트에게 전송
        message_uuid = event['message_uuid']
        message = await self.get_chat_message(message_uuid)
        if message:
            await self.send_message_to_client(message)

    async def send_message_to_client(self, message_obj):
        reactions = await self.get_reactions_for_message(message_obj)
        await self.send(text_data=json.dumps({
            'uuid': str(message_obj.uuid),
            'sender': message_obj.sender_type,
            'text': message_obj.content,
            'created_at': message_obj.created_at.isoformat(),
            'reactions': reactions
        }))

    # Helper and DB methods
    async def get_user_id_from_ticket(self, ticket):
        key = f"ws-ticket:{ticket}"
        user_id = redis_client.get(key)
        if user_id:
            redis_client.delete(key)
            return user_id
        return None

    def format_ai_response(self, text: str) -> str:
        # 행동 지시문 뒤에 점이 오는 경우(예: *웃는다.*) 일관성을 위해 점을 제거합니다.
        processed_text = re.sub(r'(\*.*?\*)\s*\.', r'\1', text.strip())
        # 행동 지시문을 기준으로 문장을 분리하되, 지시문은 유지합니다.
        parts = re.split(r'(\*.*?\*)', processed_text)
        # 각 부분을 정리하고 빈 문자열을 제거합니다.
        cleaned_parts = [p.strip() for p in parts if p.strip()]
        # 각 부분을 두 줄 띄어쓰기로 합쳐서 반환합니다.
        return '\n\n'.join(cleaned_parts)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_character(self, code):
        try:
            return Character.objects.get(code=code)
        except Character.DoesNotExist:
            return None

    @database_sync_to_async
    def generate_ai_response(self, user_message):
        recent_history = self.chat_history[-10:]
        return gemini_service.generate_response(self.character, user_message, recent_history)

    @database_sync_to_async
    def get_chat_history(self):
        return list(ChatMessage.objects.filter(
            user=self.user,
            character=self.character
        ).order_by('created_at').prefetch_related('reactions')[:50])

    @database_sync_to_async
    def get_chat_message(self, uuid):
        try:
            return ChatMessage.objects.get(uuid=uuid)
        except ChatMessage.DoesNotExist:
            return None

    @database_sync_to_async
    def save_chat_message(self, sender_type, content):
        return ChatMessage.objects.create(
            user=self.user,
            character=self.character,
            sender_type=sender_type,
            content=content
        )