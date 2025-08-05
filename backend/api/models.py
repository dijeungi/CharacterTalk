"""
@file         backend/api/models.py
@desc         데이터베이스 모델 정의 파일
 
@summary      User, Character, ChatMessage 모델 정의
@description  Django ORM을 사용하여 애플리케이션의 데이터베이스 테이블 구조를 정의합니다.

@author       최준호
@update       2025.08.05
"""

 
from django.db import models
import uuid

class User(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    oauth_provider = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20, unique=True)
    birth_date = models.DateField()
    gender = models.CharField(max_length=1)
    is_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=10, default='user')
    refresh_token = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'users'

class Character(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    profile_image_url = models.CharField(max_length=255, null=True, blank=True)
    oneliner = models.CharField(max_length=300)
    mbti = models.CharField(max_length=4, null=True, blank=True)
    title = models.CharField(max_length=50)
    prompt_detail = models.TextField()
    speech_style = models.CharField(max_length=50)
    behavior_constraint = models.TextField(null=True, blank=True)
    example_dialogs = models.JSONField(null=True, blank=True)
    scenario_title = models.CharField(max_length=12)
    scenario_greeting = models.TextField()
    scenario_situation = models.TextField()
    scenario_suggestions = models.JSONField(null=True, blank=True)
    genre = models.CharField(max_length=50)
    target = models.CharField(max_length=50)
    conversation_type = models.CharField(max_length=50)
    user_filter = models.CharField(max_length=50, default='initial')
    visibility = models.CharField(max_length=20, default='private')
    comments_enabled = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'characters'

class ChatMessage(models.Model):
    id = models.AutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    sender_type = models.CharField(max_length=10) # 'user' or 'ai'
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']