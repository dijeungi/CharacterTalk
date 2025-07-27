/**
 * @file         frontend/app/(routes)/(public)/signup/_components/FullNameInput.tsx
 * @desc         Component: 회원가입 폼 - 이름 입력 필드
 *
 * @author       최준호
 * @update       2025.07.27
 */

'use client';

// css
import styles from '../page.module.css';

// store
import { useSignupStore } from '@/app/_store/signup';

// types
import { BaseInputProps } from '@/app/(routes)/(public)/signup/_types';

export default function FullNameInput({ editable = true }: BaseInputProps) {
  // store
  const name = useSignupStore(state => state.name);
  const setFormField = useSignupStore(state => state.setFormField);

  return (
    <div className={styles.inputGroup}>
      <label className={styles.clickLabel}>이름</label>
      <input
        className={styles.input}
        type="text"
        name="name"
        value={name}
        onChange={e => setFormField('name', e.target.value)}
        placeholder="이름을 입력해 주세요"
        required
        readOnly={!editable}
        autoFocus={editable}
      />
    </div>
  );
}
