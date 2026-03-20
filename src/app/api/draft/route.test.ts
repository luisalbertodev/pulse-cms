import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('next/headers', () => ({
  draftMode: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/contentful', () => ({
  getBlogPostBySlug: vi.fn(),
}));

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/contentful';
import { GET } from './route';

const mockDraftMode = vi.mocked(draftMode);
const mockRedirect = vi.mocked(redirect);
const mockGetBlogPostBySlug = vi.mocked(getBlogPostBySlug);

const VALID_SECRET = 'test-preview-secret';

function createRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/draft');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return { nextUrl: url } as unknown as NextRequest;
}

function createBlogPostEntry(slug: string) {
  return {
    fields: { slug },
  } as unknown as Awaited<ReturnType<typeof getBlogPostBySlug>>;
}

describe('GET /api/draft', () => {
  beforeEach(() => {
    vi.stubEnv('CONTENTFUL_PREVIEW_SECRET', VALID_SECRET);
    mockDraftMode.mockResolvedValue({ enable: vi.fn(), disable: vi.fn(), isEnabled: false } as never);
    mockGetBlogPostBySlug.mockResolvedValue(null);
    mockRedirect.mockImplementation(() => { throw new Error('NEXT_REDIRECT'); });
  });

  it('should reject requests with an invalid secret', async () => {
    // Arrange.
    const request = createRequest({ secret: 'wrong-secret', slug: '/blog/my-post' });

    // Act.
    const actual = await GET(request);

    // Assert.
    expect(actual.status).toBe(401);
  });

  it('should reject requests that provide no secret', async () => {
    // Arrange.
    const request = createRequest({ slug: '/blog/my-post' });

    // Act.
    const actual = await GET(request);

    // Assert.
    expect(actual.status).toBe(401);
  });

  it('should reject requests with no slug parameter', async () => {
    // Arrange.
    const request = createRequest({ secret: VALID_SECRET });

    // Act.
    const actual = await GET(request);

    // Assert.
    expect(actual.status).toBe(400);
  });

  it('should return not found when the blog post does not exist', async () => {
    // Arrange.
    mockGetBlogPostBySlug.mockResolvedValue(null);
    const request = createRequest({ secret: VALID_SECRET, slug: '/blog/non-existent' });

    // Act.
    const actual = await GET(request);

    // Assert.
    expect(actual.status).toBe(404);
  });

  it('should return not found for slugs that are not blog post paths', async () => {
    // Arrange.
    const request = createRequest({ secret: VALID_SECRET, slug: '/about' });

    // Act.
    const actual = await GET(request);

    // Assert.
    expect(actual.status).toBe(404);
  });

  it('should enable draft mode before redirecting', async () => {
    // Arrange.
    const mockEnable = vi.fn();
    mockDraftMode.mockResolvedValue({ enable: mockEnable, disable: vi.fn(), isEnabled: false } as never);
    mockGetBlogPostBySlug.mockResolvedValue(createBlogPostEntry('my-post'));
    const request = createRequest({ secret: VALID_SECRET, slug: '/blog/my-post' });

    // Act.
    await GET(request).catch(() => {});

    // Assert.
    expect(mockEnable).toHaveBeenCalled();
  });

  it('should redirect to the validated blog post page after enabling draft mode', async () => {
    // Arrange.
    mockGetBlogPostBySlug.mockResolvedValue(createBlogPostEntry('my-post'));
    const request = createRequest({ secret: VALID_SECRET, slug: '/blog/my-post' });

    // Act.
    await GET(request).catch(() => {});

    // Assert.
    expect(mockRedirect).toHaveBeenCalledWith('/blog/my-post');
  });

  it('should look up the blog post using the preview API', async () => {
    // Arrange.
    mockGetBlogPostBySlug.mockResolvedValue(createBlogPostEntry('my-post'));
    const request = createRequest({ secret: VALID_SECRET, slug: '/blog/my-post' });

    // Act.
    await GET(request).catch(() => {});

    // Assert.
    expect(mockGetBlogPostBySlug).toHaveBeenCalledWith('my-post', true);
  });

  it('should use the slug from the resolved entry as the redirect destination', async () => {
    // Arrange.
    mockGetBlogPostBySlug.mockResolvedValue(createBlogPostEntry('canonical-slug'));
    const request = createRequest({ secret: VALID_SECRET, slug: '/blog/canonical-slug' });

    // Act.
    await GET(request).catch(() => {});

    // Assert.
    expect(mockRedirect).toHaveBeenCalledWith('/blog/canonical-slug');
  });
});
