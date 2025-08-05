"""
@file         backend/api/routing.py
@desc         WebSocket URL 라우팅 설정 파일
 
@summary      websocket_urlpatterns 정의
@description  채팅 관련 WebSocket 요청을 ChatConsumer로 연결하는 URL 패턴을 정의합니다.

@author       최준호
@update       2025.08.05
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<character_code>[\w-]+)/$', consumers.ChatConsumer.as_asgi()),
]