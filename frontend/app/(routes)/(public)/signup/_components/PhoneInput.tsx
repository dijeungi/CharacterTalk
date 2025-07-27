/**
 * @file         frontend/app/(routes)/(public)/signup/_components/PhoneInput.tsx
 * @desc         Component: 회원가입 폼 - 휴대폰 입력 필드
 *
 * @author       최준호
 * @update       2025.07.27
 */

'use client';

// css
import styles from '../page.module.css';

// store
import { useSignupStore } from '@/app/_store/signup/index';

// utils
import { formatPhone } from '@/app/_utils/formatters';

// types
import { BaseInputProps } from '../_types';

export default function PhoneInput({ onChangeOnly = false }: BaseInputProps) {
  // store
  const number = useSignupStore(state => state.number);
  const setFormField = useSignupStore(state => state.setFormField);

  return (
    <div className={styles.inputGroup}>
      <label className={styles.clickLabel}>휴대폰 번호</label>
      <input
        className={styles.input}
        type="tel"
        name="number"
        value={number}
        onChange={e => setFormField('number', formatPhone(e.target.value))}
        placeholder="예: 010-1234-5678"
        required
        readOnly={onChangeOnly}
        autoFocus={!onChangeOnly}
      />
    </div>
  );
}
