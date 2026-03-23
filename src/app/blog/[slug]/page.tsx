import Image from 'next/image';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCachedBlogPostBySlug, getCachedAllBlogPostSlugs } from '@/lib/cached-contentful';
import { assetUrl, formatDate } from '@/lib/utils';
import RichTextRenderer from '@/components/RichTextRenderer/RichTextRenderer';
import styles from './page.module.scss';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getCachedAllBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedBlogPostBySlug(slug);
  if (!post) return {};
  const featuredImageUrl = assetUrl(post.fields.featuredImage?.fields?.file?.url);
  return {
    title: post.fields.title,
    description: post.fields.excerpt,
    openGraph: {
      title: post.fields.title,
      description: post.fields.excerpt,
      ...(featuredImageUrl && { images: [{ url: featuredImageUrl }] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const post = await getCachedBlogPostBySlug(slug, preview);

  if (!post) notFound();

  const { title, featuredImage, author, publishDate, body } = post.fields;
  const imageUrl = assetUrl(featuredImage?.fields?.file?.url);
  const imageAlt = featuredImage?.fields?.title ?? title;

  return (
    <article className={styles.post}>
      <header className={styles.post__header}>
        <div className={styles.post__header_inner}>
          <div className={styles.post__meta}>
            {publishDate && (
              <time dateTime={publishDate}>{formatDate(publishDate)}</time>
            )}
            {author && publishDate && <span aria-hidden="true">·</span>}
            {author && <span>{author}</span>}
          </div>
          <h1 className={styles.post__title}>{title}</h1>
        </div>
      </header>

      {imageUrl && (
        <div className={styles.post__cover}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            className={styles.post__cover_image}
          />
        </div>
      )}

      <div className={styles.post__body}>
        {body && <RichTextRenderer document={body} />}
      </div>
    </article>
  );
}
