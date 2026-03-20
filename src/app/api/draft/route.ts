import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getBlogPostBySlug, getPageBySlug } from "@/lib/contentful";

const BLOG_PREFIX = "/blog/";

async function resolveRedirectSlug(slug: string): Promise<string | null> {
  if (slug.startsWith(BLOG_PREFIX) && slug.length > BLOG_PREFIX.length) {
    const postSlug = slug.slice(BLOG_PREFIX.length);
    const post = await getBlogPostBySlug(postSlug, true);
    return post ? `/blog/${post.fields.slug}` : null;
  }

  if (slug === "/" || slug === "/blog") {
    const page = await getPageBySlug(slug, true);
    return page ? slug : null;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!slug) {
    return new Response("Missing slug parameter", { status: 400 });
  }

  const redirectTo = await resolveRedirectSlug(slug);

  if (!redirectTo) {
    return Response.json(
      { message: "Not found or invalid slug" },
      { status: 404 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  redirect(redirectTo);
}
