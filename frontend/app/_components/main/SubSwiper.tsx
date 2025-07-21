/**
 * @file      frontend/app/_components/main/SubSwiper.tsx
 * @desc      Component: 서브 배너 슬라이드 UI, 페이드 효과 및 자동 슬라이드 기능
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';

import { useState } from 'react';
import styles from '@/app/_components/main/SubSwiper.module.css';

import 'swiper/css';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import slideData from '@/public/data/SubSlide.json';

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
