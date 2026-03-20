import Link from 'next/link';
import type { TypeBlogPost } from '@/@types';
import type { ChainModifiers, LocaleCode } from 'contentful';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
  entry: TypeBlogPost<ChainModifiers, LocaleCode>;
}

function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogCard({ entry }: BlogCardProps) {
  const fields = entry.fields as {
    title: string;
    slug: string;
    excerpt?: string;
    featuredImage?: { fields?: { file?: { url?: string }; title?: string } };
    author?: string;
    publishDate?: string;
  };

  const imageUrl = assetUrl(fields.featuredImage?.fields?.file?.url);
  const imageAlt: string = fields.featuredImage?.fields?.title ?? fields.title;

  return (
    <article className={styles.card}>
      {imageUrl && (
        <div className={styles['card__image-wrapper']}>
          <img
            src={imageUrl}
            alt={imageAlt}
            className={styles.card__image}
          />
        </div>
      )}
      <div className={styles.card__body}>
        <div className={styles.card__meta}>
          {fields.publishDate && <time dateTime={fields.publishDate}>{formatDate(fields.publishDate)}</time>}
          {fields.author && fields.publishDate && <span aria-hidden="true">·</span>}
          {fields.author && <span>{fields.author}</span>}
        </div>
        <h2 className={styles.card__title}>
          <Link href={`/blog/${fields.slug}`}>{fields.title}</Link>
        </h2>
        {fields.excerpt && <p className={styles.card__excerpt}>{fields.excerpt}</p>}
        <div className={styles.card__footer}>
          <Link href={`/blog/${fields.slug}`} className={styles.card__link}>
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
