import { Suspense } from 'react';
import {
  isTypeHero,
  isTypeSectionBlogList,
  type TypeHeroWithoutUnresolvableLinksResponse,
  type TypeSectionBlogListWithoutUnresolvableLinksResponse,
  type TypePageWithoutUnresolvableLinksResponse,
} from '@/@types';
import Hero from '@/components/Hero/Hero';
import BlogListSection from '@/components/BlogListSection/BlogListSection';
import BlogListLoading from '@/app/blog/loading';

type PageSections = NonNullable<
  TypePageWithoutUnresolvableLinksResponse['fields']['sections']
>;

interface SectionRendererProps {
  sections: PageSections;
  preview?: boolean;
}

export default function SectionRenderer({
  sections,
  preview = false,
}: SectionRendererProps) {
  const resolved = sections.filter(
    (s): s is NonNullable<PageSections[number]> => s != null,
  );

  return (
    <>
      {resolved.map((section) => {
        if (isTypeHero(section)) {
          return (
            <Hero
              key={section.sys.id}
              entry={section as TypeHeroWithoutUnresolvableLinksResponse}
            />
          );
        }
        if (isTypeSectionBlogList(section)) {
          return (
            <Suspense key={section.sys.id} fallback={<BlogListLoading />}>
              <BlogListSection
                entry={section as TypeSectionBlogListWithoutUnresolvableLinksResponse}
                preview={preview}
              />
            </Suspense>
          );
        }
        return null;
      })}
    </>
  );
}
