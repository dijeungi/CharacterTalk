/**
 * @file      frontend/app/(routes)/(private)/characters/new/_components/Drawer/HashtagDrawer.tsx
 * @desc      Component: 해시태그 입력 및 표시를 위한 하단 Drawer UI + 자동 포커싱 및 조합 입력 대응
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import { useState, ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import styles from '@/app/(routes)/(private)/characters/new/_components/Drawer/HashtagDrawer.module.css';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { HiSearch } from 'react-icons/hi';

export default function HashtagDrawer({
  open,
  onClose,
  onAddHashtag,
  existingHashtags,
  onRemoveHashtag,
}: HashtagDrawerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    setIsComposing(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHashtagInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      const trimmedInput = hashtagInput.trim();
      if (!trimmedInput) {
        setHashtagInput('');
        return;
      }

      const newHashtag = trimmedInput.startsWith('#') ? trimmedInput : `#${trimmedInput}`;

      if (newHashtag.length > 1) {
        onAddHashtag(newHashtag);
      }

      setHashtagInput('');
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            backgroundColor: '#ffffff',
            color: '#000000',
            paddingTop: '1rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingBottom: '2rem',
          },
        },
      }}
    >
      <div className={styles.drawerContent}>
        <div className={styles.drawerBar} />
        <div className={styles.titleWrapper}>
          <div className={styles.titleGroup}>
            <h2 className={styles.drawerTitle}>해시태그를 입력해주세요</h2>

            <p className={styles.drawerSubtitle}>최대 10개까지 추가할 수 있어요.</p>
          </div>
          <p className={styles.hashtagCounter}>{`${existingHashtags.length} / 10`}</p>
        </div>

        <div className={styles.hashtagInputWrapper}>
          {existingHashtags.length > 0 && (
            <div className={styles.hashtagDisplayArea}>
              {existingHashtags.map(tag => (
                <div key={tag} className={styles.hashtagItem}>
                  <span>{tag}</span>
                  <button
                    onClick={() => onRemoveHashtag(tag)}
                    className={styles.removeHashtagButton}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.inputArea}>
            <textarea
              ref={textareaRef}
              value={hashtagInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              className={styles.textarea}
              placeholder="검색해 보세요..."
              rows={1}
              maxLength={20}
            />
            <HiSearch size={20} />
          </div>
        </div>
      </div>
    </SwipeableDrawer>
  );
}
