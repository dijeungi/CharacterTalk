/**
 * @route        components
 * @file         frontend/app/(routes)/(public)/signup/_components/PhoneInput.tsx
 * @component    PhoneInput
 * @desc         회원가입 단계에서 휴대폰 번호 입력받는 인풋 컴포넌트
 *
 * @layout       사용 안 함
 * @access       public
 * @props        onChangeOnly?: boolean (입력 제한 여부)
 *
 * @features
 *  - 휴대폰 번호 자동 포맷팅
 *  - Zustand 상태 반영
 *
 * @dependencies
 *  - @/app/store/signupStore
 *  - @/app/_utils/formatters
 *  - @/app/types/signup
 *
 * @todo         추후 국가번호 입력 기능 추가
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

'use client';

// css
import styles from '../page.module.css';

// store
import { useSignupStore } from '@/app/store/auth';

// utils
import { formatPhone } from '@/app/_utils/formatters';

// types
import { PhoneInputProps } from '@/app/types/signup';

export default function PhoneInput({ onChangeOnly = false }: PhoneInputProps) {
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
