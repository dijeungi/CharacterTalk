/**
 * @file      frontend/app/_skeletons/Skeletons.tsx
 * @desc      Component: 여러 페이지에서 공통으로 사용하는 스켈레톤 UI 모음
 *
 * @author    최준호
 * @update    2025.07.31
 */

import React from 'react';
import skeletonStyles from '@/app/_skeletons/Skeletons.module.css';
import pageStyles from '@/app/(routes)/(public)/characters/[characterCode]/page.module.css';

/**
 * @description 캐릭터 상세 페이지용 스켈레톤 UI
 */
export const CharacterDetailSkeleton = () => {
  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.leftColumn}>
        <div className={`${pageStyles.imageWrapper} ${skeletonStyles.skeleton}`} />
        <div className={`${pageStyles.chatButton} ${skeletonStyles.skeleton} ${skeletonStyles.skeletonChatButton}`} />
      </div>

      <div className={pageStyles.rightColumn}>
        <section className={pageStyles.headerSection}>
          <div className={pageStyles.nameAndCreator}>
            <div className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonName}`} />
            <div className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonCreator}`} />
          </div>
          <div className={pageStyles.hashtagContainer}>
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonHashtag}`}
              style={{ width: '80px' }}
            />
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonHashtag}`}
              style={{ width: '100px' }}
            />
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonHashtag}`}
              style={{ width: '70px' }}
            />
          </div>
          <p className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonOneliner}`} />
        </section>

        <section className={pageStyles.detailsSection}>
          <div className={pageStyles.detailItem}>
            <div className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetailTitle}`} />
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetailContent}`}
              style={{ height: '80px' }}
            />
          </div>
          <div className={pageStyles.detailItem}>
            <div className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetailTitle}`} />
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetailContent}`}
              style={{ height: '100px' }}
            />
          </div>
          <div className={pageStyles.detailItem}>
            <div className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetailTitle}`} />
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetailContent}`}
              style={{ height: '120px' }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * @description 캐릭터 목록 카드용 스켈레톤 UI
 */
export const CharacterCardSkeleton = () => {
  return (
    <div className={skeletonStyles.card}>
      <div className={`${skeletonStyles.skeleton} ${skeletonStyles.cardImageWrapper}`} />
      <div className={skeletonStyles.cardInfo}>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.cardName}`} />
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.cardOneliner}`} />
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.cardOneliner}`} />
      </div>
    </div>
  );
};
