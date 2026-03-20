import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCachedPageBySlug } from '@/lib/cached-contentful';
import SectionRenderer from '@/components/SectionRenderer/SectionRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCachedPageBySlug('/blog');
  if (!page) return { title: 'Blog' };
  return {
    title: page.fields.seoTitle ?? page.fields.title,
    description: page.fields.seoDescription,
  };
}

export default async function BlogPage() {
  const { isEnabled: preview } = await draftMode();
  const page = await getCachedPageBySlug('/blog', preview);

  if (!page) notFound();

  return (
    <SectionRenderer sections={page.fields.sections ?? []} preview={preview} />
  );
}
