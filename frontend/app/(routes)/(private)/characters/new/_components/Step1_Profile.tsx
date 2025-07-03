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
import { HiChevronDown } from 'react-icons/hi2';

// components
import CharacterPolicyNotice from './Drawer/CharacterPolicyNotice';
import ContinueCreationModal from './Modal/ContinueCreationModal';
import ProfileImageGeneratorDrawer from './Drawer/ProfileImageGeneratorDrawer';
// import VoiceSelectModal from './Modal/VoiceSelectModal';

// utils
import {
  deleteDraftFromDB,
  deleteImageFromDB,
  getDraftFromDB,
  getImageFromDB,
} from '@/app/_utils/indexedDBUtils';

// hooks
import { useStep1 } from '../_hooks/useStep1';

export default function Step1_Profile({ onNext, fromStep2 }: Step1Props) {
  // 상태 초기화
  const [imageGeneratorDrawerOpen, setImageGeneratorDrawerOpen] = useState(false);
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // store
  const {
    name,
    oneliner,
    profileImage,
    mbti,
    setName,
    setOneliner,
    setProfileImage,
    setMbti,
    isFormValid,
    resetDirty,
  } = useStep1();

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

  // IndexedDB에 저장된 데이터 가져오기
  useEffect(() => {
    const restore = async () => {
      const saved = await getDraftFromDB();
      const imageURL = await getImageFromDB('profileImage');

      if (saved) {
        setName(saved.name || '');
        setOneliner(saved.oneliner || '');
        setProfileImage(imageURL || null);
        if (!fromStep2) {
          setContinueModalOpen(true);
        }
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
                      <button
                        className={styles.profileButton}
                        type="button"
                        onClick={triggerFileInput}
                      >
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
                        className={styles.profileButton}
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
                  설명 <span className={styles.required}>*</span>
                </label>
                <div className={styles.textareaWrapper}>
                  <textarea
                    value={oneliner}
                    maxLength={300}
                    className={styles.textarea}
                    onChange={e => {
                      if (e.target.value.length <= 300) setOneliner(e.target.value);
                    }}
                    placeholder="캐릭터의 특징, 행동, 감정 표현에 대해 자세히 작성해주세요. 그러면 개성 넘치는 캐릭터를 만들 수 있습니다.
예시: 수현은 말이 거칠고, 다양한 비속어를 자주 사용합니다."
                    rows={3}
                  />
                  <div className={styles.textareaCharCount}>{oneliner.length} / 300</div>
                </div>
              </div>

              {/* mbti */}
              <div className={styles.field}>
                <label className={styles.label}>MBTI</label>
                <p className={styles.caption}>캐릭터의 성격을 나타내는 MBTI를 선택해 주세요.</p>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={mbti}
                    onChange={e => setMbti(e.target.value as MBTI)}
                  >
                    <option value="">선택 안 함</option>
                    <option value="ISTJ">ISTJ</option>
                    <option value="ISFJ">ISFJ</option>
                    <option value="INFJ">INFJ</option>
                    <option value="INTJ">INTJ</option>
                    <option value="ISTP">ISTP</option>
                    <option value="ISFP">ISFP</option>
                    <option value="INFP">INFP</option>
                    <option value="INTP">INTP</option>
                    <option value="ESTP">ESTP</option>
                    <option value="ESFP">ESFP</option>
                    <option value="ENFP">ENFP</option>
                    <option value="ENTP">ENTP</option>
                    <option value="ESTJ">ESTJ</option>
                    <option value="ESFJ">ESFJ</option>
                    <option value="ENFJ">ENFJ</option>
                    <option value="ENTJ">ENTJ</option>
                  </select>
                  <HiChevronDown className={styles.selectIcon} />
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
        <div className={styles.step1ButtonContainer}>
          <button
            className={styles.Button}
            onClick={onNext}
            disabled={!isFormValid}
            style={{ width: '100%' }}
          >
            다음 단계
          </button>
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
