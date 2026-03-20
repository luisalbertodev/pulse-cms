import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeBlogPost'
 * @name TypeBlogPostFields
 * @type {TypeBlogPostFields}
 * @memberof TypeBlogPost
 */
export interface TypeBlogPostFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'slug' (Slug)
     * @name Slug
     * @localized false
     */
    slug: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'excerpt' (Excerpt)
     * @name Excerpt
     * @localized false
     */
    excerpt: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'featuredImage' (Featured Image)
     * @name Featured Image
     * @localized false
     */
    featuredImage: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'body' (Body)
     * @name Body
     * @localized false
     */
    body: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'author' (Author)
     * @name Author
     * @localized false
     */
    author: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'publishDate' (Publish Date)
     * @name Publish Date
     * @localized false
     */
    publishDate: EntryFieldTypes.Date;
}

/**
 * Entry skeleton type definition for content type 'blogPost' (Blog Post)
 * @name TypeBlogPostSkeleton
 * @type {TypeBlogPostSkeleton}
 * @author 032Cii0R8gQXllkvVDovWU
 * @since 2026-03-20T00:47:12.150Z
 * @version 3
 */
export type TypeBlogPostSkeleton = EntrySkeletonType<TypeBlogPostFields, "blogPost">;
/**
 * Entry type definition for content type 'blogPost' (Blog Post)
 * @name TypeBlogPost
 * @type {TypeBlogPost}
 * @author Luis Alberto Pérez Coello<luisalbertodev@gmail.com>
 * @since 2026-03-20T00:47:12.150Z
 * @version 3
 * @link https://app.contentful.com/spaces/rkt81mjgormu/environments/master/content_types/blogPost
 */
export type TypeBlogPost<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBlogPostSkeleton, Modifiers, Locales>;

export function isTypeBlogPost<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeBlogPost<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'blogPost'
}

export type TypeBlogPostWithoutLinkResolutionResponse = TypeBlogPost<"WITHOUT_LINK_RESOLUTION">;
export type TypeBlogPostWithoutUnresolvableLinksResponse = TypeBlogPost<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeBlogPostWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeBlogPost<"WITH_ALL_LOCALES", Locales>;
export type TypeBlogPostWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeBlogPost<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeBlogPostWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeBlogPost<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
