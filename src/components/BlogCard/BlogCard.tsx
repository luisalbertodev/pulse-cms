import Link from 'next/link';
import type { TypeBlogPostWithoutUnresolvableLinksResponse } from '@/@types';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
  entry: TypeBlogPostWithoutUnresolvableLinksResponse;
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
  const { title, slug, excerpt, featuredImage, author, publishDate } = entry.fields;
  const imageUrl = assetUrl(featuredImage?.fields?.file?.url);
  const imageAlt = featuredImage?.fields?.title ?? title;

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
          {publishDate && <time dateTime={publishDate}>{formatDate(publishDate)}</time>}
          {author && publishDate && <span aria-hidden="true">·</span>}
          {author && <span>{author}</span>}
        </div>
        <h2 className={styles.card__title}>
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        {excerpt && <p className={styles.card__excerpt}>{excerpt}</p>}
        <div className={styles.card__footer}>
          <Link href={`/blog/${slug}`} className={styles.card__link}>
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
