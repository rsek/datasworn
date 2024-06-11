namespace CONST {
	/** The maximum depth for nesting collections, relative to the root dictionary for its type */
  export const RECURSIVE_PATH_ELEMENTS_MAX = 4 as const
	export type RECURSIVE_PATH_ELEMENTS_MAX = typeof RECURSIVE_PATH_ELEMENTS_MAX
	export const RECURSIVE_PATH_ELEMENTS_MIN = 1 as const
	export type RECURSIVE_PATH_ELEMENTS_MIN = typeof RECURSIVE_PATH_ELEMENTS_MIN
	export const PACKAGE_ID_LENGTH_MIN = 3 as const
	export type PACKAGE_ID_LENGTH_MIN = typeof PACKAGE_ID_LENGTH_MIN

	/** The separator character for Datasworn IDs. */
	export const PathKeySep = '/' as const
	export type PathKeySep = typeof PathKeySep

	export const PathTypeSep = '.' as const
	export type PathTypeSep = typeof PathTypeSep

	export const PrefixSep = ':' as const
	export type PrefixSep = typeof PrefixSep

	/** The wildcard character for Datasworn IDs that matches any key in a dictionary object. */
	export const WildcardString = '*' as const
	export type WildcardString = typeof WildcardString

	/** A globstar (recursive wildcard) representing any number of levels of in recursive collections. */
	export const GlobstarString = '**' as const
	export type GlobstarString = typeof GlobstarString

	/** Key in RecursiveCollection that contains a dictionary object of child collections. */
	export const CollectionsKey = 'collections'
	export type CollectionsKey = typeof CollectionsKey

	/** Key in Collection that contains a dictionary object of collectable items. */
	export const ContentsKey = 'contents' as const
	export type ContentsKey = typeof ContentsKey
}

export default CONST
