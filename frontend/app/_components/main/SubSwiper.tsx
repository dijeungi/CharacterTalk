/*
  Route: '/sub-banner'
  Path: app/_components/main/SubSwiper.tsx
  Description:
    - 이 페이지는 서브 배너 슬라이드를 관리하며, `swiper` 라이브러리의 페이드 효과를 사용하여 슬라이드를 전환합니다.
    - `SubSlide.json` 데이터를 이용해 각 슬라이드를 동적으로 렌더링하고, 3초마다 자동으로 슬라이드가 전환됩니다.
    - 슬라이드 전환에 따라 현재 인덱스를 업데이트하여 페이지 상단에 슬라이드 번호를 표시합니다.
*/

'use client';

// default
import { useState } from 'react';

// Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// css
import styles from './SubSwiper.module.css';

// data
import slideData from '../../../public/data/SubSlide.json';

export default function SubBanner() {
  // 상태 초기화
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.container}>
      {/* Swiper */}
      <Swiper
        className={styles.banner}
        loop={true}
        effect="fade"
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSlideChange={swiper => setCurrentIndex(swiper.realIndex)}
      >
        {slideData.map(({ src, title, subtitle }, i) => (
          <SwiperSlide key={i}>
            <div className={styles.card}>
              <img src={src} alt={`Slide ${i + 1}`} className={styles.img} />
              <div className={styles.textOverlay}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.subtitle}>{subtitle}</p>
              </div>
              <span className={styles.pagination}>
                {currentIndex + 1} / {slideData.length}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
