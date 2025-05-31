'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from '@/_styles/components/SubSwiper.module.css';
import slideData from '@/../public/data/SubSlide.json';

export default function SubBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.Container}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        // allowTouchMove={}
        style={{ width: '100%' }}
        onSlideChange={swiper => setCurrentIndex(swiper.realIndex)}
      >
        {slideData.map(({ src, title, subtitle }, i) => (
          <SwiperSlide key={i}>
            <div className={styles.Box}>
              <img src={src} alt={`Slide ${i + 1}`} className={styles.Image} />
              <div className={styles.TextOverlay}>
                <h3 className={styles.Title}>{title}</h3>
                <p className={styles.Subtitle}>{subtitle}</p>
              </div>
              <span className={styles.Pagination}>
                {currentIndex + 1} / {slideData.length}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
