/**
 * @file         frontend/app/(routes)/(private)/characters/new/_components/Step1_Profile.tsx
 * @desc         Component: 캐릭터 기본 정보(프로필 이미지, 이름, 설명, MBTI) 입력 및 임시 저장 감지 처리 포함한 Step1 UI 정의
 *
 * @author       최준호
 * @update       2025.07.25
 */

'use client';
import { useEffect, useMemo, useState, useRef, useCallback, ChangeEvent } from 'react';
import styles from '@/app/(routes)/(private)/characters/new/_components/page.module.css';

import { MdOutlineFileUpload } from 'react-icons/md';
import { PiMagicWandDuotone } from 'react-icons/pi';
import { HiChevronDown } from 'react-icons/hi2';

import CharacterPolicyNotice from '@/app/(routes)/(private)/characters/new/_components/Drawer/CharacterPolicyNotice';
import ContinueCreationModal from '@/app/(routes)/(private)/characters/new/_components/Modal/ContinueCreationModal';
import ProfileImageGeneratorDrawer from '@/app/(routes)/(private)/characters/new/_components/Drawer/ProfileImageGeneratorDrawer';
// import VoiceSelectModal from './Modal/VoiceSelectModal';

import { deleteDraftFromDB, deleteImageFromDB } from '@/app/_utils/indexedDBUtils';

import { useStep1 } from '@/app/(routes)/(private)/characters/new/_hooks/useStep1';
import { useRestoreCharacterDraft } from '@/app/(routes)/(private)/characters/new/_hooks/useRestoreCharacterDraft';

import { MBTI } from '@/app/_store/characters/types';
import { useCharacterCreationStore } from '@/app/_store/characters';

import { Step1Props } from '@/app/(routes)/(private)/characters/new/_types';

export default function Step1_Profile({ onNext, fromStep2 }: Step1Props) {
  // 상태 초기화
  const [imageGeneratorDrawerOpen, setImageGeneratorDrawerOpen] = useState(false);
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isNavigatingNext = useRef(false);

  const isDataLoaded = useRestoreCharacterDraft(fromStep2, setContinueModalOpen);

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

  const resetAllData = useCharacterCreationStore(state => state.resetAllData);

  // 프로필 이미지 미리보기
  const imagePreview = useMemo(() => {
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      return url;
    }
    if (typeof profileImage === 'string') return profileImage;
    return null;
  }, [profileImage]);

  // 파일 업로드
  const handleProfileImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfileImage(file);
      }
    },
    [setProfileImage]
  );

  // 파일선택 창 열기
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 새로 제작
  const handleNewCreation = useCallback(async () => {
    await deleteDraftFromDB();
    await deleteImageFromDB('profileImage');
    resetAllData();
    setContinueModalOpen(false);
  }, [resetAllData]);

  // 이어서 제작
  const handleContinueCreation = useCallback(() => {
    setContinueModalOpen(false);
  }, []);

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length <= 20) setName(e.target.value);
    },
    [setName]
  );

  const handleOnelinerChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length <= 300) setOneliner(e.target.value);
    },
    [setOneliner]
  );

  const handleMbtiChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setMbti(e.target.value as MBTI);
    },
    [setMbti]
  );

  const handleNextClick = useCallback(() => {
    isNavigatingNext.current = true;
    onNext();
  }, [onNext]);

  useEffect(() => {
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileImage]);

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
                    onChange={handleNameChange}
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
                    onChange={handleOnelinerChange}
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
                  <select className={styles.select} value={mbti} onChange={handleMbtiChange}>
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
                // R2 스토리지 URL(Blob) 를 File 객체로 변환 시키며 zustand에 저장합니다.
                onImageGenerated={async imageUrl => {
                  const res = await fetch(imageUrl);
                  const blob = await res.blob();
                  const file = new File([blob], 'generated.png', { type: blob.type });
                  setProfileImage(file);
                  setImageGeneratorDrawerOpen(false);
                }}
              />
            </>
          )}
        </div>
        <div className={styles.step1ButtonContainer}>
          <button
            className={styles.Button}
            onClick={handleNextClick}
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
