import { describe, expect, it } from 'vitest';
import { assetUrl, formatDate } from './utils';

describe('assetUrl', () => {
  it('should prepend https: when URL starts with //', () => {
    // Arrange.
    const url = '//images.ctfassets.net/space/image.jpg';

    // Act.
    const actual = assetUrl(url);

    // Assert.
    expect(actual).toEqual('https://images.ctfassets.net/space/image.jpg');
  });

  it('should return the URL unchanged when it already has a scheme', () => {
    // Arrange.
    const url = 'https://images.ctfassets.net/space/image.jpg';

    // Act.
    const actual = assetUrl(url);

    // Assert.
    expect(actual).toEqual('https://images.ctfassets.net/space/image.jpg');
  });

  it('should return undefined when URL is undefined', () => {
    // Arrange.
    const url = undefined;

    // Act.
    const actual = assetUrl(url);

    // Assert.
    expect(actual).toBeUndefined();
  });

  it('should return undefined when URL is an empty string', () => {
    // Arrange.
    const url = '';

    // Act.
    const actual = assetUrl(url);

    // Assert.
    expect(actual).toBeUndefined();
  });
});

describe('formatDate', () => {
  it('should format an ISO date string as a long English date', () => {
    // Arrange.
    const dateStr = '2024-03-15T12:00:00.000Z';

    // Act.
    const actual = formatDate(dateStr);

    // Assert.
    expect(actual).toEqual('March 15, 2024');
  });

  it('should format a full ISO datetime string using only the date portion', () => {
    // Arrange.
    const dateStr = '2024-11-01T12:00:00.000Z';

    // Act.
    const actual = formatDate(dateStr);

    // Assert.
    expect(actual).toMatch(/November 1, 2024/);
  });

  it('should include the year in the output', () => {
    // Arrange.
    const dateStr = '2020-06-15T12:00:00.000Z';

    // Act.
    const actual = formatDate(dateStr);

    // Assert.
    expect(actual).toContain('2020');
  });
});
