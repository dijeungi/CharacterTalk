import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("--- [WebSocket] connect() 함수 시작 ---")
        self.character_code = self.scope['url_route']['kwargs']['character_code']
        print(f"캐릭터 코드: {self.character_code}")

        self.room_group_name = f'chat_{self.character_code}'
        print(f"채팅방 그룹 이름: {self.room_group_name}")

        try:
            # 채널 그룹에 참여
            print("채널 그룹에 참여를 시도합니다...")
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            print("채널 그룹 참여 성공.")
        except Exception as e:
            print(f"!!! 채널 그룹 참여 중 에러 발생: {e} !!!")
            # 에러 발생 시 연결을 닫음
            await self.close()
            return

        await self.accept()
        print("--- [WebSocket] 연결이 성공적으로 수락되었습니다. ---")

    async def disconnect(self, close_code):
        print(f"--- [WebSocket] disconnect() 함수 호출됨 (종료 코드: {close_code}) ---")
        # 채널 그룹에서 나감
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print("채널 그룹에서 나갔습니다.")

    # 웹소켓으로부터 메시지 수신
    async def receive(self, text_data):
        print(f"수신 메시지: {text_data}")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # 채팅방 그룹으로 메시지 전송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # 채팅방 그룹으로부터 메시지 수신
    async def chat_message(self, event):
        message = event['message']
        print(f"그룹에서 받은 메시지: {message}")

        # 웹소켓으로 메시지 전송
        await self.send(text_data=json.dumps({
            'message': message
        }))
