import { cache } from 'react';
import { getPageBySlug, getBlogPosts, getBlogPostBySlug, getAllBlogPostSlugs } from './contentful';

export const getCachedPageBySlug = cache(getPageBySlug);
export const getCachedBlogPosts = cache(getBlogPosts);
export const getCachedBlogPostBySlug = cache(getBlogPostBySlug);
export const getCachedAllBlogPostSlugs = cache(getAllBlogPostSlugs);
