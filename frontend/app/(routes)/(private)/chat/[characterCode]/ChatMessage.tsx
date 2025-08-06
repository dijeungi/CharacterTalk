/**
 * @file         frontend/app/(routes)/(private)/chat/[characterCode]/ChatMessage.tsx
 * @desc         Component: 채팅 메시지 버블 및 타이핑 효과
 *
 * @author       최준호
 * @update       2025.08.05
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Message } from './_types';
import styles from './page.module.css';

interface ChatMessageProps {
  msg: Message;
  characterName?: string;
  characterImageUrl?: string;
  isStreaming?: boolean; // 스트리밍 여부를 결정하는 prop
  onLongPressStart: (e: React.MouseEvent | React.TouchEvent, msg: Message) => void;
  onLongPressEnd: () => void;
  reactions: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  msg,
  characterName,
  characterImageUrl,
  isStreaming,
  onLongPressStart,
  onLongPressEnd,
  reactions,
}) => {
  // isStreaming이 true일 때만 빈 문자열로 시작, 아닐 경우 전체 텍스트로 시작
  const [displayedText, setDisplayedText] = useState(
    msg.sender === 'ai' && isStreaming ? '' : msg.text
  );

  useEffect(() => {
    // isStreaming이 true인 AI 메시지에만 타이핑 효과 적용
    if (msg.sender === 'ai' && isStreaming) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < msg.text.length) {
          setDisplayedText(prev => prev + msg.text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50); // 50ms 간격

      return () => clearInterval(typingInterval);
    }
  }, [msg.text, msg.sender, isStreaming]);

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`${styles.messageRow} ${
        msg.sender === 'user' ? styles.user : msg.sender === 'ai' ? styles.ai : styles.system
      }`}
      onMouseDown={e => onLongPressStart(e, msg)}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={e => onLongPressStart(e, msg)}
      onTouchEnd={onLongPressEnd}
    >
      {msg.sender === 'ai' && (
        <Image
          src={characterImageUrl || '/img/default-profile.png'}
          alt="Character Avatar"
          width={40}
          height={40}
          className={styles.avatar}
        />
      )}

      <div className={styles.messageContent}>
        {msg.sender === 'ai' && <span className={styles.senderName}>{characterName}</span>}
        <div className={styles.bubbleContainer}>
          <div className={styles.messageBubble}>
            {displayedText
              .split(/(\*.*?\*)/g)
              .filter(Boolean)
              .map((part, i) =>
                part.startsWith('*') && part.endsWith('*') ? (
                  <em
                    key={i}
                    className={msg.sender === 'user' ? styles.userActionText : styles.actionText}
                  >
                    {part.slice(1, -1)}
                  </em>
                ) : (
                  part
                )
              )}
          </div>
          <span className={styles.timestamp}>{formatTime(msg.created_at)}</span>
        </div>
        {reactions}
      </div>
    </div>
  );
};
