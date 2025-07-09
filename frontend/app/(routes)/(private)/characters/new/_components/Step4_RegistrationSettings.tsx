'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { HiChevronDown } from 'react-icons/hi';
import HashtagDrawer from './Drawer/HashtagDrawer';
import { useCreateCharacterFormData } from '../_hooks/useCreateCharacterFormData';
import { useStep4 } from '../_hooks/useStep4';

export default function Step4_RegistrationSettings({ onPrev, onNext }: any) {
  const createFormData = useCreateCharacterFormData();

  // Store에서 상태 및 함수 가져오기
  const {
    visibility,
    genre,
    target,
    conversationType,
    userFilter,
    hashtags,
    commentsEnabled,
    setVisibility,
    setGenre,
    setTarget,
    setConversationType,
    setUserFilter,
    addHashtag,
    removeHashtag,
    setCommentsEnabled,
    isFormValid,
  } = useStep4();

  // 컴포넌트 내부 상태
  const [drawerOpen, setDrawerOpen] = useState(false);

  // input의 onChange 이벤트 핸들러
  const handleAddHashtag = (newHashtag: string) => {
    if (!hashtags.includes(newHashtag) && hashtags.length < 10) {
      addHashtag(newHashtag);
    }
  };

  // 해시태그를 목록에서 제거하는 함수
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        {/* 장르 설정 */}
        <div className={styles.field}>
          <label className={styles.label}>
            장르 설정 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            캐릭터가 주로 활동할 장르를 선택해 주세요.
            <br />
            사용자들이 장르별로 캐릭터를 찾는 데 도움이 됩니다.
          </p>
          <div className={styles.selectWrapper}>
            <select
              value={genre}
              onChange={e => setGenre(e.target.value as any)}
              className={styles.select}
            >
              <option value="romance">로맨스</option>
              <option value="fantasy">판타지</option>
              <option value="sci-fi">SF</option>
              <option value="daily">일상</option>
              <option value="historical">시대</option>
              <option value="other">기타</option>
            </select>
            <HiChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 타겟 설정 */}
        <div className={styles.field}>
          <label className={styles.label}>
            타겟 설정 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            주로 어떤 사용자를 대상으로 하는지 설정합니다.
            <br />
            콘텐츠 추천에 영향을 줄 수 있습니다.
          </p>
          <div className={styles.selectWrapper}>
            <select
              value={target}
              onChange={e => setTarget(e.target.value as any)}
              className={styles.select}
            >
              <option value="male">남성향</option>
              <option value="female">여성향</option>
              <option value="all">전체</option>
            </select>
            <HiChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 대화 형태 */}
        <div className={styles.field}>
          <label className={styles.label}>
            대화 형태 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            사용자와 어떤 방식으로 상호작용할지 선택합니다.
            <br />
            1:1 롤플레잉 또는 특정 상황 시뮬레이션이 가능합니다.
          </p>
          <div className={styles.selectWrapper}>
            <select
              value={conversationType}
              onChange={e => setConversationType(e.target.value as any)}
              className={styles.select}
            >
              <option value="roleplay">1 : 1 롤플레잉</option>
              <option value="simulation">시뮬레이션</option>
            </select>
            <HiChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 사용자 정보 필터 */}
        <div className={styles.field}>
          <label className={styles.label}>
            사용자 정보 필터 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            캐릭터가 사용자의 프로필 정보를 기억하는 방식을 설정합니다.
            <br />
            '고정'은 역할극의 몰입감을 높여줍니다.
          </p>
          <div className={styles.selectWrapper}>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value as any)}
              className={styles.select}
            >
              <option value="initial">초기 설정 (실시간 반영)</option>
              <option value="fixed">고정 (대화 시작 시점)</option>
            </select>
            <HiChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 해시태그 */}
        <div className={styles.field}>
          <label className={styles.label}>
            해시태그 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            캐릭터의 특징이나 세계관을 나타내는 키워드를 추가해 보세요.
          </p>

          <div className={styles.hashtagDisplayArea}>
            {hashtags.length > 0 ? (
              hashtags.map(tag => (
                <div key={tag} className={styles.hashtagItem}>
                  <span>{tag}</span>
                  <button onClick={() => removeHashtag(tag)} className={styles.removeHashtagButton}>
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.noHashtagsText}>해시태그를 1개 이상 추가해 주세요.</p>
            )}
          </div>

          {/* 버튼 클릭 시 Drawer가 열리도록 수정 */}
          <button className={styles.addHashtagButton} onClick={handleOpenDrawer}>
            해시태그 추가
          </button>
        </div>

        {/* 공개 범위 */}
        <div className={styles.field}>
          <label className={styles.label}>
            공개 범위 <span className={styles.required}>*</span>
          </label>
          <p className={styles.caption}>
            캐릭터의 공개 상태를 설정합니다.
            <br />
            비공개, 전체 공개, 또는 링크를 가진 사람에게만 공개할 수 있습니다.
          </p>
          <div className={styles.selectWrapper}>
            <select
              value={visibility}
              onChange={e => setVisibility(e.target.value as any)}
              className={styles.select}
            >
              <option value="private">비공개</option>
              <option value="public">전체 공개</option>
              <option value="link">링크 공개</option>
            </select>
            <HiChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 댓글 기능 */}
        <div className={styles.field}>
          <label className={styles.label}>댓글 기능</label>
          <p className={styles.caption}>
            캐릭터 프로필에 다른 사용자들이 댓글을 남길 수 있는지 설정합니다.
          </p>
          <select
            value={commentsEnabled ? 'on' : 'off'}
            onChange={e => setCommentsEnabled(e.target.value === 'on')}
            className={styles.select}
          >
            <option value="on">사용</option>
            <option value="off">사용 안 함</option>
          </select>
        </div>
      </div>

      <div className={styles.step2ButtonContainer}>
        <button onClick={onPrev} className={styles.Button}>
          이전 단계
        </button>

        <button onClick={onNext} className={styles.Button} disabled={!isFormValid}>
          캐릭터 등록하기
        </button>
      </div>

      <HashtagDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onAddHashtag={handleAddHashtag}
        existingHashtags={hashtags}
        onRemoveHashtag={removeHashtag}
      />
    </section>
  );
}
