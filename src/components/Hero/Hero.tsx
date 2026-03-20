import type { TypeHero } from '@/@types';
import type { ChainModifiers, LocaleCode } from 'contentful';
import styles from './Hero.module.scss';

interface HeroProps {
  entry: TypeHero<ChainModifiers, LocaleCode>;
}

function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

export default function Hero({ entry }: HeroProps) {
  const fields = entry.fields as {
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaUrl?: string;
    backgroundImage?: { fields?: { file?: { url?: string } } };
  };
  const bgUrl = assetUrl(fields.backgroundImage?.fields?.file?.url);

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
        <h1 className={styles.hero__title}>{fields.title}</h1>
        {fields.subtitle && <p className={styles.hero__subtitle}>{fields.subtitle}</p>}
        {fields.ctaText && fields.ctaUrl && (
          <a href={fields.ctaUrl} className={styles.hero__cta}>
            {fields.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
