import { isTypeHero, isTypeSectionBlogList } from '@/@types';
import type { ChainModifiers, Entry, EntrySkeletonType, LocaleCode } from 'contentful';
import Hero from '@/components/Hero/Hero';
import BlogListSection from '@/components/BlogListSection/BlogListSection';

interface SectionRendererProps {
  sections: Entry<EntrySkeletonType, ChainModifiers, LocaleCode>[];
  preview?: boolean;
}

export default function SectionRenderer({
  sections,
  preview = false,
}: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        if (isTypeHero(section)) {
          return <Hero key={section.sys.id} entry={section} />;
        }
        if (isTypeSectionBlogList(section)) {
          return (
            <BlogListSection
              key={section.sys.id}
              entry={section}
              preview={preview}
            />
          );
        }
        return null;
      })}
    </>
  );
}
