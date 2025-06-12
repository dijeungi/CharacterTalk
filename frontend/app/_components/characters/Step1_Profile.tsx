'use client';

// React 관련
import { useEffect, useMemo, useState, useRef } from 'react';

// 스타일 관련
import styles from '/app/(routes)/(private)/characters/new/CharactersNew.module.css';

// 아이콘 관련
import { MdOutlineFileUpload } from 'react-icons/md';
import { PiMagicWandDuotone } from 'react-icons/pi';
import { FaChevronRight } from 'react-icons/fa';

// 컴포넌트 관련
import CharacterPolicyNotice from './CharacterPolicyNotice';
import VoiceSelectModal from './VoiceSelectModal';

// store
import { useCharacterStep1Store } from '../../store/characterStep1Store';

export default function Step1_Profile() {
  // 상태 초기화
  const [modalOpen, setModalOpen] = useState(false);
  const [choiceMade, setChoiceMade] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isNewCreation, setIsNewCreation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Zustand 상태관리 (header에 '임시저장' 버튼과 연동을 위함)
  const {
    name,
    oneliner,
    selectedVoice,
    profileImage,
    isDirty,
    setName,
    setOneliner,
    setSelectedVoice,
    setProfileImage,
    setDirty,
    resetDirty,
  } = useCharacterStep1Store();

  // 프로필 이미지 미리보기
  const imagePreview = useMemo(() => {
    return profileImage ? URL.createObjectURL(profileImage) : null;
  }, [profileImage]);

  // 입력 필드가 모두 채워졌는지 체크
  const isFormValid = useMemo(
    () => profileImage && name && oneliner,
    [profileImage, name, oneliner]
  );

  /* 
    input 입력값을 감지하여 setDirty(zustand 상태관리)를 업데이트 합니다.
    우측 상단 Header에 임시저장이랑 연동하기 위함입니다.
  */
  useEffect(() => {
    if (name || oneliner || selectedVoice) {
      setDirty();
    } else {
      resetDirty();
    }
  }, [name, oneliner, selectedVoice, setDirty, resetDirty]);

  // 프로필 이미지 업로드
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfileImage(file);
    }
  };

  // 파일선택 창 열기
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('tempCharacterData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setName(parsedData.name || '');
      setOneliner(parsedData.oneliner || '');
      setSelectedVoice(parsedData.selectedVoice || '');
      if (parsedData.profileImage) {
        setProfileImage(parsedData.profileImage);
      }
      setIsNewCreation(false);
      setIsDataLoaded(true);
    } else {
      setIsNewCreation(true);
      setIsDataLoaded(true);
      setChoiceMade(true);
    }
  }, []);

  // "새로 제작" 핸들러
  const handleNewCreation = () => {
    localStorage.removeItem('tempCharacterData');
    setName('');
    setOneliner('');
    setSelectedVoice('');
    setProfileImage(null);
    resetDirty();
    setIsNewCreation(true);
    setChoiceMade(true);
  };

  // "이어서 제작" 핸들러
  const handleContinueCreation = () => {
    setIsNewCreation(false);
    setChoiceMade(true);
    setIsDataLoaded(true);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.formContent}>
        {isDataLoaded && !isNewCreation && !choiceMade && (
          // 로컬스토리지에 데이터가 있을 경우 "이어서 제작" 또는 "새로 제작" 선택
          <div className={styles.optionButtons}>
            <button className={styles.optionButton} onClick={handleContinueCreation}>
              이어서 제작
            </button>
            <button className={styles.optionButton} onClick={handleNewCreation}>
              새로 제작
            </button>
          </div>
        )}

        {/* "새로 제작" 또는 "이어서 제작"을 선택 후 진행 */}
        {isDataLoaded && choiceMade && (
          <>
            {/* 프로필 사진 업로드 */}
            <div className={styles.field}>
              <label className={styles.label}>
                프로필 사진 <span className={styles.required}>*</span>
              </label>

              <div className={styles.profileRow}>
                <div className={styles.imageBox}>
                  {/* 프로필 이미지 미리보기 */}
                  {imagePreview && (
                    <img src={imagePreview} alt="Profile" className={styles.profileImage} />
                  )}
                </div>

                <div className={styles.profileRight}>
                  <div className={styles.captionBox}>
                    <p className={styles.caption}>이미지를 필수로 등록해 주세요.</p>
                    <p className={styles.subCaption}>부적절한 이미지는 업로드가 제한됩니다.</p>
                  </div>
                  <div className={styles.buttonRow}>
                    <button className={styles.button} type="button" onClick={triggerFileInput}>
                      <MdOutlineFileUpload /> 업로드
                      <input
                        ref={fileInputRef}
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfileImageUpload}
                      />
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
                {selectedVoice
                  ? selectedVoice.replace('_', ' ')
                  : '캐릭터의 목소리를 선택해주세요.'}
                <FaChevronRight className={styles.chevronIcon} />
              </button>
            </div>
            {/* 부적절한 캐릭터 정책 안내 */}
            <CharacterPolicyNotice />

            {/* 고정 하단 버튼 */}
            <div className={styles.fixedBottom}>
              <button className={styles.Button} disabled={!isFormValid}>
                다음 단계
              </button>
            </div>

            {/* 목소리 선택 모달 */}
            <VoiceSelectModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />
          </>
        )}
      </div>
    </section>
  );
}
