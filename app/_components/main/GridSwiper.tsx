'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Grid } from 'swiper/modules';
import styles from '@/_styles/components/GridSwiper.module.css';
import { useMemo, useState } from 'react';
import slideData from '../../../public/data/MainSlide.json';

export default function GridSwiper() {
  const slides = slideData;
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>이것만은 꼭!</div>
      <div className={styles.SubTitle}>AI에게 추천받은 캐릭터들을 소개합니다.</div>

      <div className={styles.Grid}>
        {slides.map(({ src, title, subtitle, label, tags, link, color }, i) => (
          <div key={i} className={styles.Box} style={{ border: `3px solid ${color}` }}>
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
        ))}
      </div>
    </div>
  );
}
