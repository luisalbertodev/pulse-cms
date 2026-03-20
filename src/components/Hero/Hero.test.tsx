import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TypeHeroWithoutUnresolvableLinksResponse } from '@/@types';
import Hero from './Hero';

function createHeroEntry(
  overrides?: Partial<TypeHeroWithoutUnresolvableLinksResponse['fields']>
): TypeHeroWithoutUnresolvableLinksResponse {
  return {
    sys: {
      id: 'hero-1',
      type: 'Entry',
      contentType: { sys: { id: 'hero', type: 'Link', linkType: 'ContentType' } },
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
          description: '',
          file: {
            url: '//images.ctfassets.net/space/hero.jpg',
            details: { size: 0 },
            fileName: 'hero.jpg',
            contentType: 'image/jpeg',
          },
        },
        metadata: { tags: [] },
      },
      ...overrides,
    },
    metadata: { tags: [] },
  } as unknown as TypeHeroWithoutUnresolvableLinksResponse;
}

const defaultEntry = createHeroEntry();

describe('Hero', () => {
  const getView = async (overrides?: Partial<TypeHeroWithoutUnresolvableLinksResponse['fields']>) => {
    const entry = overrides ? createHeroEntry(overrides) : defaultEntry;

    const target = render(<Hero entry={entry} />);

    const getTitle = async () =>
      screen.getByRole('heading', { level: 1 });

    const getSubtitle = async () =>
      screen.getByText(entry.fields.subtitle as string);

    const getCtaLink = async () =>
      screen.queryByRole('link');

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

  it('should display the subtitle below the heading', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getSubtitle();

    // Assert.
    expect(actual).toBeInTheDocument();
  });

  it('should present a call-to-action linking to the target URL', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getCtaLink();

    // Assert.
    expect(actual).toHaveAttribute('href', 'https://example.com/signup');
  });

  it('should label the call-to-action with the configured text', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getCtaLink();

    // Assert.
    expect(actual).toHaveTextContent('Start Free Trial');
  });

  it('should omit the call-to-action when the CTA text is absent', async () => {
    // Arrange.
    const view = await getView({ ctaText: undefined });

    // Act.
    const actual = await view.getCtaLink();

    // Assert.
    expect(actual).toBeNull();
  });

  it('should show the background image with a secure https URL', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getBackgroundImage();

    // Assert.
    expect(actual).toHaveAttribute('src', 'https://images.ctfassets.net/space/hero.jpg');
  });

  it('should not render a background image when none is provided', async () => {
    // Arrange.
    const view = await getView({ backgroundImage: undefined });

    // Act.
    const actual = await view.getBackgroundImage();

    // Assert.
    expect(actual).toBeNull();
  });
});
