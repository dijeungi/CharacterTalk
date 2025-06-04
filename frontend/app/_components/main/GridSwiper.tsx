/*
  Route: '/grid-swiper'
  Path: app/_components/main/GridSwiper.tsx
  Description:
    - 이 페이지는 캐릭터 정보를 그리드 형식으로 표시하는 컴포넌트입니다.
    - `MainSlide.json` 데이터를 사용해 각 캐릭터의 이미지를 포함한 정보를 동적으로 렌더링합니다.
    - 각 캐릭터의 이름, 설명, 태그 등을 카드 형태로 표시합니다.
*/

'use client';

// swiper
import 'swiper/css';

// css
import styles from '@/_styles/components/GridSwiper.module.css';

// MainSlider json Data (추후에 수정 및 api 연결 예정)
import slideData from '../../../public/data/MainSlide.json';

export default function GridSwiper() {
  const slides = slideData;

  return (
    <div className={styles.characterSection}>
      {/* 섹션 제목 */}
      <div className={styles.sectionTitle}>이것만은 꼭!</div>
      <div className={styles.sectionSubtitle}>AI에게 추천받은 캐릭터들을 소개합니다.</div>

      {/* 캐릭터 그리드 레이아웃 */}
      <div className={styles.characterGrid}>
        {/* 각 캐릭터 카드 반복 렌더링 */}
        {slides.map(({ src, title, subtitle, label, tags, color }, i) => (
          // <div key={i} className={styles.characterCard} style={{ border: `3px solid ${color}` }}>

          <div key={i} className={styles.characterCard}>
            {/* 캐릭터 이미지 */}
            <img src={src} alt={`slide-${i}`} className={styles.characterImage} />
            <div className={styles.cardOverlay}>
              {/* 캐릭터 레이블 */}
              <div className={styles.characterLabelWrapper}>
                <p className={styles.characterLabel}>{label}</p>
              </div>
              {/* 캐릭터 정보 */}
              <div className={styles.characterInfo}>
                <p className={styles.characterName}>{title}</p>
                <p className={styles.characterDescription}>
                  {/* 설명 텍스트 분리 */}
                  {subtitle.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                {/* 태그 목록 */}
                <div className={styles.characterTagList}>
                  {tags.map((tag, idx) => (
                    <p key={idx} className={styles.characterTag}>
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
