import styles from './loading.module.scss';

export default function BlogLoading() {
  return (
    <section className={styles.section}>
      <div className={styles.section__inner}>
        <div className={styles.section__header}>
          <div className={styles.skeleton__heading} />
          <div className={styles.skeleton__subheading} />
        </div>
        <div className={styles.section__grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.card__image} />
              <div className={styles.card__body}>
                <div className={styles.skeleton__meta} />
                <div className={styles.skeleton__title} />
                <div className={styles.skeleton__title_short} />
                <div className={styles.skeleton__excerpt} />
                <div className={styles.skeleton__excerpt_short} />
                <div className={styles.skeleton__link} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
