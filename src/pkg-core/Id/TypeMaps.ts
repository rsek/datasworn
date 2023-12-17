import type * as Datasworn from '../Datasworn.js'
import type * as Id from './StringTemplateLiterals.js'
import type * as IdElements from './IdElements/index.js'

export interface TypesByName {
	AssetCollection: Datasworn.AssetCollection
	Atlas: Datasworn.Atlas
	MoveCategory: Datasworn.MoveCategory
	NpcCollection: Datasworn.NpcCollection
	OracleCollection: Datasworn.OracleCollection
	Asset: Datasworn.Asset
	AtlasEntry: Datasworn.AtlasEntry
	DelveSite: Datasworn.DelveSite
	Move: Datasworn.Move
	Npc: Datasworn.Npc
	OracleRollable: Datasworn.OracleRollable
	Rarity: Datasworn.Rarity
	DelveSiteDomain: Datasworn.DelveSiteDomain
	DelveSiteTheme: Datasworn.DelveSiteTheme
	Truth: Datasworn.Truth
}
export interface IdsByTypeName extends Record<keyof TypesByName, Id.AnyId> {
	AssetCollection: Id.NonRecursiveCollectionId<'assets'>
	Atlas: Id.RecursiveCollectionId<'atlas'>
	MoveCategory: Id.NonRecursiveCollectionId<'moves'>
	NpcCollection: Id.RecursiveCollectionId<'npcs'>
	OracleCollection: Id.RecursiveCollectionId<'oracles'>
	Asset: Id.NonRecursiveCollectableId<'assets'>
	AtlasEntry: Id.RecursiveCollectableId<'atlas'>
	Move: Id.NonRecursiveCollectableId<'moves'>
	Npc: Id.RecursiveCollectableId<'npcs'>
	OracleRollable: Id.RecursiveCollectableId<'oracles'>
	DelveSite: Id.NonCollectableId<'delve_sites'>
	Rarity: Id.NonCollectableId<'rarities'>
	DelveSiteDomain: Id.NonCollectableId<'site_domains'>
	DelveSiteTheme: Id.NonCollectableId<'site_themes'>
	Truth: Id.NonCollectableId<'truths'>
}
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
	| Exclude<
			IdElements.TypeElements.AnyPrimary,
			IdElements.TypeElements.Collection
	  >
	| `${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.Any}`
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
