@AGENTS.md

# CLAUDE.md

## Project Overview
Pulse — Marketing site built with Next.js 15 (App Router) + Contentful as headless CMS. SCSS modules for styling. No Tailwind.

## Tech Stack
- Next.js 15 (App Router, Server Components)
- TypeScript (strict)
- Contentful (Content Delivery + Preview APIs)
- SCSS Modules (BEM naming)
- Google Fonts: DM Serif Display (headings), DM Sans (body)

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run generate:types  # Regenerate Contentful types (if configured)
```

## Project Structure
```
src/
  @types/              ← Auto-generated from Contentful. DO NOT edit.
  lib/contentful.ts    ← Client instances + fetch functions
  components/          ← Section components + SectionRenderer mapper
  styles/              ← _variables.scss (tokens) + globals.scss
  app/
    page.tsx           ← Home (fetches Page slug="/")
    blog/page.tsx      ← Blog listing (fetches Page slug="/blog")
    blog/[slug]/page.tsx ← Blog detail (fetches BlogPost by slug)
    api/draft/         ← Enable Draft Mode
    api/disable-draft/ ← Disable Draft Mode
    api/revalidate/    ← Contentful webhook for on-demand ISR
```

## Content Architecture (Contentful)
4 content types. Page is the container. Hero and SectionBlogList are sections. BlogPost is independent.

```
Page (slug="/")
  └── sections: [ Hero, SectionBlogList ]

Page (slug="/blog")
  └── sections: [ SectionBlogList ]

BlogPost (independent, route: /blog/[slug])
```

Page.sections is an ordered array of references. The frontend iterates and renders each by type.

## Core Pattern: Composable Pages with Section Mapper

Every page fetches its Page entry → resolves sections → renders via SectionRenderer.

```typescript
// SectionRenderer.tsx — USE generated type guards, not switch on strings
import { isTypeHero, isTypeSectionBlogList } from '@/@types';

{sections.map((section) => {
  if (isTypeHero(section)) return <Hero key={section.sys.id} entry={section} />;
  if (isTypeSectionBlogList(section)) return <BlogListSection key={section.sys.id} entry={section} preview={preview} />;
  return null;
})}
```

## Generated Types (@types/)
Auto-generated via cf-content-types-generator. Key exports per type:
- `TypeXxxFields` — field definitions
- `TypeXxxSkeleton` — use as generic with contentful client
- `TypeXxx` — resolved entry type
- `isTypeXxx()` — runtime type guard

Use Skeleton types for queries:
```typescript
const entries = await client.getEntries<TypePageSkeleton>({
  content_type: 'page',
  'fields.slug': slug,
  include: 3,
});
```

## Contentful Client Pattern (lib/contentful.ts)
Two clients: delivery (published content) and preview (draft content).
All fetch functions accept `preview: boolean` to toggle between them.

```typescript
const client = preview ? previewClient : deliveryClient;
```

Functions needed:
- `getPageBySlug(slug, preview?)` — include: 3 to resolve nested sections
- `getBlogPosts(limit, preview?)` — ordered by -fields.publishDate
- `getBlogPostBySlug(slug, preview?)` — single post
- `getAllBlogPostSlugs()` — for generateStaticParams, delivery only

## Draft Mode Flow
1. `/api/draft?secret=CONTENTFUL_PREVIEW_SECRET&slug=/blog/my-post` → enables draftMode → redirects to slug
2. Pages read `draftMode()` → pass preview boolean to fetch functions → Preview API returns draft content
3. Layout shows yellow banner when draftMode is active with link to `/api/disable-draft`
4. `/api/disable-draft` → disables draftMode → redirects to /

## ISR + Revalidation
- Blog detail: `export const revalidate = 60` as fallback
- `/api/revalidate` (POST): Contentful webhook calls this on publish/unpublish → `revalidatePath('/')`, `revalidatePath('/blog')`, optionally `/blog/[slug]`

## Component Guidelines
- BlogListSection is an **async Server Component** — it fetches its own blog posts using maxPosts from its fields
- Components receive the full entry object, not just fields (to access sys.id for keys)
- RichTextRenderer handles: h2, h3, p, bold, italic, underline, ul, ol, blockquote, hyperlinks, embedded assets (images). No embedded entries.
- Use `img` tags (no next/image needed for this scope)

## Styling Rules
- SCSS Modules with BEM-like naming: `.hero__title`, `.card__body`
- Design tokens in `_variables.scss`: colors, spacing scale, typography, breakpoints, container mixins
- Mobile-first: breakpoints at 640px, 768px, 1024px
- Color palette: bg #fafaf9, surface #fff, text #1a1a1a, accent #2d5be3
- Navbar: sticky, backdrop-blur, border-bottom
- Container: max-width 1200px. Narrow (articles): 760px

## Asset Helpers
Contentful asset URLs start with `//`. Always prepend `https:`.
```typescript
const url = asset.fields.file?.url;
return url?.startsWith('//') ? `https:${url}` : url;
```

## Environment Variables
```
CONTENTFUL_SPACE_ID
CONTENTFUL_ACCESS_TOKEN          # Delivery API
CONTENTFUL_PREVIEW_ACCESS_TOKEN  # Preview API
CONTENTFUL_PREVIEW_SECRET        # Validates draft mode requests
```
