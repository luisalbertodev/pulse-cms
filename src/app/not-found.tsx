import Link from 'next/link';
import styles from './not-found.module.scss';

export const metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <p className={styles.notFound__code}>404</p>
      <h1 className={styles.notFound__title}>Page not found</h1>
      <p className={styles.notFound__description}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link href="/" className={styles.notFound__link}>
        Back to home
      </Link>
    </div>
  );
}
