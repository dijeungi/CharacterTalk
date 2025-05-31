'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import styles from '@/_styles/components/MainSwiper.module.css';
import { useMemo, useState } from 'react';
import slideData from '../../../public/data/MainSlide.json';

export default function MainSwiper() {
  const slides = slideData;
  const today = useMemo(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>
        투데이 <span className={styles.Date}>{today}</span>
      </div>

      <Swiper
        // slidesPerView={'auto'}
        loop={true}
        centeredSlides={true}
        spaceBetween={15}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSlideChange={swiper => setCurrentIndex(swiper.realIndex)}
        modules={[Autoplay]}
        style={{ width: '100%', position: 'relative' }}
      >
        {slides.map(({ src, title, subtitle, label, tags, link, color }, i) => (
          <SwiperSlide key={i} style={{ height: '100%' }}>
            <div className={styles.Box} style={{ border: `3px solid ${color}` }}>
              <span className={styles.Pagination}>
                {currentIndex + 1} / {slides.length}
              </span>
              <img src={src} alt={`slide-${i}`} className={styles.Image} />
              <div className={styles.Text_Box}>
                <div className={styles.Label_Box}>
                  <p className={styles.Label}>{label}</p>
                </div>
                <div className={styles.Explanation_Box}>
                  <p className={styles.Box_Title}>{title}</p>
                  <p className={styles.Box_Subtitle}>
                    {subtitle.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <div className={styles.Tag_Box}>
                    {tags.map((tag, idx) => (
                      <p key={idx} className={styles.Tag}>
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
