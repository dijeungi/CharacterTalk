'use client';
import { useEffect, useState } from 'react';

// css
import styles from './page.module.css';

// lib
import { HiChevronUp } from 'react-icons/hi2';

// store
import { useCharacterCreationStore } from '@/app/_store/characters';

// hooks
import { useCheckUserStatus } from '@/app/_hooks/auth';

export default function Step2_Personality() {
  // 상태
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { data } = useCheckUserStatus();
  const userName = data?.user?.name || '사용자';

  // store
  const title = useCharacterCreationStore(state => state.title);
  const promptDetail = useCharacterCreationStore(state => state.promptDetail);
  const exampleDialogs = useCharacterCreationStore(state => state.exampleDialogs);

  const setTitle = useCharacterCreationStore(state => state.setTitle);
  const setPromptDetail = useCharacterCreationStore(state => state.setPromptDetail);
  const addExampleDialog = useCharacterCreationStore(state => state.addExampleDialog);
  const updateExampleDialog = useCharacterCreationStore(state => state.updateExampleDialog);
  const removeExampleDialog = useCharacterCreationStore(state => state.removeExampleDialog);

  const setCurrentStep = useCharacterCreationStore(state => state.setCurrentStep);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        {/* 제목 입력 */}
        <div className={styles.field}>
          <label className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>캐릭터의 성격을 한 줄로 요약해 주세요.</p>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예시) 츤데레 마법학교 소녀"
              maxLength={50}
            />
            <div className={styles.charCount}>{title.length} / 50</div>
          </div>
        </div>
        {/* 상세 설명 */}
        <div className={styles.field}>
          <label className={styles.label}>
            캐릭터 설명 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            상황, 성격, 말투, 관계, 세계관 등 캐릭터를 상세히 설명해 주세요.
          </p>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              value={promptDetail}
              onChange={e => setPromptDetail(e.target.value)}
              maxLength={3000}
              rows={6}
              placeholder="예시) 겉으로는 무뚝뚝하지만 속은 따뜻한 츤데레 성격. 항상 반말을 사용하며, 친해질수록 농담을 자주 함. 사용자와는 어릴 적부터 친구였던 설정. 중세 판타지 세계관 속 마법학교에 다니는 17세 캐릭터."
            />
            <div className={styles.textareaCharCount}>{promptDetail.length} / 3000</div>
          </div>
        </div>

        {/* 고급 설정 토글 */}
        <button className={styles.toggleButton} onClick={() => setShowAdvanced(prev => !prev)}>
          <div className={styles.toggleLabel}>고급 설정</div>
          <div className={`${styles.chevron} ${showAdvanced ? styles.open : ''}`}>
            <HiChevronUp />
          </div>
        </button>

        {/* 예시 대화 */}
        {showAdvanced && (
          <div className={styles.advancedSection}>
            <div className={styles.field}>
              <label className={styles.label}>예시 대화</label>
              <p className={styles.caption}>
                예시 대화를 입력해서 캐릭터에 완성도를 높여보세요.
                <br />
                예시는 최대 3개까지 등록하실 수 있습니다.
              </p>
            </div>

            {exampleDialogs.map((dialog, i) => (
              <div key={i} className={styles.exampleDialogContainer}>
                <div className={styles.dialogHeader}>
                  <span className={styles.dialogTitle}>예시 {i + 1}</span>
                  <button className={styles.removeButton} onClick={() => removeExampleDialog(i)}>
                    삭제
                  </button>
                </div>

                <div className={styles.dialogField}>
                  <label className={styles.dialogLabel}>{userName}</label>
                  <input
                    type="text"
                    className={styles.exampleDialogInput}
                    placeholder={
                      i === 0
                        ? '오늘 기분 어때?'
                        : i === 1
                        ? '뭐하고 있었어?'
                        : '주말에 뭐 할 거야?'
                    }
                    value={dialog.user}
                    onChange={e => updateExampleDialog(i, { ...dialog, user: e.target.value })}
                  />
                </div>

                <div className={styles.dialogField}>
                  <label className={styles.dialogLabel}>Ai 캐릭터</label>
                  <input
                    type="text"
                    className={styles.exampleDialogInput}
                    placeholder={
                      i === 0
                        ? '나야 항상 기분 좋지! 너는?'
                        : i === 1
                        ? '그냥 좀 쉬고 있었지. 넌?'
                        : '비밀이야~ 너랑 얘기하면서 정할래!'
                    }
                    value={dialog.ai}
                    onChange={e => updateExampleDialog(i, { ...dialog, ai: e.target.value })}
                  />
                </div>
              </div>
            ))}
            {exampleDialogs.length < 3 && (
              <button
                className={styles.button}
                onClick={() => addExampleDialog({ user: '', ai: '' })}
              >
                + 예시 대화 추가
              </button>
            )}
          </div>
        )}
      </div>

      {/* 하단 버튼 영역 */}
      <div className={styles.fixedBottom}>
        <div className={styles.stepButtonContainer}>
          <button className={styles.Button}>다음</button>
        </div>
      </div>
    </section>
  );
}
