import { type TypesByName } from './types.js'

export const RECURSIVE_PATH_ELEMENTS_MAX = 3
export const RECURSIVE_PATH_ELEMENTS_MIN = 1

/** The separator character for Datasworn IDs. */
export const Sep = '/' as const
export type Sep = typeof Sep

/** The wildcard character for Datasworn IDs that matches any key in a dictionary object. */
export const Wildcard = '*' as const
export type Wildcard = typeof Wildcard

/** A globstar (recursive wildcard) representing any number of levels of in recursive collections. */
export const Globstar = '**' as const
export type Globstar = typeof Globstar

/** ID elements representing types that can exist in recursive collections. */
export const RecursiveCollectableTypeElement = [
	'oracles',
	'atlas',
	'npcs'
] as const
export type RecursiveCollectableTypeElement =
	(typeof RecursiveCollectableTypeElement)[number]

/** ID elements representing types that can exist in non-recursive collections. */
export const NonRecursiveCollectableTypeElement = ['moves', 'assets'] as const
export type NonRecursiveCollectableTypeElement =
	(typeof NonRecursiveCollectableTypeElement)[number]

/** ID elements representing types that can exist in collections. */
export const CollectableTypeElement = [
	...NonRecursiveCollectableTypeElement,
	...RecursiveCollectableTypeElement
]
export type CollectableTypeElement =
	| RecursiveCollectableTypeElement
	| NonRecursiveCollectableTypeElement

export const NonCollectableTypeElement = [
	'delve_sites',
	'site_themes',
	'site_domains',
	'truths',
	'rarities'
] as const
export type NonCollectableTypeElement =
	(typeof NonCollectableTypeElement)[number]
export const CollectionTypeElement = 'collections' as const
export type CollectionTypeElement = typeof CollectionTypeElement
export const CollectionSubtypeElement =
	CollectableTypeElement.map<CollectionSubtypeElement>(
		(el) => `${CollectionTypeElement}${Sep}${el}`
	)
export type CollectionSubtypeElement<
	T extends CollectableTypeElement = CollectableTypeElement
> = `${CollectionTypeElement}${Sep}${T}`

export type RecursiveCollectionSubtypeElement<
	T extends RecursiveCollectableTypeElement = RecursiveCollectableTypeElement
> = `${CollectionTypeElement}${Sep}${T}`

export const RecursiveCollectionSubtypeElement =
	RecursiveCollectableTypeElement.map<RecursiveCollectionSubtypeElement>(
		(el) => `${CollectionTypeElement}${Sep}${el}`
	)

export type NonRecursiveCollectionSubtypeElement<
	T extends
		NonRecursiveCollectableTypeElement = NonRecursiveCollectableTypeElement
> = `${CollectionTypeElement}${Sep}${T}`

export const NonRecursiveCollectionSubtypeElement =
	NonRecursiveCollectableTypeElement.map<NonRecursiveCollectionSubtypeElement>(
		(el) => `${CollectionTypeElement}${Sep}${el}`
	)

export const TypeElement = [
	...CollectableTypeElement,
	...NonCollectableTypeElement,
	CollectionTypeElement
] as const satisfies readonly TypeElement[]
export type TypeElement =
	| CollectableTypeElement
	| NonCollectableTypeElement
	| CollectionTypeElement

export const TypeCompositesByName = {
	AssetCollection: 'collections/assets',
	Atlas: 'collections/atlas',
	MoveCategory: 'collections/moves',
	NpcCollection: 'collections/npcs',
	OracleCollection: 'collections/oracles',
	Asset: 'assets',
	AtlasEntry: 'atlas',
	DelveSite: 'delve_sites',
	Move: 'moves',
	Npc: 'npcs',
	OracleRollable: 'oracles',
	Rarity: 'rarities',
	DelveSiteDomain: 'site_domains',
	DelveSiteTheme: 'site_themes',
	Truth: 'truths'
} as const satisfies Record<
	keyof TypesByName,
	| Exclude<TypeElement, CollectionTypeElement>
	| `${CollectionTypeElement}${Sep}${CollectableTypeElement}`
>
export type TypeCompositesByName = typeof TypeCompositesByName

export const NamesByTypeComposite = {
	'collections/assets': 'AssetCollection',
	'collections/atlas': 'Atlas',
	'collections/moves': 'MoveCategory',
	'collections/npcs': 'NpcCollection',
	'collections/oracles': 'OracleCollection',
	assets: 'Asset',
	atlas: 'AtlasEntry',
	delve_sites: 'DelveSite',
	moves: 'Move',
	npcs: 'Npc',
	oracles: 'OracleRollable',
	rarities: 'Rarity',
	site_domains: 'DelveSiteDomain',
	site_themes: 'DelveSiteTheme',
	truths: 'Truth'
} as const satisfies Record<
	TypeCompositesByName[keyof TypeCompositesByName],
	keyof TypeCompositesByName
>
export type NamesByTypeComposite = {
	[K in keyof typeof NamesByTypeComposite]: TypesByName[(typeof NamesByTypeComposite)[K]]
}

// export type IdTypeMap = {[P in keyof TypeMap]: }

/** Key in RecursiveCollection that contains a dictionary object of child collections. */
export const CollectionsKey = CollectionTypeElement
export type CollectionsKey = typeof CollectionsKey

/** Key in Collection that contains a dictionary object of collectable items. */
export const ContentsKey = 'contents' as const
export type ContentsKey = typeof ContentsKey
