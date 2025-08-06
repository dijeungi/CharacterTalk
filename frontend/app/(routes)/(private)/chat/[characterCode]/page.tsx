/**
 * @file         frontend/app/(routes)/(private)/chat/[characterCode]/page.tsx
 * @desc         Page: WebSocket 기반 실시간 캐릭터 채팅 페이지
 *
 * @author       최준호
 * @update       2025.08.05
 */

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import styles from '@/app/(routes)/(private)/chat/[characterCode]/page.module.css';

import { Message } from '@/app/(routes)/(private)/chat/[characterCode]/_types';
import { useCharacterDetailQuery } from '@/app/_apis/character/_hooks';
import { toggleReaction as toggleReactionAPI } from '@/app/_apis/character';
import { ChatMessage } from './ChatMessage';
import { ChatMessageSkeleton } from '@/app/_skeletons/Skeletons';

import { FaArrowUp } from 'react-icons/fa';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { LoadingIndicator } from '@/app/_components/chat/LoadingIndicator';

export default function ChatPage() {
  const params = useParams();
  const characterCode = Array.isArray(params.characterCode)
    ? params.characterCode[0]
    : params.characterCode;

  const { data: character } = useCharacterDetailQuery(characterCode!);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Emoji Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [currentTargetMessage, setCurrentTargetMessage] = useState<Message | null>(null);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!characterCode) return;

    const connectWebSocket = async () => {
      try {
        const response = await fetch('/api/auth/ws-ticket', { method: 'POST' });
        if (!response.ok) {
          throw new Error('웹소켓 연결 티켓을 발급받지 못했습니다.');
        }
        const { ticket } = await response.json();

        const ws_scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws_path = `${ws_scheme}://127.0.0.1:8000/ws/chat/${characterCode}/?ticket=${ticket}`;

        socketRef.current = new WebSocket(ws_path);

        socketRef.current.onopen = () => console.log('채팅 서버에 연결되었습니다.');

        socketRef.current.onmessage = event => {
          if (isLoading) setIsLoading(false);
          const data = JSON.parse(event.data);

          // AI로부터 메시지를 받았을 때만 "입력 중" 상태를 해제합니다.
          if (data.sender === 'ai') {
            setIsAiTyping(false);
          }

          const { uuid, sender, text, created_at, reactions } = data;

          setMessages(prev => {
            if (prev.some(msg => msg.uuid === uuid)) {
              return prev;
            }
            return [...prev, { uuid, sender, text, created_at, reactions }];
          });
        };

        socketRef.current.onclose = () => {
          if (!messages.some(m => m.sender === 'system' && m.text.includes('연결이 끊어졌습니다')))
            setMessages(prev => [
              ...prev,
              {
                sender: 'system',
                text: '채팅 서버와 연결이 끊어졌습니다.',
                created_at: '',
                uuid: '',
              },
            ]);
        };

        socketRef.current.onerror = error => {
          setIsLoading(false);
          setIsAiTyping(false);
          console.error('WebSocket error:', error);
          setMessages(prev => [
            ...prev,
            { sender: 'system', text: '오류가 발생했습니다.', created_at: '', uuid: '' },
          ]);
        };
      } catch (error) {
        console.error('웹소켓 연결 실패:', error);
        setIsLoading(false);
        setMessages(prev => [
          ...prev,
          { sender: 'system', text: '채팅 서버에 연결할 수 없습니다.', created_at: '', uuid: '' },
        ]);
      }
    };

    connectWebSocket();

    return () => socketRef.current?.close();
  }, [characterCode]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      const messagePayload = { message: input };
      socketRef.current.send(JSON.stringify(messagePayload));
      setInput('');
      setIsAiTyping(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleLongPressStart = (e: React.MouseEvent | React.TouchEvent, msg: Message) => {
    const target = e.currentTarget as HTMLElement;
    longPressTimer.current = setTimeout(() => {
      const rect = target.getBoundingClientRect();
      setPickerPosition({ x: rect.left, y: rect.top - 250 });
      setCurrentTargetMessage(msg);
      setPickerOpen(true);
    }, 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleReaction = async (message: Message, emoji: string) => {
    const messageIndex = messages.findIndex(m => m.uuid === message.uuid);
    if (messageIndex === -1) return;

    const originalMessages = [...messages];
    if (!message.uuid) {
      console.error('Message has no UUID, cannot add reaction.');
      return;
    }

    const updatedMessages = JSON.parse(JSON.stringify(messages));
    const reactionUsers = updatedMessages[messageIndex].reactions?.[emoji] || [];
    const currentUser = 'currentUser';
    const userIndex = reactionUsers.indexOf(currentUser);

    if (userIndex > -1) {
      reactionUsers.splice(userIndex, 1);
      if (reactionUsers.length === 0) {
        delete updatedMessages[messageIndex].reactions[emoji];
      } else {
        updatedMessages[messageIndex].reactions[emoji] = reactionUsers;
      }
    } else {
      if (!updatedMessages[messageIndex].reactions) {
        updatedMessages[messageIndex].reactions = {};
      }
      updatedMessages[messageIndex].reactions[emoji] = [...reactionUsers, currentUser];
    }
    setMessages(updatedMessages);

    try {
      await toggleReactionAPI(message.uuid, emoji);
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
      setMessages(originalMessages); // Revert on error
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    if (!currentTargetMessage) return;
    handleReaction(currentTargetMessage, emojiData.emoji);
    setPickerOpen(false);
    setCurrentTargetMessage(null);
  };

  return (
    <div className={styles.chatContainer}>
      {pickerOpen && (
        <div
          style={{
            position: 'fixed',
            top: pickerPosition.y,
            left: pickerPosition.x,
            zIndex: 1000,
          }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <div className={styles.messageList} ref={messageListRef}>
        {isLoading ? (
          <ChatMessageSkeleton />
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.uuid || index}
                msg={msg}
                characterName={character?.name}
                characterImageUrl={character?.profile_image_url}
                isStreaming={msg.sender === 'ai' && index === messages.length - 1 && !isLoading}
                onLongPressStart={(e, m) => handleLongPressStart(e, m)}
                onLongPressEnd={handleLongPressEnd}
                reactions={
                  msg.reactions &&
                  Object.keys(msg.reactions).length > 0 && (
                    <div className={styles.reactionsContainer}>
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <div
                          key={emoji}
                          className={styles.reaction}
                          onClick={() => handleReaction(msg, emoji)}
                        >
                          {emoji} {users.length}
                        </div>
                      ))}
                    </div>
                  )
                }
              />
            ))}
            {isAiTyping && <LoadingIndicator />}
          </>
        )}
      </div>
      <form className={styles.inputForm} onSubmit={handleSendMessage}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지 보내기"
          rows={1}
          ref={textareaRef}
        />
        <button type="submit" disabled={!input.trim()}>
          <FaArrowUp />
        </button>
      </form>
    </div>
  );
}
