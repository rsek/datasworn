import type * as Datasworn from '../Datasworn.js'
import type * as Id from './Strings.js'
import type * as IdElements from '../IdElements/index.js'



interface CollectionSubtypesByName {
	AssetCollection: Datasworn.AssetCollection
	Atlas: Datasworn.Atlas
	MoveCategory: Datasworn.MoveCategory
	NpcCollection: Datasworn.NpcCollection
	OracleCollection: Datasworn.OracleCollection
}

interface NonCollectableTypesByName {
	Rarity: Datasworn.Rarity
	DelveSiteDomain: Datasworn.DelveSiteDomain
	DelveSiteTheme: Datasworn.DelveSiteTheme
	Truth: Datasworn.Truth
	DelveSite: Datasworn.DelveSite
}

interface CollectableTypesByName {
	Asset: Datasworn.Asset
	AtlasEntry: Datasworn.AtlasEntry
	Move: Datasworn.Move
	Npc: Datasworn.Npc
	OracleRollable: Datasworn.OracleRollable
}
/** Any Collection type capable of containing Collectable objects. */
export type AnyCollectionType =
	CollectionSubtypesByName[keyof CollectionSubtypesByName]
/** Any object type eligible to be organized in a Collection */
export type AnyCollectableType =
	CollectableTypesByName[keyof CollectableTypesByName]
/** Any object type which is never organized in a Collection */
export type NonCollectableType =
	NonCollectableTypesByName[keyof NonCollectableTypesByName]

export type RecursiveCollectionType =
	CollectionSubtypesByName[RecursiveCollectionTypeName]
export type NonRecursiveCollectionType =
	CollectionSubtypesByName[NonRecursiveCollectionTypeName]

export type RecursiveCollectableType =
	CollectableTypesByName[RecursiveCollectableTypeName]
export type NonRecursiveCollectableType =
	CollectableTypesByName[NonRecursiveCollectableTypeName]

export type AnyCollectableTypeName =
	NameForTypeComposite<IdElements.TypeElements.Collectable.Any>
export type RecursiveCollectableTypeName =
	NameForTypeComposite<IdElements.TypeElements.Collectable.Recursive>
export type NonRecursiveCollectableTypeName =
	NameForTypeComposite<IdElements.TypeElements.Collectable.NonRecursive>
export type NonCollectableTypeName =
	NameForTypeComposite<IdElements.TypeElements.NonCollectable>
export type AnyCollectionTypeName =
	NameForTypeComposite<`${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.Any}`>

export type RecursiveCollectionTypeName =
	NameForTypeComposite<`${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.Recursive}`>
export type NonRecursiveCollectionTypeName =
	NameForTypeComposite<`${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.NonRecursive}`>

export interface TypesByName
	extends CollectionSubtypesByName,
		NonCollectableTypesByName,
		CollectableTypesByName {}

export type AnyTypeName = keyof TypesByName

export type AnyCollectionTypeComposite =
	`${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.Any}`

export type AnyTypeComposite =
	| IdElements.TypeElements.NonCollectable
	| IdElements.TypeElements.Collectable.Any
	| AnyCollectionTypeComposite

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
} as const satisfies Record<AnyTypeName, AnyTypeComposite>

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

export type NamesByTypeComposite = typeof NamesByTypeComposite

export type NameForTypeComposite<T extends AnyTypeComposite> =
	NamesByTypeComposite[T]
export type TypeCompositeForName<T extends AnyTypeName> =
	TypeCompositesByName[T]

type TypesByTypeComposite = {
	[T in AnyTypeComposite]: TypesByName[NameForTypeComposite<T>]
}

export type TypeForTypeComposite<T extends AnyTypeComposite> =
	TypesByTypeComposite[T]

export interface IdsByTypeName extends Record<AnyTypeName, Id.AnyId> {
	AssetCollection: Id.NonRecursiveCollectionId<string, 'assets'>
	Atlas: Id.RecursiveCollectionId<string, 'atlas'>
	MoveCategory: Id.NonRecursiveCollectionId<string, 'moves'>
	NpcCollection: Id.RecursiveCollectionId<string, 'npcs'>
	OracleCollection: Id.RecursiveCollectionId<string, 'oracles'>
	Asset: Id.NonRecursiveCollectableId<string, 'assets'>
	AtlasEntry: Id.RecursiveCollectableId<string, 'atlas'>
	Move: Id.NonRecursiveCollectableId<string, 'moves'>
	Npc: Id.RecursiveCollectableId<string, 'npcs'>
	OracleRollable: Id.RecursiveCollectableId<string, 'oracles'>
	DelveSite: Id.NonCollectableId<string, 'delve_sites'>
	Rarity: Id.NonCollectableId<string, 'rarities'>
	DelveSiteDomain: Id.NonCollectableId<string, 'site_domains'>
	DelveSiteTheme: Id.NonCollectableId<string, 'site_themes'>
	Truth: Id.NonCollectableId<string, 'truths'>
}

export type IdForTypeName<T extends AnyTypeName> = IdsByTypeName[T]

// type NameFromTypeComposite<T extends AnyTypeComposite> =

export const NamesByCollectionSubtype = {
	assets: 'AssetCollection',
	atlas: 'Atlas',
	moves: 'MoveCategory',
	npcs: 'NpcCollection',
	oracles: 'OracleCollection'
} as const satisfies Record<
	IdElements.TypeElements.Collectable.Any,
	keyof CollectionSubtypesByName
>
export type CollectionSubtypeMap = {
	-readonly [K in keyof typeof NamesByCollectionSubtype]: CollectionSubtypesByName[(typeof NamesByCollectionSubtype)[K]]
}
export type CollectionSubtype<
	T extends keyof CollectionSubtypeMap = keyof CollectionSubtypeMap
> = CollectionSubtypeMap[T]

export const NamesByCollectableType = {
	assets: 'Asset',
	atlas: 'AtlasEntry',
	moves: 'Move',
	npcs: 'Npc',
	oracles: 'OracleRollable'
} as const satisfies Record<
	IdElements.TypeElements.Collectable.Any,
	keyof CollectableTypesByName
>
export type CollectableTypeMap = {
	-readonly [K in keyof typeof NamesByCollectableType]: CollectableTypesByName[(typeof NamesByCollectableType)[K]]
}
export type CollectableType<
	T extends keyof CollectableTypeMap = keyof CollectableTypeMap
> = CollectableTypeMap[T]

export const NamesByNonCollectableType = {
	delve_sites: 'DelveSite',
	rarities: 'Rarity',
	site_domains: 'DelveSiteDomain',
	site_themes: 'DelveSiteTheme',
	truths: 'Truth'
} as const satisfies Record<
	IdElements.TypeElements.NonCollectable,
	keyof NonCollectableTypesByName
>

export type NonCollectableTypeMap = {
	-readonly [K in keyof typeof NamesByNonCollectableType]: NonCollectableTypesByName[(typeof NamesByNonCollectableType)[K]]
}