'use client';

import Link from 'next/link';
import styles from '../error.module.scss';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.error}>
      <p className={styles.error__code}>500</p>
      <h1 className={styles.error__title}>Failed to load blog</h1>
      <p className={styles.error__description}>
        We couldn&rsquo;t fetch the content. You can try again or return home.
      </p>
      {error.digest && (
        <p className={styles.error__digest}>Error ID: {error.digest}</p>
      )}
      <div className={styles.error__actions}>
        <button className={styles.error__retry} onClick={reset}>
          Try again
        </button>
        <Link href="/" className={styles.error__link}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
