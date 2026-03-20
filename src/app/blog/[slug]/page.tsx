import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPostSlugs } from '@/lib/contentful';
import RichTextRenderer from '@/components/RichTextRenderer/RichTextRenderer';
import styles from './page.module.scss';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.fields.title,
    description: post.fields.excerpt,
  };
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const post = await getBlogPostBySlug(slug, preview);

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
          <img
            src={imageUrl}
            alt={imageAlt}
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
