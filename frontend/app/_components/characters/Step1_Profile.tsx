/*
  Route: '/characters/new'
  Path: app/_components/characters/Step1_Profile.tsx
  Description:
    - 캐릭터 생성 step1 페이지
*/

'use client';

// Next
import { useEffect, useMemo, useState, useRef } from 'react';

// css
import styles from './page.module.css';

// Icon Library
import { MdOutlineFileUpload } from 'react-icons/md';
import { PiMagicWandDuotone } from 'react-icons/pi';
import { FaChevronRight } from 'react-icons/fa';

// components
import CharacterPolicyNotice from './Drawer/CharacterPolicyNotice';
import ContinueCreationModal from './Modal/ContinueCreationModal';
import VoiceSelectModal from './Modal/VoiceSelectModal';

// store
import { useCharacterStep1Store } from '../../store/characterStep1Store';
import ProfileImageGeneratorDrawer from './Drawer/ProfileImageGeneratorDrawer';

export default function Step1_Profile() {
  // 상태 초기화
  const [imageGeneratorDrawerOpen, setImageGeneratorDrawerOpen] = useState(false);
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /*
    - Zustand 상태관리
    - CharacterCreate.d.ts > characterStep1Store.ts > Step1_Profile.tsx 타입 선언 전달
  */
  const {
    name,
    oneliner,
    selectedVoice,
    profileImage,
    setName,
    setOneliner,
    setSelectedVoice,
    setProfileImage,
    setDirty,
    resetDirty,
  } = useCharacterStep1Store();

  // 프로필 이미지 미리보기
  const imagePreview = useMemo(() => {
    if (profileImage instanceof File || profileImage instanceof Blob) {
      return URL.createObjectURL(profileImage);
    }
    if (typeof profileImage === 'string') {
      return profileImage;
    }
    return null;
  }, [profileImage]);

  // 입력 필드가 모두 채워졌는지 체크
  const isFormValid = useMemo(
    () => profileImage && name && oneliner,
    [profileImage, name, oneliner]
  );

  useEffect(() => {
    if (name || oneliner || selectedVoice || profileImage) {
      setDirty();
    } else {
      resetDirty();
    }
  }, [name, oneliner, selectedVoice, profileImage, setDirty, resetDirty]);

  // 프로필 이미지 업로드
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
    }
  };

  // 파일선택 창 열기
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 새로 제작
  const handleNewCreation = () => {
    localStorage.removeItem('tempCharacterData');
    setName('');
    setOneliner('');
    setSelectedVoice('');
    setProfileImage(null);
    resetDirty();
    setContinueModalOpen(false);
  };

  // 이어서 제작
  const handleContinueCreation = () => {
    setContinueModalOpen(false);
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
      setIsDataLoaded(true);
      setContinueModalOpen(true);
    } else {
      setIsDataLoaded(true);
    }
  }, []);

  return (
    <>
      <section className={styles.container}>
        <div className={styles.formContent}>
          {/* isDataLoaded가 true일 때만 전체 컨텐츠를 렌더링 */}
          {isDataLoaded && (
            <>
              {/* 프로필 사진 업로드 */}
              <div className={styles.field}>
                <label className={styles.label}>
                  프로필 사진 <span className={styles.required}>*</span>
                </label>

                <div className={styles.profileRow}>
                  <div className={styles.imageBox}>
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
                      <button
                        className={styles.button}
                        type="button"
                        onClick={() => setImageGeneratorDrawerOpen(true)}
                      >
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
                <p className={styles.caption}>
                  2~20자 이내로 입력해 주세요 (특수문자, 이모지 제외)
                </p>
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
                  onClick={() => setVoiceModalOpen(true)}
                  type="button"
                >
                  {selectedVoice
                    ? selectedVoice.replace('_', ' ')
                    : '캐릭터의 목소리를 선택해주세요.'}
                  <FaChevronRight className={styles.chevronIcon} />
                </button>
              </div>

              <CharacterPolicyNotice />

              <div className={styles.fixedBottom}>
                <button className={styles.Button} disabled={!isFormValid}>
                  다음 단계
                </button>
              </div>

              <VoiceSelectModal
                open={voiceModalOpen}
                onClose={() => setVoiceModalOpen(false)}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
              />

              <ProfileImageGeneratorDrawer
                open={imageGeneratorDrawerOpen}
                onClose={() => setImageGeneratorDrawerOpen(false)}
                onImageGenerated={imageFile => {
                  setProfileImage(imageFile);
                  setImageGeneratorDrawerOpen(false);
                }}
              />
            </>
          )}
        </div>
      </section>
      <ContinueCreationModal
        open={continueModalOpen}
        onNew={handleNewCreation}
        onContinue={handleContinueCreation}
      />
    </>
  );
}
