export function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
