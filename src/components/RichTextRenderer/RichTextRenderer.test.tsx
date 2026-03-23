import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import RichTextRenderer from './RichTextRenderer';

function buildDocument(content: unknown[]): Document {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: content as Document['content'],
  };
}

function textNode(value: string, marks: Array<{ type: string }> = []) {
  return { nodeType: 'text' as const, value, marks, data: {} };
}

function paragraphNode(text: string) {
  return {
    nodeType: BLOCKS.PARAGRAPH,
    data: {},
    content: [textNode(text)],
  };
}

function listItemNode(text: string) {
  return {
    nodeType: BLOCKS.LIST_ITEM,
    data: {},
    content: [paragraphNode(text)],
  };
}

describe('RichTextRenderer', () => {
  const getView = async (document: Document) => {
    const target = render(<RichTextRenderer document={document} />);

    const getHeading = async (level: 2 | 3) =>
      target.container.querySelector<HTMLHeadingElement>(`h${level}`);

    const getParagraph = async () =>
      target.container.querySelector<HTMLParagraphElement>('p');

    const getStrong = async () =>
      target.container.querySelector<HTMLElement>('strong');

    const getEm = async () =>
      target.container.querySelector<HTMLElement>('em');

    const getUnderline = async () =>
      target.container.querySelector<HTMLElement>('u');

    const getUnorderedList = async () =>
      target.container.querySelector<HTMLUListElement>('ul');

    const getOrderedList = async () =>
      target.container.querySelector<HTMLOListElement>('ol');

    const getListItems = async () =>
      [...target.container.querySelectorAll<HTMLLIElement>('li')];

    const getBlockquote = async () =>
      target.container.querySelector<HTMLElement>('blockquote');

    const getImage = async () =>
      target.container.querySelector<HTMLImageElement>('img');

    const getLink = async () =>
      target.container.querySelector<HTMLAnchorElement>('a');

    return {
      target,
      getHeading,
      getParagraph,
      getStrong,
      getEm,
      getUnderline,
      getUnorderedList,
      getOrderedList,
      getListItems,
      getBlockquote,
      getImage,
      getLink,
    };
  };

  it('should render the heading text as a level-2 heading', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [textNode('Getting Started')],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getHeading(2);

    // Assert.
    expect(actual).toHaveTextContent('Getting Started');
  });

  it('should render subheading text as a level-3 heading', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.HEADING_3,
        data: {},
        content: [textNode('Prerequisites')],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getHeading(3);

    // Assert.
    expect(actual).toHaveTextContent('Prerequisites');
  });

  it('should render paragraph content as body text', async () => {
    // Arrange.
    const document = buildDocument([
      paragraphNode('This is a paragraph of text.'),
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getParagraph();

    // Assert.
    expect(actual).toHaveTextContent('This is a paragraph of text.');
  });

  it('should display bold text with strong emphasis', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [textNode('important', [{ type: MARKS.BOLD }])],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getStrong();

    // Assert.
    expect(actual).toHaveTextContent('important');
  });

  it('should display italic text with emphasis', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [textNode('emphasised', [{ type: MARKS.ITALIC }])],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getEm();

    // Assert.
    expect(actual).toHaveTextContent('emphasised');
  });

  it('should display underlined text', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [textNode('underlined', [{ type: MARKS.UNDERLINE }])],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getUnderline();

    // Assert.
    expect(actual).toHaveTextContent('underlined');
  });

  it('should present each unordered list item', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: [
          listItemNode('First item'),
          listItemNode('Second item'),
        ],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getListItems();

    // Assert.
    expect(actual).toHaveLength(2);
  });

  it('should present each ordered list item in sequence', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.OL_LIST,
        data: {},
        content: [
          listItemNode('Step one'),
          listItemNode('Step two'),
          listItemNode('Step three'),
        ],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getListItems();

    // Assert.
    expect(actual).toHaveLength(3);
  });

  it('should group unordered list items under a bullet list', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: [listItemNode('Item')],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getUnorderedList();

    // Assert.
    expect(actual).not.toBeNull();
  });

  it('should group ordered list items under a numbered list', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.OL_LIST,
        data: {},
        content: [listItemNode('Step one')],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getOrderedList();

    // Assert.
    expect(actual).not.toBeNull();
  });

  it('should present a block quote', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.QUOTE,
        data: {},
        content: [paragraphNode('The only way to do great work is to love what you do.')],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getBlockquote();

    // Assert.
    expect(actual).toHaveTextContent('The only way to do great work is to love what you do.');
  });

  it('should display the embedded image with a secure https URL', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        data: {
          target: {
            fields: {
              title: 'Mountain landscape',
              description: 'A scenic view of the Alps',
              file: {
                url: '//images.ctfassets.net/space/mountain.jpg',
                details: { size: 12345, image: { width: 1200, height: 800 } },
                fileName: 'mountain.jpg',
                contentType: 'image/jpeg',
              },
            },
          },
        },
        content: [],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getImage();

    // Assert.
    expect(actual!.getAttribute('src')).toContain(encodeURIComponent('https://images.ctfassets.net/space/mountain.jpg'));
  });

  it('should describe the embedded image using the asset description as alt text', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        data: {
          target: {
            fields: {
              title: 'Mountain landscape',
              description: 'A scenic view of the Alps',
              file: {
                url: '//images.ctfassets.net/space/mountain.jpg',
                details: { size: 12345, image: { width: 1200, height: 800 } },
                fileName: 'mountain.jpg',
                contentType: 'image/jpeg',
              },
            },
          },
        },
        content: [],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getImage();

    // Assert.
    expect(actual).toHaveAttribute('alt', 'A scenic view of the Alps');
  });

  it('should fall back to the asset title as alt text when no description is provided', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        data: {
          target: {
            fields: {
              title: 'Mountain landscape',
              file: {
                url: '//images.ctfassets.net/space/mountain.jpg',
                details: { size: 12345, image: { width: 1200, height: 800 } },
                fileName: 'mountain.jpg',
                contentType: 'image/jpeg',
              },
            },
          },
        },
        content: [],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getImage();

    // Assert.
    expect(actual).toHaveAttribute('alt', 'Mountain landscape');
  });

  it('should omit the image when the embedded asset has no URL', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        data: {
          target: {
            fields: {
              title: 'Broken asset',
              file: { url: '', details: { size: 0 }, fileName: '', contentType: '' },
            },
          },
        },
        content: [],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getImage();

    // Assert.
    expect(actual).toBeNull();
  });

  it('should link inline hyperlinks to their destination URL', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: INLINES.HYPERLINK,
            data: { uri: '/about' },
            content: [textNode('About us')],
          },
        ],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getLink();

    // Assert.
    expect(actual).toHaveAttribute('href', '/about');
  });

  it('should open external links in a new browser tab', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: INLINES.HYPERLINK,
            data: { uri: 'https://example.com' },
            content: [textNode('Visit example')],
          },
        ],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getLink();

    // Assert.
    expect(actual).toHaveAttribute('target', '_blank');
  });

  it('should protect users from tab-napping on external links', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: INLINES.HYPERLINK,
            data: { uri: 'https://example.com' },
            content: [textNode('Visit example')],
          },
        ],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getLink();

    // Assert.
    expect(actual).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should not open internal links in a new tab', async () => {
    // Arrange.
    const document = buildDocument([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: INLINES.HYPERLINK,
            data: { uri: '/about' },
            content: [textNode('About us')],
          },
        ],
      },
    ]);

    // Act.
    const view = await getView(document);
    const actual = await view.getLink();

    // Assert.
    expect(actual).not.toHaveAttribute('target');
  });
});
