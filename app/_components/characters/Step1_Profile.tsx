'use client';

// React 관련
import { useState } from 'react';

// 스타일 관련
import styles from '/app/(routes)/(private)/characters/new/CharactersNew.module.css';

// 아이콘 관련
import { MdOutlineFileUpload } from 'react-icons/md';
import { PiMagicWandDuotone } from 'react-icons/pi';
import { FaChevronRight } from 'react-icons/fa';

// 컴포넌트 관련
import CharacterPolicyNotice from './CharacterPolicyNotice';
import VoiceSelectModal from './VoiceSelectModal';

export default function Step1_Profile() {
  // Input char Count
  const [name, setName] = useState('');
  const [oneliner, setOneliner] = useState('');

  // Voice Select Modal
  const [modalOpen, setModalOpen] = useState(false);

  // voice selection
  const [selectedVoice, setSelectedVoice] = useState('');

  return (
    <section className={styles.wrapper}>
      <div className={styles.formContent}>
        {/* 프로필 사진 업로드 */}
        <div className={styles.field}>
          <label className={styles.label}>
            프로필 사진 <span className={styles.required}>*</span>
          </label>

          <div className={styles.profileRow}>
            <div className={styles.imageBox} />

            <div className={styles.profileRight}>
              <div className={styles.captionBox}>
                <p className={styles.caption}>이미지를 필수로 등록해 주세요.</p>
                <p className={styles.subCaption}>부적절한 이미지는 업로드가 제한됩니다.</p>
              </div>
              <div className={styles.buttonRow}>
                <button className={styles.button}>
                  <MdOutlineFileUpload /> 업로드
                </button>
                <button className={styles.button}>
                  <PiMagicWandDuotone /> 생성
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 이름 입력 */}
        <div className={styles.field}>
          <label className={styles.label}>
            이름 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>2~20자 이내로 입력해 주세요 (특수문자, 이모지 제외)</p>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={name}
              maxLength={20}
              className={styles.input}
              onChange={e => {
                if (e.target.value.length <= 20) setName(e.target.value);
              }}
              placeholder="짧은 이름이 부르기 더 좋아요!"
            />
            <div className={styles.charCount}>{name.length} / 20</div>
          </div>
        </div>

        {/* 한 줄 소개 입력 */}
        <div className={styles.field}>
          <label className={styles.label}>
            한 줄 소개 <span className={styles.required}>*</span>
          </label>
          <div className={styles.textareaWrapper}>
            <textarea
              value={oneliner}
              maxLength={300}
              className={styles.textarea}
              onChange={e => {
                if (e.target.value.length <= 300) setOneliner(e.target.value);
              }}
              placeholder="어떤 캐릭터인지 간단한 소개 설명을 입력해 주세요."
              rows={3}
            />
            <div className={styles.textareaCharCount}>{oneliner.length} / 300</div>
          </div>
        </div>

        {/* 목소리 선택 */}
        <div className={styles.field}>
          <label className={styles.label}>목소리 선택</label>
          <p className={styles.caption}>캐릭터에게 어울리는 목소리를 선택해 주세요</p>
          <button
            className={styles.voiceSelectedButton}
            onClick={() => setModalOpen(true)}
            type="button"
          >
            {selectedVoice ? selectedVoice.replace('_', ' ') : '캐릭터의 목소리를 선택해주세요.'}
            <FaChevronRight className={styles.chevronIcon} />
          </button>
        </div>
        {/* 부적절한 캐릭터 정책 안내 */}
        <CharacterPolicyNotice />
      </div>

      {/* 고정 하단 버튼 */}
      <div className={styles.fixedBottom}>
        <button className={styles.Button}>다음 단계</button>
      </div>

      {/* 목소리 선택 모달 */}
      <VoiceSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
      />
    </section>
  );
}
