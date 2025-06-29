'use client';
import { useEffect, useState } from 'react';

// css
import styles from './page.module.css';

// lib
import { HiChevronDown } from 'react-icons/hi2';

// store
import { useCharacterCreationStore } from '@/app/_store/characters';

// hooks
import { useCheckUserStatus } from '@/app/_hooks/auth';
import { getDraftFromDB } from '@/app/_utils/indexedDBUtils';

export default function Step2_Personality({ onPrev, onNext }: Step2Props) {
  // 상태
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data } = useCheckUserStatus();
  const userName = data?.user?.name || '사용자';

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // store
  const title = useCharacterCreationStore(state => state.title);
  const promptDetail = useCharacterCreationStore(state => state.promptDetail);
  const exampleDialogs = useCharacterCreationStore(state => state.exampleDialogs);
  const speech = useCharacterCreationStore(state => state.speech);
  const behaviorConstraint = useCharacterCreationStore(state => state.behaviorConstraint);

  const setTitle = useCharacterCreationStore(state => state.setTitle);
  const setPromptDetail = useCharacterCreationStore(state => state.setPromptDetail);
  const addExampleDialog = useCharacterCreationStore(state => state.addExampleDialog);
  const updateExampleDialog = useCharacterCreationStore(state => state.updateExampleDialog);
  const removeExampleDialog = useCharacterCreationStore(state => state.removeExampleDialog);

  const setSpeech = useCharacterCreationStore(state => state.setSpeech);
  const setBehaviorConstraint = useCharacterCreationStore(state => state.setBehaviorConstraint);

  // 다음단계 버튼 활성화 상태
  const isFormValid = title.trim() !== '' && promptDetail.trim() !== '' && speech.trim() !== '';

  // 임시저장 데이터 불러오기
  useEffect(() => {
    const restore = async () => {
      const saved = await getDraftFromDB();
      if (!saved) return;

      const store = useCharacterCreationStore.getState();

      // Step2의 데이터를 복원
      store.setTitle(saved.title || '');
      store.setPromptDetail(saved.promptDetail || '');
      store.setSpeech(saved.speech || '');
      store.setBehaviorConstraint(saved.behaviorConstraint || '');

      if (Array.isArray(saved.exampleDialogs) && saved.exampleDialogs.length > 0) {
        // 예시 대화가 이미 존재하지 않으면 추가
        saved.exampleDialogs.forEach((dialog: { user: string; ai: string }) => {
          if (!store.exampleDialogs.some(d => d.user === dialog.user && d.ai === dialog.ai)) {
            store.addExampleDialog(dialog);
          }
        });
      }

      setIsDataLoaded(true);
    };

    restore();
  }, []);

  return (
    <>
      <section className={styles.container}>
        <div className={styles.wrapper}>
          {/* 캐릭터 시나리오 제목 입력 */}
          <div className={styles.field}>
            <label className={styles.label}>
              캐릭터 주제 <span className={styles.required}>*</span>
            </label>
            <p className={styles.caption}>
              캐릭터의 정체와 세계관이 드러나는 제목을 입력해 주세요.
            </p>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예시) 낮에는 아이돌, 밤에는 흡혈귀 헌터"
                maxLength={50}
              />
              <div className={styles.charCount}>{title.length} / 50</div>
            </div>
          </div>
          {/* 상세 설명 */}
          <div className={styles.field}>
            <label className={styles.label}>
              캐릭터 설명 및 정보 <span className={styles.required}>*</span>
            </label>
            <p className={styles.caption}>
              상황, 성격, 말투, 관계, 세계관 등을 포함해 캐릭터를 자세히 설명해 주세요.
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

          {/* 말투 스타일 선택 */}
          <div className={styles.field}>
            <label className={styles.label}>
              말투 스타일 <span className={styles.required}>*</span>
            </label>
            <p className={styles.caption}>캐릭터의 어조와 말투 스타일을 선택해 주세요.</p>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={speech}
                onChange={e => setSpeech(e.target.value as SpeechStyle)}
              >
                <option value="">선택 안 함</option>
                <option value="formal-polite">존댓말 / 정중함</option>
                <option value="casual-friendly">반말 / 친근함</option>
                <option value="direct-blunt">직설적 / 쿨한 말투</option>
                <option value="cheerful">명랑하고 밝은 말투</option>
                <option value="tsundere">츤데레 스타일</option>
              </select>
              <HiChevronDown className={styles.selectIcon} />
            </div>
          </div>

          {/* 행동 제약 조건 입력 */}
          <div className={styles.field}>
            <label className={styles.label}>행동 제약 조건</label>
            <p className={styles.caption}>
              캐릭터가 반드시 지켜야 할 제약 사항이 있다면 입력해 주세요.
            </p>
            <textarea
              className={styles.textarea}
              rows={3}
              value={behaviorConstraint}
              onChange={e => setBehaviorConstraint(e.target.value)}
              placeholder="예시) 욕설 절대 금지. 사용자가 감정적으로 대할 때도 침착하게 대응."
            />
          </div>

          {/* 고급 설정 토글 */}
          <div className={styles.field}>
            <button className={styles.toggleButton} onClick={() => setShowAdvanced(prev => !prev)}>
              <div className={styles.toggleLabel}>고급 설정</div>
              <div className={`${styles.chevron} ${showAdvanced ? styles.open : ''}`}>
                <HiChevronDown />
              </div>
            </button>
          </div>

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
                {exampleDialogs.length < 3 && (
                  <button
                    className={styles.exampleDialogBtn}
                    onClick={() => addExampleDialog({ user: '', ai: '' })}
                  >
                    + 예시 대화 추가
                  </button>
                )}
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
                      onChange={e =>
                        updateExampleDialog(i, { user: e.target.value, ai: dialog.ai })
                      }
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
                      onChange={e =>
                        updateExampleDialog(i, { user: dialog.user, ai: e.target.value })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* 하단 버튼 영역 */}
        </div>
        <div className={styles.step2ButtonContainer}>
          <button className={styles.Button} onClick={onPrev}>
            이전 단계
          </button>
          <button className={styles.Button} onClick={onNext} disabled={!isFormValid}>
            다음 단계
          </button>
        </div>
      </section>
    </>
  );
}
