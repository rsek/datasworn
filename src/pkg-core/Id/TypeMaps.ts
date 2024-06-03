import type * as Datasworn from '../Datasworn.js'
import type * as Id from './Strings.js'
import type * as IdElements from '../IdElements/index.js'



interface CollectionSubtypesByName {
	AssetCollection: Datasworn.AssetCollection
	AtlasCollection: Datasworn.AtlasCollection
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

export interface IdsByTypeName extends Record<AnyTypeName, Id.AnyId> {
	AssetCollection: Id.NonRecursiveCollectionId<string, 'asset_collection'>
	AtlasCollection: Id.RecursiveCollectionId<string, 'atlas'>
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

export const NamesByCollectionSubtype = {
	assets: 'AssetCollection',
	atlas: 'AtlasCollection',
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