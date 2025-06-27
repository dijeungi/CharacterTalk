/**
 * @component    Step1_Profile
 * @file         frontend/app/(routes)/(private)/characters/new/_components/Step1_Profile.tsx
 * @desc         캐릭터 생성 1단계: 프로필 이미지, 이름, 한줄소개 입력 폼
 *
 * @layout       characters New Layout
 * @access       private
 * @props        없음
 *
 * @features
 *  - 프로필 이미지 업로드 및 이미지 생성기 연동
 *  - 이름 및 한줄소개 입력 (유효성 포함)
 *  - 로컬스토리지 임시 저장 데이터 불러오기
 *  - Zustand 기반 전역 상태관리
 *  - MUI, React-icons 등 외부 라이브러리 활용
 *
 * @dependencies
 *  - Zustand (useCharacterStep1Store)
 *  - React Icons (react-icons)
 *  - MUI (LinearProgress)
 *  - LocalStorage (임시 저장 복원)
 *
 * @todo
 *  - 목소리 선택 기능 추가 (VoiceSelectModal)
 *  - 다음 단계 연동
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.24
 */

'use client';
import { useEffect, useMemo, useState, useRef } from 'react';

// css
import styles from './page.module.css';

// Library
import { MdOutlineFileUpload } from 'react-icons/md';
import { PiMagicWandDuotone } from 'react-icons/pi';

// components
import CharacterPolicyNotice from './Drawer/CharacterPolicyNotice';
import ContinueCreationModal from './Modal/ContinueCreationModal';
import ProfileImageGeneratorDrawer from './Drawer/ProfileImageGeneratorDrawer';
// import VoiceSelectModal from './Modal/VoiceSelectModal';

// store
import { useCharacterCreationStore } from '@/app/_store/characters/index';

// utils
import {
  deleteDraftFromDB,
  deleteImageFromDB,
  getDraftFromDB,
  getImageFromDB,
} from '@/app/_utils/indexedDBUtils';

export default function Step1_Profile({ onNext }: Step1Props) {
  // 상태 초기화
  const [imageGeneratorDrawerOpen, setImageGeneratorDrawerOpen] = useState(false);
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /*
    - Zustand 상태관리
    - CharacterCreate.d.ts > characterStep1Store.ts > Step1_Profile.tsx 타입 선언 전달
  */
  const name = useCharacterCreationStore(state => state.name);
  const oneliner = useCharacterCreationStore(state => state.oneliner);
  const profileImage = useCharacterCreationStore(state => state.profileImage);

  const setName = useCharacterCreationStore(state => state.setName);
  const setOneliner = useCharacterCreationStore(state => state.setOneliner);
  const setProfileImage = useCharacterCreationStore(state => state.setProfileImage);
  const setDirty = useCharacterCreationStore(state => state.setDirty);
  const resetDirty = useCharacterCreationStore(state => state.resetDirty);
  const setCurrentStep = useCharacterCreationStore(state => state.setCurrentStep);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  // 프로필 이미지 미리보기
  const imagePreview = useMemo(() => {
    if (profileImage instanceof File) {
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
    if (name || oneliner || profileImage) {
      setDirty();
    } else {
      resetDirty();
    }
  }, [name, oneliner, profileImage, setDirty, resetDirty]);

  // 프로필 이미지 업로드
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  // 새로 제작
  const handleNewCreation = async () => {
    await deleteDraftFromDB();
    await deleteImageFromDB('profileImage');

    setName('');
    setOneliner('');
    setProfileImage(null);
    resetDirty();
    setContinueModalOpen(false);
  };

  // 이어서 제작
  const handleContinueCreation = () => {
    setContinueModalOpen(false);
  };

  useEffect(() => {
    const restore = async () => {
      const saved = await getDraftFromDB();
      const imageURL = await getImageFromDB('profileImage');

      if (saved) {
        setName(saved.name || '');
        setOneliner(saved.oneliner || '');
        setProfileImage(imageURL || null);
        setContinueModalOpen(true);
      }

      setIsDataLoaded(true);
    };
    restore();
  }, []);

  return (
    <>
      <section className={styles.container}>
        <div className={styles.wrapper}>
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

              {/* 목소리 선택
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
              </div> */}

              <CharacterPolicyNotice />
              <div className={styles.fixedBottom}>
                <button className={styles.Button} onClick={onNext} disabled={!isFormValid}>
                  다음 단계
                </button>
              </div>

              {/* Todo: 추후 기능.. 으로 잠깐  */}
              {/* <VoiceSelectModal
                open={voiceModalOpen}
                onClose={() => setVoiceModalOpen(false)}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
              /> */}

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
