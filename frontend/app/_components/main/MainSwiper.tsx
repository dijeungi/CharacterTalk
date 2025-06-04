/*
  Route: '/'
  Path: app/_components/main/MainSwiper.tsx
  Description:
    - 이 페이지는 메인 페이지에 표시되는 슬라이드 쇼를 관리합니다.
    - `swiper` 라이브러리를 사용해 자동 슬라이드 기능을 구현하며, `MainSlide.json` 데이터를 사용해 각 슬라이드를 동적으로 렌더링합니다.
    - 현재 날짜를 표시하고, 각 슬라이드의 상세 정보를 화면에 표시합니다.
*/

'use client';

// Swiper
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// css
import styles from '@/_styles/components/MainSwiper.module.css';

// React Hooks
import { useMemo, useState } from 'react';

// Slide json Data
import slideData from '../../../public/data/MainSlide.json';

export default function MainSwiper() {
  const slides = slideData;
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 금일 날짜 계산
  const today = useMemo(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  }, []);

  return (
    <div className={styles.swiperContainer}>
      {/* Title */}
      <div className={styles.swiperTitle}>
        투데이 <span className={styles.currentDate}>{today}</span>
      </div>

      {/* Swiper */}
      <Swiper
        loop={true}
        centeredSlides={true}
        spaceBetween={15}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSlideChange={swiper => setCurrentIndex(swiper.realIndex)}
        modules={[Autoplay]}
        className={styles.swiperBanner}
      >
        {slides.map(({ src, title, subtitle, label, tags, link, color }, i) => (
          <SwiperSlide key={i} style={{ height: '100%' }}>
            <div className={styles.swiperCard} style={{ border: `3px solid ${color}` }}>
              <span className={styles.swiperPagination}>
                {currentIndex + 1} / {slides.length}
              </span>
              <img src={src} alt={`slide-${i}`} className={styles.swiperImage} />
              <div className={styles.cardTextOverlay}>
                <div className={styles.cardLabelWrapper}>
                  <p className={styles.cardLabel}>{label}</p>
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.cardTitle}>{title}</p>
                  <p className={styles.cardSubtitle}>
                    {subtitle.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <div className={styles.tagWrapper}>
                    {tags.map((tag, idx) => (
                      <p key={idx} className={styles.cardTag}>
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
