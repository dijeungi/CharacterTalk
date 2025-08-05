"""
@file         backend/config/asgi.py
@desc         ASGI 서버 설정 파일
 
@summary      application 프로토콜 라우터 정의
@description  HTTP 및 WebSocket 프로토콜 요청을 처리하기 위한 ASGI 애플리케이션을 설정합니다. WebSocket 요청은 인증 미들웨어를 거쳐 라우팅됩니다.

@author       최준호
@update       2025.08.05
"""
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import api.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            api.routing.websocket_urlpatterns
        )
    ),
})
