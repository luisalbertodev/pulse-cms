import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCachedPageBySlug } from '@/lib/cached-contentful';
import { assetUrl } from '@/lib/utils';
import SectionRenderer from '@/components/SectionRenderer/SectionRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCachedPageBySlug('/');
  if (!page) return {};
  const ogImageUrl = assetUrl(page.fields.ogImage?.fields?.file?.url);
  return {
    title: page.fields.seoTitle ?? page.fields.title,
    description: page.fields.seoDescription,
    openGraph: {
      title: page.fields.seoTitle ?? page.fields.title,
      description: page.fields.seoDescription,
      ...(ogImageUrl && { images: [{ url: ogImageUrl }] }),
    },
  };
}

export default async function HomePage() {
  const { isEnabled: preview } = await draftMode();
  const page = await getCachedPageBySlug('/', preview);

  if (!page) notFound();

  return (
    <SectionRenderer sections={page.fields.sections ?? []} preview={preview} />
  );
}
