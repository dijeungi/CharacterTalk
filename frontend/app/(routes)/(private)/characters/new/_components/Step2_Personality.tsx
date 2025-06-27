'use client';

// css
import styles from './page.module.css';

// store
import { useCharacterCreationStore } from '@/app/_store/characters';

export default function Step2_Personality() {
  // store
  const title = useCharacterCreationStore(state => state.title);
  const promptDetail = useCharacterCreationStore(state => state.promptDetail);
  const exampleDialogs = useCharacterCreationStore(state => state.exampleDialogs);

  const setTitle = useCharacterCreationStore(state => state.setTitle);
  const setPromptDetail = useCharacterCreationStore(state => state.setPromptDetail);
  const addExampleDialog = useCharacterCreationStore(state => state.addExampleDialog);
  const updateExampleDialog = useCharacterCreationStore(state => state.updateExampleDialog);
  const removeExampleDialog = useCharacterCreationStore(state => state.removeExampleDialog);

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

        {/* 예시 대화 */}
        <div className={styles.field}>
          <label className={styles.label}>예시 대화 (최대 3개)</label>
          <p className={styles.caption}>‘사용자:’, ‘AI:’ 형식으로 대화를 작성해 주세요.</p>

          {exampleDialogs.map((dialog, i) => (
            <div key={i} className={styles.exampleDialogContainer}>
              <div className={styles.exampleDialogField}>
                <input
                  type="text"
                  className={styles.exampleDialogInput}
                  placeholder="사용자: 예시 질문 입력"
                  value={dialog.user}
                  onChange={e => updateExampleDialog(i, { ...dialog, user: e.target.value })}
                />
                <input
                  type="text"
                  className={styles.exampleDialogInput}
                  placeholder="AI: 예시 응답 입력"
                  value={dialog.ai}
                  onChange={e => updateExampleDialog(i, { ...dialog, ai: e.target.value })}
                />
              </div>
              <button className={styles.removeButton} onClick={() => removeExampleDialog(i)}>
                삭제
              </button>
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
