# Testing Conventions — Pulse CMS

## Philosophy

Tests describe behavior from the consumer's perspective, not implementation details. Each test answers: "given this scenario, what outcome does the consumer expect?"

BDD for naming, TDD for workflow: write the test first, see it fail, make it pass.

## BDD Naming

Bad — describes implementation:
- "should prepend https: when URL starts with //"
- "should call getEntries with content_type page"

Good — describes behavior from consumer's perspective:
- "should resolve protocol-relative URLs to a valid https URL"
- "should retrieve the page matching the given slug"
- "should display the main heading with the provided title"
- "should link the title to the corresponding blog post page"

The `describe` block names the subject. The `it` block describes observable behavior.

## Structure

Tests live next to their module:

```
src/lib/utils.ts            → src/lib/utils.test.ts
src/components/Hero/Hero.tsx → src/components/Hero/Hero.test.tsx
src/app/api/draft/route.ts  → src/app/api/draft/route.test.ts
```

## Arrange / Act / Assert

Every test body uses this pattern with explicit comments:

```typescript
it('should resolve protocol-relative URLs to a valid https URL', () => {
  // Arrange.
  const url = '//images.ctfassets.net/space/image.jpg';

  // Act.
  const actual = assetUrl(url);

  // Assert.
  expect(actual).toEqual('https://images.ctfassets.net/space/image.jpg');
});
```

- **Arrange**: set up inputs, mocks, fixtures.
- **Act**: perform the operation. Store the result in `actual`.
- **Assert**: verify `actual`. One logical assertion per test.

## Component Testing — getView Factory

Every component test uses an async `getView` factory that encapsulates rendering and exposes semantic getters and actions. Tests never interact with DOM directly or import `userEvent`.

```typescript
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('BlogCard', () => {
  const getView = async (overrides?: Partial<typeof defaultEntry.fields>) => {
    const entry = overrides ? createEntry(overrides) : defaultEntry;
    const user = userEvent.setup();
    const target = render(<BlogCard entry={entry} />);

    // Getters — what the user sees
    const getTitleLink = async () =>
      screen.getByRole('link', { name: entry.fields.title });

    const getExcerpt = async () =>
      screen.getByText(entry.fields.excerpt);

    // Actions — what the user does
    const clickTitle = async () => {
      const link = await getTitleLink();
      await user.click(link);
    };

    return { target, getTitleLink, getExcerpt, clickTitle };
  };

  it('should link the title to the corresponding blog post page', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getTitleLink();

    // Assert.
    expect(actual).toHaveAttribute('href', '/blog/my-post-slug');
  });
});
```

### getView rules

- Always async, returns a Promise
- Every getter and action inside is async
- `userEvent.setup()` is called once inside getView
- Getters return elements, actions perform interactions
- Accepts optional overrides to customize props per test
- Default props come from a fixture factory at the top of the describe
- Prefer `screen.getByRole` and `screen.getByText` over `querySelector`

## Navigation and Links

This project uses Next.js App Router with `<Link>` components (not React Router). There's no injectable `history` object.

**For presentational components** (Hero, BlogCard): test that the rendered `<a>` has the correct `href`. This is the component's responsibility — routing is Next.js's job.

```typescript
it('should link the title to the corresponding blog post page', async () => {
  // Arrange.
  const view = await getView();

  // Act.
  const actual = await view.getTitleLink();

  // Assert.
  expect(actual).toHaveAttribute('href', '/blog/my-post-slug');
});
```

**For API routes** (draft, revalidate): mock `redirect` from `next/navigation` and verify it was called with the correct path.

```typescript
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import { redirect } from 'next/navigation';
const mockRedirect = vi.mocked(redirect);

it('should redirect to the validated blog post page after enabling draft mode', async () => {
  // Arrange.
  mockGetBlogPost.mockResolvedValue(blogPostFixture);
  const request = createRequest({ secret: 'valid', slug: '/blog/my-post' });

  // Act.
  await GET(request);

  // Assert.
  expect(mockRedirect).toHaveBeenCalledWith('/blog/my-post-slug');
});
```

## Fixtures

Typed fixture factories matching generated Contentful types. Never use `as any`.

```typescript
function createBlogPostEntry(overrides?: Partial<BlogPostFields>) {
  return {
    sys: {
      id: 'post-1',
      type: 'Entry',
      contentType: { sys: { id: 'blogPost', type: 'Link', linkType: 'ContentType' } },
    },
    fields: {
      title: 'Building a Design System',
      slug: 'building-a-design-system',
      excerpt: 'How to build scalable components.',
      author: 'Sarah Mitchell',
      publishDate: '2026-03-18',
      featuredImage: {
        sys: { id: 'asset-1', type: 'Asset' },
        fields: { title: 'Featured', file: { url: '//images.ctfassets.net/img.jpg' } },
      },
      body: { nodeType: 'document', content: [], data: {} },
      ...overrides,
    },
    metadata: { tags: [] },
  };
}
```

## Mocking

Mock at the module boundary with `vi.mock`. Use `vi.mocked()` for type-safe access.

```typescript
vi.mock('@/lib/contentful', () => ({
  getBlogPostBySlug: vi.fn(),
  getPageBySlug: vi.fn(),
}));

import { getBlogPostBySlug } from '@/lib/contentful';
const mockGetBlogPost = vi.mocked(getBlogPostBySlug);
```

For Next.js modules:

```typescript
vi.mock('next/headers', () => ({
  draftMode: vi.fn(() => Promise.resolve({ enable: vi.fn(), disable: vi.fn(), isEnabled: false })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));
```

## Do

- Describe behavior from the consumer's perspective
- Use async getView factory for all component tests
- Encapsulate all interactions inside getView as actions
- Use typed fixture factories
- Mock at module boundaries
- One logical assertion per test
- Test edge cases: undefined, empty arrays, missing optional fields

## Don't

- Don't describe implementation in test names
- Don't test implementation details
- Don't use `as any`
- Don't use snapshot tests
- Don't test styling or CSS classes
- Don't import `userEvent` in test body — only inside getView
- Don't test `window.location` — verify `href` attributes for links, mock `redirect` for API routes
- Don't put multiple unrelated assertions in a single test

## Test Categories

**Unit** (utils, pure functions): no mocks, test input → output.

**Component** (Hero, BlogCard, RichTextRenderer): getView pattern, fixture factories, verify rendered output.

**Integration** (API routes): mock external deps, test request → response flow.

## Running

```bash
npm run test        # watch mode
npm run test:run    # single run
```
