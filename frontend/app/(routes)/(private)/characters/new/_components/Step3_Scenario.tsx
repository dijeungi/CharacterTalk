'use client';
import { useEffect, useState } from 'react';

// css
import styles from './page.module.css';

// store
import { useCharacterCreationStore } from '@/app/_store/characters';

export default function Step3_Scenario({ onPrev, onNext }: Step3Props) {
  const [title, setTitle] = useState('');
  const [greeting, setGreeting] = useState('');
  const [situation, setSituation] = useState('');
  const [suggestions, setSuggestions] = useState(['', '', '']);

  const isValid = title && greeting && situation;

  // store
  const setCurrentStep = useCharacterCreationStore(state => state.setCurrentStep);

  // progressBar 상태 업데이트
  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  return (
    <>
      <section className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.field}>
            <label className={styles.label}>
              시작 설정 제목 <span className={styles.required}>*</span>
            </label>
            <p className={styles.caption}>캐릭터 시나리오의 주제를 간단히 표현해 주세요.</p>
            <textarea
              className={styles.textarea}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 모험의 시작, 첫 출근날 등"
              rows={2}
            />
          </div>

          {/* 첫 인사말 */}
          <div className={styles.field}>
            <label className={styles.label}>
              첫 인사말 <span className={styles.required}>*</span>
            </label>
            <p className={styles.caption}>
              캐릭터가 사용자를 처음 만났을 때 하는 대사를 작성해주세요.
            </p>
            <textarea
              className={styles.textarea}
              value={greeting}
              onChange={e => setGreeting(e.target.value)}
              placeholder="예: 안녕! 오늘 하루는 어땠어?"
              rows={3}
            />
          </div>

          {/* 시작 상황 설명 */}
          <div className={styles.field}>
            <label className={styles.label}>
              시작 상황 설명 <span className={styles.required}>*</span>
            </label>
            <p className={styles.caption}>
              대화가 시작되는 배경이나 세계관, 캐릭터와 사용자의 관계를 구체적으로 설명해 주세요.
            </p>
            <textarea
              className={styles.textarea}
              value={situation}
              onChange={e => setSituation(e.target.value)}
              placeholder="예: 당신은 왕국을 지키는 기사, 나는 새로 부임한 왕이에요. 오늘은 첫 임무를 전달하는 날이에요."
              rows={4}
            />
          </div>

          {/* 추천 답변 꾸밈 */}
          <div className={styles.field}>
            <label className={styles.label}>추천 답변</label>
            <p className={styles.caption}>
              사용자가 쉽게 시작할 수 있도록 예시 답변을 작성해 주세요.
              <br />
              예시는 최대 3개까지 등록하실 수 있습니다.
            </p>
            {suggestions.map((s, i) => (
              <div key={i} className={styles.inputWrapper}>
                <input
                  className={styles.input}
                  value={s}
                  onChange={e => {
                    const copy = [...suggestions];
                    copy[i] = e.target.value;
                    setSuggestions(copy);
                  }}
                  placeholder={
                    i === 0 ? '오늘 기분 어때?' : i === 1 ? '뭐하고 있었어?' : '주말에 뭐 할 거야?'
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.step2ButtonContainer}>
          <button className={styles.Button} onClick={onPrev}>
            이전 단계
          </button>
          <button className={styles.Button} onClick={onNext} disabled={!isValid}>
            다음 단계
          </button>
        </div>
      </section>
    </>
  );
}
