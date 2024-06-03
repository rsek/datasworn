import type { Datasworn } from '../index.js'

/**
 * Datasworn ID elements that represent specific types of Datasworn object.
 */
namespace TypeElements {
	export namespace Collectable {
		/** Object types that can exist in recursive collections. */
		export enum Recursive {
			AtlasEntry = 'atlas_entry',
			Npc = 'npc',
			OracleRollable = 'oracle_rollable'
		}

		/** ID type elements for types that can exist in non-recursive collections. */
		export enum NonRecursive {
			Asset = 'asset',
			Move = 'move'
		}

		/** Union of ID type elements for types that can exist in recursive or non-recursive collections. */
		export type Any = Recursive | NonRecursive
	}

	export namespace Collection {
		export enum Recursive {
			AtlasCollection = 'atlas_collection',
			NpcCollection = 'npc_collection',
			OracleCollection = 'oracle_collection'
		}
		export enum NonRecursive {
			AssetCollection = 'asset_collection',
			MoveCategory = 'move_category'
		}

		export type Any = Recursive | NonRecursive
	}

	/** ID type elements for types that don't use collections at all. */
	export enum NonCollectable {
		DelveSite = 'delve_site',
		DelveSiteDomain = 'delve_site_domain',
		DelveSiteTheme = 'delve_site_theme',
		Rarity = 'rarity',
		Truth = 'truth'
	}

	export type Any = Collectable.Any | Collection.Any | NonCollectable

	const collectedByMap = {
		[Collection.NonRecursive.AssetCollection]: Collectable.NonRecursive.Asset,
		[Collection.NonRecursive.MoveCategory]: Collectable.NonRecursive.Move,
		[Collection.Recursive.AtlasCollection]: Collectable.Recursive.AtlasEntry,
		[Collection.Recursive.NpcCollection]: Collectable.Recursive.Npc,
		[Collection.Recursive.OracleCollection]:
			Collectable.Recursive.OracleRollable
	} as const satisfies Record<Collection.Any, Collectable.Any>

	export type CollectedBy<T extends Collection.Any> = (typeof collectedByMap)[T]

	export const typeRootKeys = {
		[Collection.NonRecursive.AssetCollection]: 'assets',
		[Collectable.NonRecursive.Asset]: 'assets',
		[Collection.NonRecursive.MoveCategory]: 'moves',
		[Collectable.NonRecursive.Move]: 'moves',
		[Collection.Recursive.AtlasCollection]: 'atlas',
		[Collectable.Recursive.AtlasEntry]: 'atlas',
		[Collection.Recursive.NpcCollection]: 'npcs',
		[Collectable.Recursive.Npc]: 'npcs',
		[Collection.Recursive.OracleCollection]: 'oracles',
		[Collectable.Recursive.OracleRollable]: 'oracles',
		[NonCollectable.DelveSite]: 'delve_sites',
		[NonCollectable.Truth]: 'truths',
		[NonCollectable.DelveSiteDomain]: 'site_domains',
		[NonCollectable.DelveSiteTheme]: 'site_themes',
		[NonCollectable.Rarity]: 'rarities'
	} as const satisfies Record<Any, keyof Datasworn.RulesPackage>

	export type TypeRootKey<T extends Any = Any> = (typeof typeRootKeys)[T]

	interface TypeMap {
		[Collection.NonRecursive.AssetCollection]: Datasworn.AssetCollection
		[Collectable.NonRecursive.Asset]: Datasworn.Asset
		[Collection.NonRecursive.MoveCategory]: Datasworn.MoveCategory
		[Collectable.NonRecursive.Move]: Datasworn.Move
		[Collection.Recursive.AtlasCollection]: Datasworn.AtlasCollection
		[Collectable.Recursive.AtlasEntry]: Datasworn.AtlasEntry
		[Collection.Recursive.NpcCollection]: Datasworn.NpcCollection
		[Collectable.Recursive.Npc]: Datasworn.Npc
		[Collection.Recursive.OracleCollection]: Datasworn.OracleCollection
		[Collectable.Recursive.OracleRollable]: Datasworn.OracleRollable
		[NonCollectable.DelveSite]: Datasworn.DelveSite
		[NonCollectable.Truth]: Datasworn.Truth
		[NonCollectable.DelveSiteDomain]: Datasworn.DelveSiteDomain
		[NonCollectable.DelveSiteTheme]: Datasworn.DelveSiteTheme
		[NonCollectable.Rarity]: Datasworn.Rarity
	}

	export type TypeNode<T extends Any = Any> = TypeMap[T]
}

export default TypeElements
