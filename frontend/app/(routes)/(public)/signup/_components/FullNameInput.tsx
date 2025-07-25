/**
 * @route        components
 * @file         frontend/app/(routes)/(public)/signup/_components/FullNameInput.tsx
 * @component    FullNameInput
 * @desc         이름 입력 필드 컴포넌트 (회원가입 단계에서 사용)
 *
 * @layout       Signup Layout
 * @access       public
 * @props        editable?: boolean - 입력 가능 여부 제어
 *
 * @features
 *  - Zustand 상태관리와 연동된 이름 입력
 *  - readOnly, autoFocus 제어 가능
 *
 * @dependencies
 *  - Zustand (useSignupStore)
 *  - CSS Module (page.module.css)
 *
 * @todo         상태 검증 및 에러 메시지 기능 추가 고려
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

'use client';

// css
import styles from '../page.module.css';

// store
import { useSignupStore } from '@/app/_store/signup';

// types
import { BaseInputProps } from '../_types';

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
