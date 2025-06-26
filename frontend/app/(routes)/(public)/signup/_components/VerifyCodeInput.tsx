/**
 * @route        components
 * @file         frontend/app/(routes)/(public)/signup/_components/VerifyCodeInput.tsx
 * @component    VerifyCodeInput
 * @desc         휴대폰 인증번호 입력 및 확인 처리 컴포넌트
 *
 * @layout       Signup Layout
 * @access       public
 * @props        onConfirm(code: string): void (인증 확인 콜백 함수)
 *
 * @features
 *  - 6자리 숫자 입력 제한
 *  - 입력 완료 시 버튼 활성화
 *
 * @dependencies
 *  - @/app/types/signup
 *
 * @todo         유효성 검사 결과 메시지 노출 추가
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
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
