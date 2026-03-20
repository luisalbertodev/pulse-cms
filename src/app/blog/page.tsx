import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/contentful';
import SectionRenderer from '@/components/SectionRenderer/SectionRenderer';
import type { Entry, EntrySkeletonType, ChainModifiers, LocaleCode } from 'contentful';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('/blog');
  if (!page) return { title: 'Blog' };
  return {
    title: page.fields.seoTitle ?? page.fields.title,
    description: page.fields.seoDescription,
  };
}

export default async function BlogPage() {
  const { isEnabled: preview } = await draftMode();
  const page = await getPageBySlug('/blog', preview);

  if (!page) notFound();

  const sections = (page.fields.sections ?? []) as Entry<
    EntrySkeletonType,
    ChainModifiers,
    LocaleCode
  >[];

  return <SectionRenderer sections={sections} preview={preview} />;
}
