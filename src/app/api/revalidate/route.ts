import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-contentful-webhook-secret');

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const contentType = body?.sys?.contentType?.sys?.id as string | undefined;
    const slug = body?.fields?.slug?.['en-US'] as string | undefined;

    revalidatePath('/');
    revalidatePath('/blog');

    if (contentType === 'blogPost' && slug) {
      revalidatePath(`/blog/${slug}`);
    }

    return Response.json({ revalidated: true, now: Date.now() });
  } catch {
    return Response.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
