/**
 * @file         frontend/app/(routes)/(private)/chat/[characterCode]/page.tsx
 * @desc         Page: WebSocket 기반 실시간 캐릭터 채팅 페이지
 *
 * @author       최준호
 * @update       2025.08.04
 */

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/(routes)/(private)/chat/[characterCode]/page.module.css';

import { Message } from '@/app/(routes)/(private)/chat/[characterCode]/_types';
import { useCharacterDetailQuery } from '@/app/_apis/character/_hooks';

import { FaArrowUp } from 'react-icons/fa';

export default function ChatPage() {
  const params = useParams();
  const characterCode = Array.isArray(params.characterCode)
    ? params.characterCode[0]
    : params.characterCode;

  const { data: character } = useCharacterDetailQuery(characterCode!);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const socketRef = useRef<WebSocket | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        // 1. 백엔드에 티켓 요청
        const response = await fetch('/api/auth/ws-ticket', { method: 'POST' });
        if (!response.ok) {
          throw new Error('웹소켓 연결 티켓을 발급받지 못했습니다.');
        }
        const { ticket } = await response.json();

        // 2. 티켓과 함께 웹소켓 연결
        const ws_scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws_path = `${ws_scheme}://127.0.0.1:8000/ws/chat/${characterCode}/?ticket=${ticket}`;

        socketRef.current = new WebSocket(ws_path);

        socketRef.current.onopen = () => {
          console.log('채팅 서버에 연결되었습니다.');
        };

        socketRef.current.onmessage = event => {
          if (isLoading) {
            setIsLoading(false);
          }
          const data = JSON.parse(event.data);
          const sender = data.sender;
          const text = data.message;

          // AI가 보낸 메시지만 화면에 추가하고, 사용자가 보낸 메시지는 무시 (에코 방지)
          if (sender === 'ai') {
            setMessages(prev => [...prev, { sender, text }]);
            setIsTyping(false);
          }
        };

        socketRef.current.onclose = () => {
          setIsTyping(false);
          if (!messages.some(m => m.sender === 'system' && m.text.includes('연결이 끊어졌습니다')))
            setMessages(prev => [
              ...prev,
              { sender: 'system', text: '채팅 서버와 연결이 끊어졌습니다.' },
            ]);
        };

        socketRef.current.onerror = error => {
          setIsLoading(false);
          setIsTyping(false);
          console.error('WebSocket error:', error);
          setMessages(prev => [...prev, { sender: 'system', text: '오류가 발생했습니다.' }]);
        };
      } catch (error) {
        console.error('웹소켓 연결 실패:', error);
        setIsLoading(false);
        setMessages(prev => [
          ...prev,
          { sender: 'system', text: '채팅 서버에 연결할 수 없습니다.' },
        ]);
      }
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, [characterCode]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      const messagePayload = { message: input };
      socketRef.current.send(JSON.stringify(messagePayload));
      // 사용자가 보낸 메시지를 화면에 즉시 표시
      setMessages(prev => [...prev, { sender: 'user', text: input }]);
      setInput('');
      setIsTyping(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList} ref={messageListRef}>
        {isLoading ? (
          <div className={styles.skeletonContainer}>
            <div className={`${styles.skeletonMessage} ${styles.ai}`}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonTextContainer}>
                <div className={styles.skeletonText} style={{ width: '60%' }} />
              </div>
            </div>
            <div className={`${styles.skeletonMessage} ${styles.user}`}>
              <div className={styles.skeletonTextContainer}>
                <div className={styles.skeletonText} style={{ width: '70%' }} />
              </div>
            </div>
            <div className={`${styles.skeletonMessage} ${styles.ai}`}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonTextContainer}>
                <div className={styles.skeletonText} style={{ width: '50%' }} />
                <div className={styles.skeletonText} style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.messageRow} ${
                msg.sender === 'user'
                  ? styles.user
                  : msg.sender === 'ai'
                  ? styles.ai
                  : styles.system
              }`}
            >
              {msg.sender === 'ai' && (
                <Image
                  src={character?.profile_image_url || '/img/default-profile.png'}
                  alt="Character Avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
              )}
              <div className={styles.messageContent}>
                {msg.sender === 'ai' && (
                  <span className={styles.senderName}>{character?.name}</span>
                )}
                <div className={styles.messageBubble}>
                  {msg.text
                    .split(/(\*.*?\*)/g)
                    .filter(Boolean)
                    .map((part, i) => {
                      if (part.startsWith('*') && part.endsWith('*')) {
                        return (
                          <em
                            key={i}
                            className={
                              msg.sender === 'user' ? styles.userActionText : styles.actionText
                            }
                          >
                            {part.slice(1, -1)}
                          </em>
                        );
                      }
                      return part;
                    })}
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.ai}`}>
            <Image
              src={character?.profile_image_url || '/img/default-profile.png'}
              alt="Character Avatar"
              width={40}
              height={40}
              className={styles.avatar}
            />
            <div className={styles.messageContent}>
              <span className={styles.senderName}>{character?.name}</span>
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            </div>
          </div>
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