import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeHero'
 * @name TypeHeroFields
 * @type {TypeHeroFields}
 * @memberof TypeHero
 */
export interface TypeHeroFields {
    /**
     * Field type definition for field 'internalName' (Internal Name)
     * @name Internal Name
     * @localized false
     */
    internalName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'subtitle' (Subtitle)
     * @name Subtitle
     * @localized false
     */
    subtitle: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'ctaText' (CTA Text)
     * @name CTA Text
     * @localized false
     */
    ctaText: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'ctaUrl' (CTA URL)
     * @name CTA URL
     * @localized false
     */
    ctaUrl: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'backgroundImage' (Background Image)
     * @name Background Image
     * @localized false
     */
    backgroundImage: EntryFieldTypes.AssetLink;
}

/**
 * Entry skeleton type definition for content type 'hero' (Hero)
 * @name TypeHeroSkeleton
 * @type {TypeHeroSkeleton}
 * @author 032Cii0R8gQXllkvVDovWU
 * @since 2026-03-20T00:27:06.961Z
 * @version 3
 */
export type TypeHeroSkeleton = EntrySkeletonType<TypeHeroFields, "hero">;
/**
 * Entry type definition for content type 'hero' (Hero)
 * @name TypeHero
 * @type {TypeHero}
 * @author Luis Alberto Pérez Coello<luisalbertodev@gmail.com>
 * @since 2026-03-20T00:27:06.961Z
 * @version 3
 * @link https://app.contentful.com/spaces/rkt81mjgormu/environments/master/content_types/hero
 */
export type TypeHero<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeHeroSkeleton, Modifiers, Locales>;

export function isTypeHero<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeHero<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'hero'
}

export type TypeHeroWithoutLinkResolutionResponse = TypeHero<"WITHOUT_LINK_RESOLUTION">;
export type TypeHeroWithoutUnresolvableLinksResponse = TypeHero<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeHeroWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeHero<"WITH_ALL_LOCALES", Locales>;
export type TypeHeroWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeHero<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeHeroWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeHero<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
