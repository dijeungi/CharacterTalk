//

'use clint';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// css
import styles from './page.module.css';

// store
import { useCharacterCreationStore } from '@/app/store/characterCreate';

// 성격 키워드
const PERSONALITY_KEYWORDS = [
  '#다정한',
  '#냉소적인',
  '#활발한',
  '#수줍은',
  '#어른스러운',
  '#유머러스한',
  '#진지한',
  '#츤데레',
  '#괴짜',
  '#용감한',
];

export default function Step1_Profile() {
  const router = useRouter();
  const {
    step2,
    isDirty,
    togglePersonalityKeyword,
    setSpeechLevel,
    setCatchphrase,
    setCoreValue,
    setDirty,
    resetDirty,
  } = useCharacterCreationStore();

  // step2 객체
  const { personalityKeywords, speechLevel, catchphrase, coreValue } = step2;

  // isDirty 상태 관리
  useEffect(() => {
    if (personalityKeywords.length > 0 || speechLevel || catchphrase || coreValue) {
      setDirty();
    } else {
      resetDirty();
    }
  }, [personalityKeywords, speechLevel, catchphrase, coreValue, setDirty, resetDirty]);

  // 폼 유효성 검사
  const isFormValid = useMemo(
    () => personalityKeywords.length > 0 && speechLevel && coreValue.trim() !== '',
    [personalityKeywords, speechLevel, coreValue]
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleNextStep = () => {
    router.push('/characters/new/background');
  };

  return (
    <section className={styles.container}>
      <div className={styles.formContent}>
        {/* 성격 키워드 선택 */}
        <div className={styles.field}>
          <label className={styles.label}>
            성격 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>캐릭터를 가장 잘 나타내는 키워드를 1~5개 선택해 주세요.</p>
          <div className={styles.keywordGrid}>
            {PERSONALITY_KEYWORDS.map(keyword => (
              <button
                key={keyword}
                type="button"
                className={`${styles.keywordButton} ${
                  personalityKeywords.includes(keyword) ? styles.selected : ''
                }`}
                onClick={() => {
                  if (personalityKeywords.length < 5 || personalityKeywords.includes(keyword)) {
                    togglePersonalityKeyword(keyword);
                  } else {
                    alert('성격 키워드는 최대 5개까지 선택할 수 있습니다.');
                  }
                }}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* 말투 설정 */}
        <div className={styles.field}>
          <label className={styles.label}>
            말투 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>캐릭터가 주로 사용할 말투를 정해주세요.</p>
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={`${styles.button} ${speechLevel === 'formal' ? styles.selected : ''}`}
              onClick={() => setSpeechLevel('formal')}
            >
              존댓말
            </button>
            <button
              type="button"
              className={`${styles.button} ${speechLevel === 'informal' ? styles.selected : ''}`}
              onClick={() => setSpeechLevel('informal')}
            >
              반말
            </button>
          </div>
        </div>

        {/* 말버릇 입력 */}
        <div className={styles.field}>
          <label className={styles.label}>말버릇</label>
          <p className={styles.caption}>캐릭터의 개성을 살릴 수 있는 말버릇을 입력해 보세요.</p>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={catchphrase}
              maxLength={15}
              className={styles.input}
              onChange={e => setCatchphrase(e.target.value)}
              placeholder="예: ~랄까?, 훗, 어쩔 수 없지."
            />
            <div className={styles.charCount}>{catchphrase.length} / 15</div>
          </div>
        </div>

        {/* 핵심 가치관 입력 */}
        <div className={styles.field}>
          <label className={styles.label}>
            핵심 가치관 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            캐릭터가 가장 중요하게 생각하는 목표나 신념을 알려주세요.
          </p>
          <div className={styles.textareaWrapper}>
            <textarea
              value={coreValue}
              maxLength={100}
              className={styles.textarea}
              onChange={e => setCoreValue(e.target.value)}
              placeholder="예: 세상의 모든 고양이를 행복하게 만드는 것."
              rows={2}
            />
            <div className={styles.textareaCharCount}>{coreValue.length} / 100</div>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className={styles.fixedBottom}>
          <button className={styles.Button} disabled={!isFormValid} onClick={handleNextStep}>
            다음 단계
          </button>
        </div>
      </div>
    </section>
  );
}
