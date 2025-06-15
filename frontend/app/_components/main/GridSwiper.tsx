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
import styles from './GridSwiper.module.css';

// data (추후에 수정 및 api 연결 예정)
import slideData from '../../../public/data/MainSlide.json';

export default function GridSwiper() {
  // reset data
  const slides = slideData;

  return (
    <div className={styles.container}>
      {/* title */}
      <div className={styles.title}>이것만은 꼭!</div>
      <div className={styles.subTitle}>AI에게 추천받은 캐릭터들을 소개합니다.</div>

      <div className={styles.grid}>
        {slides.map(({ src, title, subtitle, label, tags, color }, i) => (
          // <div key={i} className={styles.characterCard} style={{ border: `3px solid ${color}` }}>

          <div key={i} className={styles.card}>
            {/* img */}
            <img src={src} alt={`slide-${i}`} className={styles.img} />
            <div className={styles.overLay}>
              {/* label */}
              <div className={styles.labelWrapper}>
                <p className={styles.label}>{label}</p>
              </div>
              {/* info */}
              <div className={styles.info}>
                <p className={styles.name}>{title}</p>
                <p className={styles.description}>
                  {/* Description */}
                  {subtitle.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                {/* tagList */}
                <div className={styles.tagList}>
                  {tags.map((tag, idx) => (
                    <p key={idx} className={styles.tag}>
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
