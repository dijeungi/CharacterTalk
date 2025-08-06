import React from 'react';
import skeletonStyles from '@/app/_skeletons/Skeletons.module.css';
import pageStyles from '@/app/(routes)/(public)/characters/[characterCode]/page.module.css';
import chatPageStyles from '@/app/(routes)/(private)/chat/[characterCode]/page.module.css';

/**
 * @description 캐릭터 상세 페이지용 스켈레톤 UI
 */
export const CharacterDetailSkeleton = () => {
  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.leftColumn}>
        <div className={`${pageStyles.imageWrapper} ${skeletonStyles.skeleton}`} />
        <div
          className={`${pageStyles.chatButton} ${skeletonStyles.skeleton} ${skeletonStyles.skeletonChatButton}`}
        />
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

/**
 * @description 채팅 메시지 목록용 스켈레톤 UI
 */
export const ChatMessageSkeleton = () => {
  return (
    <>
      {/* AI 메시지 스켈레톤 */}
      <div className={`${chatPageStyles.messageRow} ${chatPageStyles.ai}`}>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.chatAvatar}`} />
        <div className={skeletonStyles.chatBubbleContainer}>
          <div className={`${skeletonStyles.skeleton} ${skeletonStyles.chatSenderName}`} />
          <div className={`${skeletonStyles.chatBubbleWrapper} ${skeletonStyles.ai}`}>
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.chatBubble}`}
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
      {/* 사용자 메시지 스켈레톤 */}
      <div className={`${chatPageStyles.messageRow} ${chatPageStyles.user}`}>
        <div className={`${skeletonStyles.chatBubbleWrapper} ${skeletonStyles.user}`}>
          <div
            className={`${skeletonStyles.skeleton} ${skeletonStyles.chatBubble}`}
            style={{ width: '50%' }}
          />
        </div>
      </div>
      {/* AI 메시지 스켈레톤 */}
      <div className={`${chatPageStyles.messageRow} ${chatPageStyles.ai}`}>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.chatAvatar}`} />
        <div className={skeletonStyles.chatBubbleContainer}>
          <div className={`${skeletonStyles.skeleton} ${skeletonStyles.chatSenderName}`} />
          <div className={`${skeletonStyles.chatBubbleWrapper} ${skeletonStyles.ai}`}>
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.chatBubble}`}
              style={{ width: '70%' }}
            />
          </div>
        </div>
      </div>
      {/* 사용자 메시지 스켈레톤 */}
      <div className={`${chatPageStyles.messageRow} ${chatPageStyles.user}`}>
        <div className={`${skeletonStyles.chatBubbleWrapper} ${skeletonStyles.user}`}>
          <div
            className={`${skeletonStyles.skeleton} ${skeletonStyles.chatBubble}`}
            style={{ width: '50%' }}
          />
        </div>
      </div>
      {/* AI 메시지 스켈레톤 */}
      <div className={`${chatPageStyles.messageRow} ${chatPageStyles.ai}`}>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.chatAvatar}`} />
        <div className={skeletonStyles.chatBubbleContainer}>
          <div className={`${skeletonStyles.skeleton} ${skeletonStyles.chatSenderName}`} />
          <div className={`${skeletonStyles.chatBubbleWrapper} ${skeletonStyles.ai}`}>
            <div
              className={`${skeletonStyles.skeleton} ${skeletonStyles.chatBubble}`}
              style={{ width: '70%' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
