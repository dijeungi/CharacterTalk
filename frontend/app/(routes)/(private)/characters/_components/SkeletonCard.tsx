import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={`${styles.skeleton} ${styles.imageWrapper}`} />
      <div className={styles.info}>
        <div className={`${styles.skeleton} ${styles.name}`} />
        <div className={`${styles.skeleton} ${styles.oneliner}`} />
        <div className={`${styles.skeleton} ${styles.oneliner}`} />
      </div>
    </div>
  );
};

export default SkeletonCard;
