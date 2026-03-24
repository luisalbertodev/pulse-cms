import type {
  TypeBlogPostWithoutUnresolvableLinksResponse,
  TypePageWithoutUnresolvableLinksResponse,
} from '@/@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAllBlogPostSlugs,
  getBlogPostBySlug,
  getBlogPosts,
  getEntryById,
  getPageBySlug,
} from './contentful';

const { mockGetEntries, mockGetEntry } = vi.hoisted(() => ({
  mockGetEntries: vi.fn(),
  mockGetEntry: vi.fn(),
}));

vi.mock('contentful', () => ({
  createClient: vi.fn(() => ({
    withoutUnresolvableLinks: {
      getEntries: mockGetEntries,
      getEntry: mockGetEntry,
    },
  })),
}));

const blogPostFixture = {
  sys: {
    id: 'post-1',
    type: 'Entry',
    contentType: { sys: { id: 'blogPost', type: 'Link', linkType: 'ContentType' } },
  },
  fields: {
    title: 'Test Post',
    slug: 'test-post',
    excerpt: 'A test excerpt.',
    body: { nodeType: 'document', data: {}, content: [] },
    author: 'Test Author',
    publishDate: '2024-01-01',
  },
  metadata: { tags: [] },
} as unknown as TypeBlogPostWithoutUnresolvableLinksResponse;

const pageFixture = {
  sys: {
    id: 'page-1',
    type: 'Entry',
    contentType: { sys: { id: 'page', type: 'Link', linkType: 'ContentType' } },
  },
  fields: {
    title: 'Home',
    slug: '/',
    seoTitle: 'Home — Pulse',
    seoDescription: 'Pulse marketing site',
    sections: [],
  },
  metadata: { tags: [] },
} as unknown as TypePageWithoutUnresolvableLinksResponse;

beforeEach(() => {
  mockGetEntries.mockReset();
  mockGetEntry.mockReset();
});

describe('getPageBySlug', () => {
  it('should return the page entry when found', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [pageFixture] });

    // Act.
    const actual = await getPageBySlug('/');

    // Assert.
    expect(actual).toEqual(pageFixture);
  });

  it('should return null when no page matches the slug', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [] });

    // Act.
    const actual = await getPageBySlug('/nonexistent');

    // Assert.
    expect(actual).toBeNull();
  });
});

describe('getBlogPosts', () => {
  it('should return an array of blog posts', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [blogPostFixture] });

    // Act.
    const actual = await getBlogPosts();

    // Assert.
    expect(actual).toEqual([blogPostFixture]);
  });

  it('should return an empty array when no posts exist', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [] });

    // Act.
    const actual = await getBlogPosts();

    // Assert.
    expect(actual).toEqual([]);
  });

  it('should pass the limit to the query', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [] });

    // Act.
    await getBlogPosts(5);

    // Assert.
    expect(mockGetEntries).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 5 }),
    );
  });
});

describe('getBlogPostBySlug', () => {
  it('should return the blog post when found', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [blogPostFixture] });

    // Act.
    const actual = await getBlogPostBySlug('test-post');

    // Assert.
    expect(actual).toEqual(blogPostFixture);
  });

  it('should return null when no post matches the slug', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [] });

    // Act.
    const actual = await getBlogPostBySlug('nonexistent-post');

    // Assert.
    expect(actual).toBeNull();
  });
});

describe('getAllBlogPostSlugs', () => {
  it('should return an array of slug strings extracted from entries', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [blogPostFixture] });

    // Act.
    const actual = await getAllBlogPostSlugs();

    // Assert.
    expect(actual).toEqual(['test-post']);
  });

  it('should return an empty array when no posts exist', async () => {
    // Arrange.
    mockGetEntries.mockResolvedValue({ items: [] });

    // Act.
    const actual = await getAllBlogPostSlugs();

    // Assert.
    expect(actual).toEqual([]);
  });
});

describe('getEntryById', () => {
  it('should return the entry when found', async () => {
    // Arrange.
    mockGetEntry.mockResolvedValue(blogPostFixture);

    // Act.
    const actual = await getEntryById('post-1');

    // Assert.
    expect(actual).toEqual(blogPostFixture);
  });

  it('should return null when the client throws an error', async () => {
    // Arrange.
    mockGetEntry.mockRejectedValue(new Error('Entry not found'));

    // Act.
    const actual = await getEntryById('nonexistent-id');

    // Assert.
    expect(actual).toBeNull();
  });
});
