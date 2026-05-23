import styles from './PlaceCardSkeleton.module.css';

export default function PlaceCardSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      {/* Image area shimmer */}
      <div className={`${styles.imageArea} skeleton`} />
      {/* Content shimmer blocks */}
      <div className={styles.contentArea}>
        <div className={`${styles.skelLineBadge} skeleton`} />
        <div className={`${styles.skelLineTitle} skeleton`} />
        <div className={`${styles.skelLine} ${styles.skelLineText} ${styles.skelLineTextHalf} skeleton`} />
        <div className={`${styles.skelLine} ${styles.skelLineText} ${styles.skelLineTextFull} skeleton`} />
        <div className={`${styles.skelLine} ${styles.skelLineText} ${styles.skelLineTextAlmost} skeleton`} />
        <div className={styles.tagsRow}>
          <div className={`${styles.skelTag} ${styles.skelTag1} skeleton`} />
          <div className={`${styles.skelTag} ${styles.skelTag2} skeleton`} />
          <div className={`${styles.skelTag} ${styles.skelTag3} skeleton`} />
        </div>
      </div>
    </div>
  );
}
