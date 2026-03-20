import type { TypeHeroWithoutUnresolvableLinksResponse } from '@/@types';
import styles from './Hero.module.scss';

interface HeroProps {
  entry: TypeHeroWithoutUnresolvableLinksResponse;
}

function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

export default function Hero({ entry }: HeroProps) {
  const { title, subtitle, ctaText, ctaUrl, backgroundImage } = entry.fields;
  const bgUrl = assetUrl(backgroundImage?.fields?.file?.url);

  return (
    <section className={styles.hero}>
      {bgUrl && (
        <img
          src={bgUrl}
          alt=""
          aria-hidden="true"
          className={styles.hero__bg}
        />
      )}
      <div className={styles.hero__overlay} aria-hidden="true" />
      <div className={styles.hero__content}>
        <h1 className={styles.hero__title}>{title}</h1>
        {subtitle && <p className={styles.hero__subtitle}>{subtitle}</p>}
        {ctaText && ctaUrl && (
          <a href={ctaUrl} className={styles.hero__cta}>
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
