/**
 * @file      frontend/app/(routes)/(private)/characters/[code]/SkeletonUI.tsx
 * @desc      Component: 캐릭터 상세 페이지 로딩 상태를 위한 MUI Skeleton UI 컴포넌트 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import styles from '@/app/(routes)/(private)/characters/[code]/page.module.css';

import Skeleton from '@mui/material/Skeleton';

export default function SkeletonUI() {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        {/* 이미지 스켈레톤 */}
        <Skeleton variant="rectangular" className={styles.imageWrapper} />
        {/* 버튼 스켈레톤 */}
        <Skeleton variant="rectangular" height={50} style={{ borderRadius: '12px' }} />
      </div>

      <div className={styles.rightColumn}>
        <section className={styles.headerSection}>
          {/* 제목 스켈레톤 */}
          <Skeleton variant="text" width="60%" height={48} />
          {/* 제작자 스켈레톤 */}
          <Skeleton variant="text" width="30%" height={24} />
          {/* 해시태그 스켈레톤 */}
          {/* <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Skeleton variant="circular" width={60} height={28} />
            <Skeleton variant="circular" width={60} height={28} />
            <Skeleton variant="circular" width={80} height={28} />
          </div> */}
          {/* 한 줄 소개 스켈레톤 */}
          <Skeleton variant="text" style={{ marginTop: '1rem' }} />
          <Skeleton variant="text" width="80%" />
        </section>

        <section className={styles.detailsSection}>
          {/* 상세 정보 스켈레톤 (2번 반복) */}
          <div>
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </div>
          <div>
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </div>
        </section>
      </div>
    </div>
  );
}
