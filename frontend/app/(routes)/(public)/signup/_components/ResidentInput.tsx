/**
 * @file         frontend/app/(routes)/(public)/signup/_components/ResidentInput.tsx
 * @desc         Component: 회원가입 폼 - 주민번호 입력 필드
 *
 * @author       최준호
 * @update       2025.07.27
 */

'use client';
import { useRef } from 'react';

// store
import { useSignupStore } from '@/app/_store/signup/index';

// css
import styles from '../page.module.css';

// types
import { BaseInputProps } from '../_types';

export default function ResidentInput({ editable = true }: BaseInputProps) {
  // store
  const residentFront = useSignupStore(state => state.residentFront);
  const residentBack = useSignupStore(state => state.residentBack);
  const setFormField = useSignupStore(state => state.setFormField);

  // Ref
  const backRef = useRef<HTMLInputElement>(null);

  // 주민번호 앞자리 6글자만 + handleBackChange으로 포커스 이동 + store 저장 함수
  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormField('residentFront', raw);
    if (raw.length === 6) backRef.current?.focus();
  };

  // 주민번호 뒷자리 1글자 + store 저장 함수
  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    setFormField('residentBack', value);
  };

  return (
    <div className={styles.inputGroup}>
      <label className={styles.clickLabel}>주민등록번호</label>
      <div className={styles.residentWrapper}>
        <input
          className={styles.residentInput}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={residentFront}
          onChange={editable ? handleFrontChange : undefined}
          placeholder="앞 6자리"
          maxLength={6}
          required
          readOnly={!editable}
          autoFocus={editable}
        />
        <span className={styles.hyphen}>-</span>
        <div className={styles.backWrapper}>
          <input
            className={styles.residentBackInput}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={residentBack}
            onChange={editable ? handleBackChange : undefined}
            maxLength={1}
            required
            readOnly={!editable}
            ref={backRef}
          />
          <div className={styles.masking}>
            <div className={styles.dotWrapper}>
              {'●●●●●●'.split('').map((char, i) => (
                <span key={i} className={styles.dot}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
