import type { MetadataRoute } from 'next';
import { getAllBlogPostSlugs } from '@/lib/contentful';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pulse-cms-eight.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllBlogPostSlugs();

  const blogRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogRoutes,
  ];
}
