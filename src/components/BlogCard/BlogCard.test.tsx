import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TypeBlogPostWithoutUnresolvableLinksResponse } from '@/@types';
import BlogCard from './BlogCard';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => <a href={href} className={className}>{children}</a>,
}));

function createBlogPostEntry(
  overrides?: Partial<TypeBlogPostWithoutUnresolvableLinksResponse['fields']>
): TypeBlogPostWithoutUnresolvableLinksResponse {
  return {
    sys: {
      id: 'post-1',
      type: 'Entry',
      contentType: { sys: { id: 'blogPost', type: 'Link', linkType: 'ContentType' } },
    },
    fields: {
      title: 'Building a Design System from Scratch',
      slug: 'building-a-design-system',
      excerpt: 'A step-by-step guide to creating a consistent design language.',
      author: 'Jane Smith',
      publishDate: '2024-03-15T12:00:00.000Z',
      body: { nodeType: 'document', data: {}, content: [] },
      featuredImage: {
        sys: { id: 'asset-2', type: 'Asset' },
        fields: {
          title: 'Design system illustration',
          description: '',
          file: {
            url: '//images.ctfassets.net/space/design.jpg',
            details: { size: 0 },
            fileName: 'design.jpg',
            contentType: 'image/jpeg',
          },
        },
        metadata: { tags: [] },
      },
      ...overrides,
    },
    metadata: { tags: [] },
  } as unknown as TypeBlogPostWithoutUnresolvableLinksResponse;
}

const defaultEntry = createBlogPostEntry();

describe('BlogCard', () => {
  const getView = async (overrides?: Partial<TypeBlogPostWithoutUnresolvableLinksResponse['fields']>) => {
    const entry = overrides ? createBlogPostEntry(overrides) : defaultEntry;

    const target = render(<BlogCard entry={entry} />);

    const getTitle = async () =>
      screen.getByRole('heading', { level: 2 });

    const getTitleLink = async () =>
      screen.queryByRole('link', { name: entry.fields.title as string });

    const getReadMoreLink = async () =>
      screen.queryByRole('link', { name: /read more/i });

    const getExcerpt = async () =>
      target.container.querySelector<HTMLElement>('p');

    const getFeaturedImage = async () =>
      target.container.querySelector<HTMLImageElement>('img');

    const getPublishDate = async () =>
      target.container.querySelector<HTMLElement>('time');

    const getAuthor = async () =>
      target.container.querySelector<HTMLElement>('span:not([aria-hidden])');

    return {
      target,
      getTitle,
      getTitleLink,
      getReadMoreLink,
      getExcerpt,
      getFeaturedImage,
      getPublishDate,
      getAuthor,
    };
  };

  it('should display the post title as the card heading', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getTitle();

    // Assert.
    expect(actual).toHaveTextContent('Building a Design System from Scratch');
  });

  it('should link the post title to the blog post page', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getTitleLink();

    // Assert.
    expect(actual).toHaveAttribute('href', '/blog/building-a-design-system');
  });

  it('should provide a "Read more" link to the blog post page', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getReadMoreLink();

    // Assert.
    expect(actual).toHaveAttribute('href', '/blog/building-a-design-system');
  });

  it('should display the excerpt when provided', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getExcerpt();

    // Assert.
    expect(actual).toHaveTextContent('A step-by-step guide to creating a consistent design language.');
  });

  it('should omit the excerpt when not provided', async () => {
    // Arrange.
    const view = await getView({ excerpt: undefined });

    // Act.
    const actual = await view.getExcerpt();

    // Assert.
    expect(actual).toBeNull();
  });

  it('should show the featured image with a secure https URL', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getFeaturedImage();

    // Assert.
    expect(actual!.getAttribute('src')).toContain(encodeURIComponent('https://images.ctfassets.net/space/design.jpg'));
  });

  it('should not render an image when no featured image is provided', async () => {
    // Arrange.
    const view = await getView({ featuredImage: undefined });

    // Act.
    const actual = await view.getFeaturedImage();

    // Assert.
    expect(actual).toBeNull();
  });

  it('should use the image title as the alt text', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getFeaturedImage();

    // Assert.
    expect(actual).toHaveAttribute('alt', 'Design system illustration');
  });

  it('should fall back to the post title as the alt text when the image has no title', async () => {
    // Arrange.
    const view = await getView({
      featuredImage: {
        sys: { id: 'asset-3', type: 'Asset' },
        fields: {
          description: '',
          file: {
            url: '//images.ctfassets.net/space/design.jpg',
            details: { size: 0 },
            fileName: 'design.jpg',
            contentType: 'image/jpeg',
          },
        },
        metadata: { tags: [] },
      } as unknown as TypeBlogPostWithoutUnresolvableLinksResponse['fields']['featuredImage'],
    });

    // Act.
    const actual = await view.getFeaturedImage();

    // Assert.
    expect(actual).toHaveAttribute('alt', 'Building a Design System from Scratch');
  });

  it('should display the formatted publish date', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getPublishDate();

    // Assert.
    expect(actual).toHaveTextContent('March 15, 2024');
  });

  it('should omit the date when no publish date is provided', async () => {
    // Arrange.
    const view = await getView({ publishDate: undefined });

    // Act.
    const actual = await view.getPublishDate();

    // Assert.
    expect(actual).toBeNull();
  });

  it('should display the author name', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getAuthor();

    // Assert.
    expect(actual).toHaveTextContent('Jane Smith');
  });

  it('should omit the author name when not provided', async () => {
    // Arrange.
    const view = await getView({ author: undefined });

    // Act.
    const actual = await view.getAuthor();

    // Assert.
    expect(actual).toBeNull();
  });
});
