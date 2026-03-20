import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeSectionBlogList'
 * @name TypeSectionBlogListFields
 * @type {TypeSectionBlogListFields}
 * @memberof TypeSectionBlogList
 */
export interface TypeSectionBlogListFields {
    /**
     * Field type definition for field 'internalName' (Internal Name)
     * @name Internal Name
     * @localized false
     */
    internalName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'heading' (Heading)
     * @name Heading
     * @localized false
     */
    heading: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'subheading' (Subheading)
     * @name Subheading
     * @localized false
     */
    subheading?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'maxPosts' (Max Posts)
     * @name Max Posts
     * @localized false
     */
    maxPosts: EntryFieldTypes.Integer;
}

/**
 * Entry skeleton type definition for content type 'sectionBlogList' (Section Blog List)
 * @name TypeSectionBlogListSkeleton
 * @type {TypeSectionBlogListSkeleton}
 * @author 032Cii0R8gQXllkvVDovWU
 * @since 2026-03-20T00:39:17.397Z
 * @version 1
 */
export type TypeSectionBlogListSkeleton = EntrySkeletonType<TypeSectionBlogListFields, "sectionBlogList">;
/**
 * Entry type definition for content type 'sectionBlogList' (Section Blog List)
 * @name TypeSectionBlogList
 * @type {TypeSectionBlogList}
 * @author Luis Alberto Pérez Coello<luisalbertodev@gmail.com>
 * @since 2026-03-20T00:39:17.397Z
 * @version 1
 * @link https://app.contentful.com/spaces/rkt81mjgormu/environments/master/content_types/sectionBlogList
 */
export type TypeSectionBlogList<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSectionBlogListSkeleton, Modifiers, Locales>;

export function isTypeSectionBlogList<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSectionBlogList<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'sectionBlogList'
}

export type TypeSectionBlogListWithoutLinkResolutionResponse = TypeSectionBlogList<"WITHOUT_LINK_RESOLUTION">;
export type TypeSectionBlogListWithoutUnresolvableLinksResponse = TypeSectionBlogList<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSectionBlogListWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionBlogList<"WITH_ALL_LOCALES", Locales>;
export type TypeSectionBlogListWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionBlogList<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSectionBlogListWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionBlogList<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
