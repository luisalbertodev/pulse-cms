import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeHeroSkeleton } from "./TypeHero";
import type { TypeSectionBlogListSkeleton } from "./TypeSectionBlogList";

/**
 * Fields type definition for content type 'TypePage'
 * @name TypePageFields
 * @type {TypePageFields}
 * @memberof TypePage
 */
export interface TypePageFields {
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
     * Field type definition for field 'seoTitle' (SEO Title)
     * @name SEO Title
     * @localized false
     */
    seoTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'seoDescription' (SEO Description)
     * @name SEO Description
     * @localized false
     */
    seoDescription: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'ogImage' (OG Image)
     * @name OG Image
     * @localized false
     */
    ogImage?: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'sections' (Sections)
     * @name Sections
     * @localized false
     */
    sections?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeHeroSkeleton | TypeSectionBlogListSkeleton>>;
}

/**
 * Entry skeleton type definition for content type 'page' (Page)
 * @name TypePageSkeleton
 * @type {TypePageSkeleton}
 * @author 032Cii0R8gQXllkvVDovWU
 * @since 2026-03-20T00:52:04.388Z
 * @version 3
 */
export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
/**
 * Entry type definition for content type 'page' (Page)
 * @name TypePage
 * @type {TypePage}
 * @author Luis Alberto Pérez Coello<luisalbertodev@gmail.com>
 * @since 2026-03-20T00:52:04.388Z
 * @version 3
 * @link https://app.contentful.com/spaces/rkt81mjgormu/environments/master/content_types/page
 */
export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePageSkeleton, Modifiers, Locales>;

export function isTypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypePage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'page'
}

export type TypePageWithoutLinkResolutionResponse = TypePage<"WITHOUT_LINK_RESOLUTION">;
export type TypePageWithoutUnresolvableLinksResponse = TypePage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypePage<"WITH_ALL_LOCALES", Locales>;
export type TypePageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypePage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypePage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
