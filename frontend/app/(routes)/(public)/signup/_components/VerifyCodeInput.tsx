/**
 * @file         frontend/app/(routes)/(public)/signup/_components/VerifyCodeInput.tsx
 * @desc         Component: 회원가입 폼 - 휴대폰 인증번호 입력 필드
 *
 * @author       최준호
 * @update       2025.07.27
 */

'use client';
import { useState } from 'react';

// css
import styles from '../page.module.css';

// types
import { VerifyCodeInputProps } from '../_types';

export default function VerifyCodeInput({ onConfirm }: VerifyCodeInputProps) {
  const [code, setCode] = useState('');

  // 인증번호 6글자 인식
  const handleConfirm = () => {
    if (code.length === 6) onConfirm(code);
  };

  return (
    <>
      <div className={styles.inputGroup}>
        <label className={styles.clickLabel}>인증번호</label>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="인증번호 6자리"
          maxLength={6}
          autoFocus
        />
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={handleConfirm} disabled={code.length !== 6}>
          인증 확인
        </button>
      </div>
    </>
  );
}
