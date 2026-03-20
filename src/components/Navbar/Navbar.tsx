import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__inner}>
        <Link href="/" className={styles.navbar__logo}>
          Pulse
        </Link>
        <nav aria-label="Main navigation">
          <ul className={styles.navbar__nav}>
            <li>
              <Link href="/" className={styles.navbar__link}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/blog" className={styles.navbar__link}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
