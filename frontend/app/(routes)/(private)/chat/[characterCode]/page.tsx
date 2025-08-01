'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { IoArrowForwardCircleOutline } from 'react-icons/io5';

interface Message {
  user: string;
  text: string;
}

export default function ChatPage() {
  const params = useParams();
  const characterCode = Array.isArray(params.characterCode)
    ? params.characterCode[0]
    : params.characterCode;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!characterCode) return;

    const ws_scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws_path = `${ws_scheme}://127.0.0.1:8000/ws/chat/${characterCode}/`;

    socketRef.current = new WebSocket(ws_path);

    socketRef.current.onopen = () => {
      setMessages(prev => [...prev, { user: 'System', text: '채팅 서버에 연결되었습니다.' }]);
    };

    socketRef.current.onmessage = event => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, { user: 'Character', text: data.message }]);
    };

    socketRef.current.onclose = () => {
      setMessages(prev => [...prev, { user: 'System', text: '채팅 서버와 연결이 끊어졌습니다.' }]);
    };

    socketRef.current.onerror = error => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, { user: 'System', text: '오류가 발생했습니다.' }]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [characterCode]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      const message = { message: input };
      socketRef.current.send(JSON.stringify(message));
      setMessages(prev => [...prev, { user: 'You', text: input }]);
      setInput('');
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.user.toLowerCase()]}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          onBlur={handleInputBlur}
          placeholder="메시지 보내기"
        />
        <button onClick={sendMessage}>
          <IoArrowForwardCircleOutline />
        </button>
      </div>
    </div>
  );
}
