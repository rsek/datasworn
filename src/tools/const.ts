import type * as Types from '../types/Datasworn.js'

/** The delimiter character for Datasworn IDs. */
export const Sep = '/' as const
export type Sep = typeof Sep

/** The wildcard character for Datasworn IDs. */
export const Wildcard = '*' as const
export type Wildcard = typeof Wildcard

/** Represents a wildcard for 1-3 elements in recursive Datasworn IDs. */
export const RecursiveWildcard = '**' as const
export type RecursiveWildcard = typeof RecursiveWildcard

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
	...CollectionSubtypeElement
] as const satisfies readonly TypeElement[]
export type TypeElement =
	| CollectableTypeElement
	| NonCollectableTypeElement
	| CollectionSubtypeElement
type ExtractCollectableTypeElement<T extends CollectableId> =
	T extends CollectableId<infer U> ? U : never
type ExtractCollectionTypeElement<T extends CollectionId> =
	T extends CollectionId<infer U> ? CollectionSubtypeElement<U> : never
type ExtractNonCollectableTypeElement<T extends NonCollectableId> =
	T extends NonCollectableId<infer U> ? U : never
type ExtractCollectedType<T extends CollectionId> = T extends CollectionId<
	infer U
>
	? U
	: never
export type ExtractTypeElement<T extends AnyId> = T extends NonCollectableId
	? ExtractNonCollectableTypeElement<T>
	: T extends CollectionId
	  ? ExtractCollectionTypeElement<T>
	  : T extends CollectableId
	    ? ExtractCollectableTypeElement<T>
	    : never
export const CollectionCollectionsKey = 'collections' as const
export type CollectionCollectionsKey = typeof CollectionCollectionsKey
export const CollectionContentsKey = 'contents' as const
export type CollectionContentsKey = typeof CollectionContentsKey

export type InferTypeFromId<T extends AnyId> =
	TypeElementMap[ExtractTypeElement<T>]

const TypeElementMap = {
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
} as const satisfies Record<TypeElement, keyof TypeMap>
type TypeElementMap = {
	[K in keyof typeof TypeElementMap]: TypeMap[(typeof TypeElementMap)[K]]
}
export type TypeByElement<T extends keyof TypeElementMap> = TypeElementMap[T]
type TypeByName<T extends keyof TypeMap> = TypeMap[T]
export type AnyCollection = TypeElementMap[CollectionSubtypeElement]
export type AnyRecursiveCollection =
	TypeElementMap[RecursiveCollectableTypeElement] & {
		[CollectionCollectionsKey]?: Record<
			string,
			TypeElementMap[RecursiveCollectableTypeElement]
		>
	}
type AnyCollectable = TypeElementMap[CollectableTypeElement]
interface TypeMap {
	AssetCollection: Types.AssetCollection
	Atlas: Types.Atlas
	MoveCategory: Types.MoveCategory
	NpcCollection: Types.NpcCollection
	OracleCollection: Types.OracleCollection
	Asset: Types.Asset
	AtlasEntry: Types.AtlasEntry
	DelveSite: Types.DelveSite
	Move: Types.Move
	Npc: Types.Npc
	OracleRollable: Types.OracleRollable
	Rarity: Types.Rarity
	DelveSiteDomain: Types.DelveSiteDomain
	DelveSiteTheme: Types.DelveSiteTheme
	Truth: Types.Truth
}
type RecursiveDictKeys =
	| `${Sep}${DictKey}`
	| `${Sep}${DictKey}${Sep}${DictKey}`
	| `${Sep}${DictKey}${Sep}${DictKey}${Sep}${DictKey}`
export type RulesPackageId = string
export type DictKey = string
export type CollectableId<
	Type extends CollectableTypeElement = CollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${Sep}${DictKey}${Sep}${DictKey}`
type RecursiveCollectableId<
	Type extends RecursiveCollectableTypeElement = RecursiveCollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${RecursiveDictKeys}${Sep}${DictKey}`
export type CollectionId<
	Subtype extends CollectableTypeElement = CollectableTypeElement
> =
	`${RulesPackageId}${Sep}${CollectionTypeElement}${Sep}${Subtype}${Sep}${DictKey}`
type RecursiveCollectionId<
	Subtype extends
		RecursiveCollectableTypeElement = RecursiveCollectableTypeElement
> =
	`${RulesPackageId}${Sep}${CollectionTypeElement}${Sep}${Subtype}${RecursiveDictKeys}`
export type NonCollectableId<
	Type extends NonCollectableTypeElement = NonCollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${Sep}${DictKey}`
export type AnyId =
	| CollectableId
	| RecursiveCollectableId
	| CollectionId
	| RecursiveCollectionId
	| NonCollectableId
export type DataswornTree = Record<RulesPackageId, Types.RulesPackage>

export const RECURSIVE_PATH_ELEMENTS_MAX = 3
export const RECURSIVE_PATH_ELEMENTS_MIN = 1
