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
  const socketRef = useRef<WebSocket | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = useRef(true);

  useEffect(() => {
    if (!characterCode) return;

    const ws_scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws_path = `${ws_scheme}://127.0.0.1:8000/ws/chat/${characterCode}/`;

    socketRef.current = new WebSocket(ws_path);

    socketRef.current.onopen = () => {
      setMessages(prev => [...prev, { sender: 'system', text: '채팅 서버에 연결되었습니다.' }]);
    };

    socketRef.current.onmessage = event => {
      const data = JSON.parse(event.data);
      const sender = data.sender === 'ai' ? 'ai' : 'user';

      if (sender === 'user') return;

      if (isFirstMessage.current) {
        setMessages(prev => [...prev, { sender: sender, text: data.message }]);
        isFirstMessage.current = false;
        return;
      }

      const messageLength = data.message.length;
      const typingSpeed = 100; // WPM
      const delay = Math.max(1500, (messageLength / ((typingSpeed * 5) / 60)) * 1000);

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: sender, text: data.message }]);
      }, delay);
    };

    socketRef.current.onclose = () => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { sender: 'system', text: '채팅 서버와 연결이 끊어졌습니다.' },
      ]);
    };

    socketRef.current.onerror = error => {
      setIsTyping(false);
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, { sender: 'system', text: '오류가 발생했습니다.' }]);
    };

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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageRow} ${
              msg.sender === 'user' ? styles.user : msg.sender === 'ai' ? styles.ai : styles.system
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
              {msg.sender === 'ai' && <span className={styles.senderName}>{character?.name}</span>}
              <div className={styles.messageBubble}>{msg.text}</div>
            </div>
          </div>
        ))}
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
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지 보내기"
        />
        <button type="submit">
          <FaArrowUp />
        </button>
      </form>
    </div>
  );
}
