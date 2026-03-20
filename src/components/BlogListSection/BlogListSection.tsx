import type { TypeSectionBlogListWithoutUnresolvableLinksResponse } from '@/@types';
import { getBlogPosts } from '@/lib/contentful';
import BlogCard from '@/components/BlogCard/BlogCard';
import styles from './BlogListSection.module.scss';

interface BlogListSectionProps {
  entry: TypeSectionBlogListWithoutUnresolvableLinksResponse;
  preview?: boolean;
}

export default async function BlogListSection({
  entry,
  preview = false,
}: BlogListSectionProps) {
  const { heading, subheading, maxPosts } = entry.fields;
  const posts = await getBlogPosts(maxPosts, preview);

  return (
    <section className={styles.section}>
      <div className={styles.section__inner}>
        <div className={styles.section__header}>
          <h2 className={styles.section__heading}>{heading}</h2>
          {subheading && (
            <p className={styles.section__subheading}>{subheading}</p>
          )}
        </div>
        {posts.length > 0 ? (
          <div className={styles.section__grid}>
            {posts.map((post) => (
              <BlogCard key={post.sys.id} entry={post} />
            ))}
          </div>
        ) : (
          <p className={styles.section__empty}>No posts yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
}
