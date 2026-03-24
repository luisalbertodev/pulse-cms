'use client';

import Link from 'next/link';
import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.error}>
      <p className={styles.error__code}>500</p>
      <h1 className={styles.error__title}>Something went wrong</h1>
      <p className={styles.error__description}>
        An unexpected error occurred. You can try again or return home.
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
