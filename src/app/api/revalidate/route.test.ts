import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/contentful', () => ({
  getEntryById: vi.fn(),
}));

import { revalidatePath } from 'next/cache';
import { getEntryById } from '@/lib/contentful';
import { POST } from './route';

const mockRevalidatePath = vi.mocked(revalidatePath);
const mockGetEntryById = vi.mocked(getEntryById);

const VALID_SECRET = 'test-webhook-secret';

function createRequest(options: {
  secret?: string;
  body?: unknown;
}): NextRequest {
  const headers = new Headers();
  if (options.secret !== undefined) {
    headers.set('x-contentful-webhook-secret', options.secret);
  }

  const body = options.body !== undefined ? JSON.stringify(options.body) : undefined;

  return {
    headers,
    json: body !== undefined ? () => Promise.resolve(JSON.parse(body)) : () => Promise.reject(new Error('No body')),
  } as unknown as NextRequest;
}

function createBlogPostEntry(slug: string) {
  return {
    fields: { slug },
  } as unknown as Awaited<ReturnType<typeof getEntryById>>;
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('CONTENTFUL_PREVIEW_SECRET', VALID_SECRET);
    mockGetEntryById.mockResolvedValue(null);
  });

  it('should reject requests with an invalid secret', async () => {
    // Arrange.
    const request = createRequest({ secret: 'wrong-secret', body: {} });

    // Act.
    const actual = await POST(request);

    // Assert.
    expect(actual.status).toBe(401);
  });

  it('should reject requests that provide no secret', async () => {
    // Arrange.
    const request = createRequest({ body: {} });

    // Act.
    const actual = await POST(request);

    // Assert.
    expect(actual.status).toBe(401);
  });

  it('should always revalidate the home page', async () => {
    // Arrange.
    const request = createRequest({ secret: VALID_SECRET, body: {} });

    // Act.
    await POST(request);

    // Assert.
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
  });

  it('should always revalidate the blog listing page', async () => {
    // Arrange.
    const request = createRequest({ secret: VALID_SECRET, body: {} });

    // Act.
    await POST(request);

    // Assert.
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog');
  });

  it('should revalidate the specific blog post page when a blog post is published', async () => {
    // Arrange.
    mockGetEntryById.mockResolvedValue(createBlogPostEntry('my-post'));
    const request = createRequest({
      secret: VALID_SECRET,
      body: { sys: { id: 'entry-123', contentType: { sys: { id: 'blogPost' } } } },
    });

    // Act.
    await POST(request);

    // Assert.
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog/my-post');
  });

  it('should look up the blog post entry by the ID from the webhook payload', async () => {
    // Arrange.
    mockGetEntryById.mockResolvedValue(createBlogPostEntry('my-post'));
    const request = createRequest({
      secret: VALID_SECRET,
      body: { sys: { id: 'entry-123', contentType: { sys: { id: 'blogPost' } } } },
    });

    // Act.
    await POST(request);

    // Assert.
    expect(mockGetEntryById).toHaveBeenCalledWith('entry-123');
  });

  it('should not revalidate a blog post page when the entry cannot be found', async () => {
    // Arrange.
    mockGetEntryById.mockResolvedValue(null);
    const request = createRequest({
      secret: VALID_SECRET,
      body: { sys: { id: 'entry-123', contentType: { sys: { id: 'blogPost' } } } },
    });

    // Act.
    await POST(request);

    // Assert.
    const blogPostPaths = mockRevalidatePath.mock.calls.filter(([path]) => path.startsWith('/blog/'));
    expect(blogPostPaths).toHaveLength(0);
  });

  it('should not revalidate a blog post page for non-blogPost content types', async () => {
    // Arrange.
    const request = createRequest({
      secret: VALID_SECRET,
      body: { sys: { id: 'entry-123', contentType: { sys: { id: 'page' } } } },
    });

    // Act.
    await POST(request);

    // Assert.
    expect(mockGetEntryById).not.toHaveBeenCalled();
  });

  it('should report successful revalidation in the response', async () => {
    // Arrange.
    const request = createRequest({ secret: VALID_SECRET, body: {} });

    // Act.
    const response = await POST(request);
    const actual = await response.json();

    // Assert.
    expect(actual.revalidated).toBe(true);
  });

  it('should handle a webhook payload with no body gracefully', async () => {
    // Arrange.
    const request = createRequest({ secret: VALID_SECRET });

    // Act.
    const actual = await POST(request);

    // Assert.
    expect(actual.status).toBe(200);
  });
});
