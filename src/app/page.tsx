import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/contentful';
import SectionRenderer from '@/components/SectionRenderer/SectionRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('/');
  if (!page) return {};
  return {
    title: page.fields.seoTitle ?? page.fields.title,
    description: page.fields.seoDescription,
  };
}

export default async function HomePage() {
  const { isEnabled: preview } = await draftMode();
  const page = await getPageBySlug('/', preview);

  if (!page) notFound();

  return (
    <SectionRenderer sections={page.fields.sections ?? []} preview={preview} />
  );
}
