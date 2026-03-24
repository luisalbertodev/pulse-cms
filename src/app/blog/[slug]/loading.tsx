import styles from './loading.module.scss';

export default function BlogPostLoading() {
  return (
    <article className={styles.post}>
      <header className={styles.post__header}>
        <div className={styles.post__header_inner}>
          <div className={styles.skeleton__meta} />
          <div className={styles.skeleton__title} />
          <div className={styles.skeleton__title_short} />
        </div>
      </header>

      <div className={styles.post__cover}>
        <div className={styles.skeleton__cover} />
      </div>

      <div className={styles.post__body}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton__paragraph} />
        ))}
        <div className={styles.skeleton__paragraph_short} />
      </div>
    </article>
  );
}
