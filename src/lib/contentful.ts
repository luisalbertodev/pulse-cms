import { createClient } from 'contentful';
import type {
  TypeBlogPostSkeleton,
  TypeBlogPostWithoutUnresolvableLinksResponse,
  TypePageSkeleton,
  TypePageWithoutUnresolvableLinksResponse,
} from '@/@types';

const deliveryClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: 'preview.contentful.com',
});

function getClient(preview = false) {
  return preview ? previewClient : deliveryClient;
}

export async function getPageBySlug(
  slug: string,
  preview = false,
): Promise<TypePageWithoutUnresolvableLinksResponse | null> {
  const entries = await getClient(preview).withoutUnresolvableLinks.getEntries<TypePageSkeleton>({
    content_type: 'page',
    'fields.slug': slug,
    include: 3,
  });
  return entries.items[0] ?? null;
}

export async function getBlogPosts(
  limit = 10,
  preview = false,
): Promise<TypeBlogPostWithoutUnresolvableLinksResponse[]> {
  const entries = await getClient(preview).withoutUnresolvableLinks.getEntries<TypeBlogPostSkeleton>({
    content_type: 'blogPost',
    order: ['-fields.publishDate'],
    limit,
  });
  return entries.items;
}

export async function getBlogPostBySlug(
  slug: string,
  preview = false,
): Promise<TypeBlogPostWithoutUnresolvableLinksResponse | null> {
  const entries = await getClient(preview).withoutUnresolvableLinks.getEntries<TypeBlogPostSkeleton>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });
  return entries.items[0] ?? null;
}

export async function getAllBlogPostSlugs(): Promise<string[]> {
  const entries = await deliveryClient.withoutUnresolvableLinks.getEntries<TypeBlogPostSkeleton>({
    content_type: 'blogPost',
    select: ['fields.slug'],
  });
  return entries.items.map((item) => item.fields.slug);
}
