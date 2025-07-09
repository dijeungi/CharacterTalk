import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import styles from './GridSwiper.module.css';

export default function GridSwiperSkeleton() {
  const skeletonItems = Array.from({ length: 8 });

  return (
    <div className={styles.grid}>
      {skeletonItems.map((_, index) => (
        <div key={index} className={styles.card}>
          {/* 이미지 스켈레톤 */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={170}
            className={styles.imageWrapper}
          />
          <div className={styles.info}>
            {/* 이름 스켈레톤 */}
            <Skeleton variant="text" width="30%" height={24} />
            {/* 한 줄 소개 스켈레톤 */}
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            {/* 제작자 스켈레톤 */}
            <Skeleton variant="text" width="40%" style={{ marginTop: 'auto' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
