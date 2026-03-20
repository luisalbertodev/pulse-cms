# Testing Conventions — Pulse CMS

## Philosophy

Tests describe behavior from the consumer's perspective, not implementation details. Each test answers: "given this scenario, what outcome does the consumer expect?" If you find yourself describing how the code works internally (prepends, appends, calls, iterates), rewrite the description to express what the consumer observes.

We follow BDD for naming and TDD for workflow: write the test first, see it fail, make it pass.

## BDD Naming

Bad — describes implementation:
- "should prepend https: when URL starts with //"
- "should call getEntries with content_type page"
- "should return null when items array is empty"

Good — describes behavior from consumer's perspective:
- "should resolve protocol-relative URLs to a valid https URL"
- "should retrieve the page matching the given slug"
- "should indicate no page exists for an unknown slug"

The describe block names the subject. The it block describes the observable behavior or expected outcome.

```typescript
describe('assetUrl', () => {
  it('should resolve protocol-relative URLs to a valid https URL', () => {});
  it('should leave fully qualified URLs unchanged', () => {});
  it('should return undefined when no URL is provided', () => {});
});
```

For components, describe what the user sees or can interact with:

```typescript
describe('Hero', () => {
  it('should display the main heading with the provided title', () => {});
  it('should present a call-to-action linking to the target URL', () => {});
  it('should show the background image behind the content', () => {});
});
```

## Structure

Tests live next to their module: `utils.ts` → `utils.test.ts`, `Hero.tsx` → `Hero.test.tsx`.

```
src/
  lib/
    utils.ts
    utils.test.ts
    contentful.ts
    contentful.test.ts
  components/
    Hero/
      Hero.tsx
      Hero.test.tsx
    BlogCard/
      BlogCard.tsx
      BlogCard.test.tsx
```

## Arrange / Act / Assert

Every test body follows this pattern with explicit comments:

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

- **Arrange**: set up inputs, mocks, fixtures. Name the variable for what it represents.
- **Act**: call the function or perform the interaction. Store the result in `actual`.
- **Assert**: verify `actual` against the expected outcome. One logical assertion per test.

## Component Testing Pattern — getView Factory

Every component test uses an async `getView` factory that returns a Promise. The factory encapsulates rendering and exposes a semantic interaction API. This decouples "how to interact" from "what to verify" and ensures async safety throughout.

All functions inside the returned object must be async, even if the current implementation doesn't require it. This guarantees consistency and prevents breaking tests when interactions become async in the future.

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from './Hero';

const defaultEntry = createHeroEntry();

describe('Hero', () => {
  const getView = async (overrides?: Partial<typeof defaultEntry.fields>) => {
    const entry = overrides
      ? createHeroEntry(overrides)
      : defaultEntry;

    const target = render(<Hero entry={entry} />);

    const getTitle = async () =>
      screen.getByRole('heading', { level: 1 });

    const getSubtitle = async () =>
      screen.getByText(entry.fields.subtitle);

    const getCtaLink = async () =>
      screen.getByRole('link', { name: entry.fields.ctaText });

    const getBackgroundImage = async () =>
      target.container.querySelector<HTMLImageElement>('img');

    return {
      target,
      getTitle,
      getSubtitle,
      getCtaLink,
      getBackgroundImage,
    };
  };

  it('should display the main heading with the provided title', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getTitle();

    // Assert.
    expect(actual).toHaveTextContent('Productivity that adapts to you');
  });

  it('should present a call-to-action linking to the target URL', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getCtaLink();

    // Assert.
    expect(actual).toHaveAttribute('href', 'https://example.com/signup');
  });
});
```

Rules for getView:
- Always returns a Promise (async function)
- Every function in the returned object is async
- Returns getter/interaction functions, never raw DOM nodes
- Accepts optional overrides to customize props per test
- Default props come from a fixture factory defined at the top of the describe block
- Use `screen.getByRole` and `screen.getByText` over `querySelector` when possible

## Fixtures

Define typed fixtures that match the generated Contentful types. Never use `as any`. Use the `WithoutUnresolvableLinksResponse` types from `@/@types`.

Create factory functions for reusable fixtures:

```typescript
function createHeroEntry(
  overrides?: Partial<HeroFields>
): TypeHeroWithoutUnresolvableLinksResponse {
  return {
    sys: {
      id: 'hero-1',
      type: 'Entry',
      contentType: {
        sys: { id: 'hero', type: 'Link', linkType: 'ContentType' },
      },
      // ... minimal sys fields needed
    },
    fields: {
      internalName: 'Home Hero',
      title: 'Productivity that adapts to you',
      subtitle: 'Pulse helps teams organize and deliver work faster.',
      ctaText: 'Start Free Trial',
      ctaUrl: 'https://example.com/signup',
      backgroundImage: {
        sys: { id: 'asset-1', type: 'Asset' },
        fields: {
          title: 'Hero background',
          file: { url: '//images.ctfassets.net/space/hero.jpg' },
        },
      },
      ...overrides,
    },
    metadata: { tags: [] },
  };
}
```

## Mocking

Use `vi.mock` for external modules. Mock at the module boundary, not internals.

```typescript
vi.mock('@/lib/contentful', () => ({
  getBlogPostBySlug: vi.fn(),
  getPageBySlug: vi.fn(),
}));

import { getBlogPostBySlug } from '@/lib/contentful';
const mockGetBlogPost = vi.mocked(getBlogPostBySlug);

it('should indicate the post was not found for an unknown slug', async () => {
  // Arrange.
  mockGetBlogPost.mockResolvedValue(null);

  // Act.
  const actual = await GET(request);

  // Assert.
  expect(actual.status).toEqual(404);
});
```

For Next.js modules:

```typescript
vi.mock('next/headers', () => ({
  draftMode: vi.fn(() => ({ isEnabled: false })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
```

## Do

- Describe behavior from the consumer's perspective
- Use async getView pattern for all component tests
- Use typed fixture factories matching generated Contentful types
- Mock at module boundaries
- One logical assertion per test
- Name variables descriptively: `actual`, `expected`, not `result`, `res`, `data`
- Test edge cases: undefined inputs, empty arrays, missing optional fields
- Keep all getView functions async for consistency and future-proofing

## Don't

- Don't describe implementation in test names (no "should call", "should prepend", "should iterate")
- Don't test implementation details (internal state, private methods, call order)
- Don't use `as any` — type your fixtures properly
- Don't use snapshot tests — they verify structure, not behavior
- Don't test styling or CSS classes
- Don't mock what you don't own unless at the module boundary
- Don't write tests that pass when the code is broken
- Don't put multiple actions or unrelated assertions in a single test
- Don't use synchronous functions in getView — everything is async

## Test Categories

**Unit tests** (utils, pure functions): no mocks needed, test input → output.

**Component tests** (Hero, BlogCard, RichTextRenderer): use async getView pattern, mock data via fixture factories, verify rendered output.

**Integration tests** (API routes): mock external dependencies (contentful, next/headers, next/cache), test the full request → response flow.

## Running Tests

```bash
npm run test        # watch mode
npm run test:run    # single run
```
