/**
 * @route        components
 * @file         frontend/app/(routes)/(public)/signup/_components/ResidentInput.tsx
 * @component    ResidentInput
 * @desc         주민등록번호 입력을 처리하는 컴포넌트
 *
 * @layout       사용 안 함
 * @access       public
 * @props        editable?: boolean (입력 가능 여부 제어)
 *
 * @features
 *  - 앞자리 6자리 자동 포커스 전환
 *  - 뒷자리 마스킹 처리
 *  - Zustand 상태 반영
 *
 * @dependencies
 *  - @/app/store/signupStore
 *  - @/app/types/signup
 *  - @/app/_utils/ (없다면 masking 관련 유틸 고려)
 *
 * @todo         뒤 6자리 보안 처리 강화
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

'use client';
import { useRef } from 'react';

// store
import { useSignupStore } from '@/app/_store/signup/index';

// css
import styles from '../page.module.css';

// types
import { SignUpInputProps } from '../_types';

export default function ResidentInput({ editable = true }: SignUpInputProps) {
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
