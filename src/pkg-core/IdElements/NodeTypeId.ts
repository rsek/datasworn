import type * as Datasworn from '../Datasworn.js'

/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
namespace NodeTypeId {
	export namespace Collectable {
		export const Recursive = ['atlas_entry', 'npc', 'oracle_rollable'] as const
		/** Object types that can exist in recursive collections. */
		export type Recursive = (typeof Recursive)[number]

		export const NonRecursive = ['asset', 'move'] as const
		/** ID type elements for types that can exist in non-recursive collections. */
		export type NonRecursive = (typeof NonRecursive)[number]

		/** Union of ID type elements for types that can exist in recursive or non-recursive collections. */
		export type Any = Recursive | NonRecursive
	}

	export namespace Collection {
		export const Recursive = [
			'atlas_collection',
			'npc_collection',
			'oracle_collection'
		] as const
		export type Recursive = (typeof Recursive)[number]
		export const NonRecursive = ['asset_collection', 'move_category'] as const
		export type NonRecursive = (typeof NonRecursive)[number]

		export type Any = Recursive | NonRecursive
	}

	/** ID type elements for types that don't use collections at all. */
	export const NonCollectable = [
		'delve_site',
		'delve_site_domain',
		'delve_site_theme',
		'rarity',
		'truth'
	] as const
	export type NonCollectable = (typeof NonCollectable)[number]

	export type Any = Collectable.Any | Collection.Any | NonCollectable

	export const CollectedByMap = {
		asset_collection: 'asset',
		move_category: 'move',
		atlas_collection: 'atlas_entry',
		npc_collection: 'npc',
		oracle_collection: 'oracle_rollable'
	} as const satisfies Record<Collection.Any, Collectable.Any>

	export type CollectedBy<T extends Collection.Any> = (typeof CollectedByMap)[T]

	export function getCollectedBy<T extends Collection.Any>(typeId: T) {
		return CollectedByMap[typeId] as CollectedBy<T>
	}

	export const CollectionOfMap = {
		asset: 'asset_collection',
		move: 'move_category',
		atlas_entry: 'atlas_collection',
		npc: 'npc_collection',
		oracle_rollable: 'oracle_collection'
	} as const satisfies {
		[k in keyof typeof CollectedByMap as (typeof CollectedByMap)[k]]: k
	}

	export type CollectionOf<T extends Collectable.Any> =
		(typeof CollectionOfMap)[T]
	export function getCollectionOf<T extends Collectable.Any>(typeId: T) {
		return CollectionOfMap[typeId] as CollectionOf<T>
	}

	export const RootKeys = {
		asset_collection: 'assets',
		asset: 'assets',
		move_category: 'moves',
		move: 'moves',
		atlas_collection: 'atlas',
		atlas_entry: 'atlas',
		npc_collection: 'npcs',
		npc: 'npcs',
		oracle_collection: 'oracles',
		oracle_rollable: 'oracles',
		delve_site: 'delve_sites',
		truth: 'truths',
		delve_site_domain: 'site_domains',
		delve_site_theme: 'site_themes',
		rarity: 'rarities'
	} as const satisfies Record<Any, keyof Datasworn.RulesPackage>

	export type RootKey<T extends Any = Any> = (typeof RootKeys)[T]
	export function getRootKey<T extends Any>(typeId: T) {
		return RootKeys[typeId] as RootKey<T>
	}
}

export default NodeTypeId
