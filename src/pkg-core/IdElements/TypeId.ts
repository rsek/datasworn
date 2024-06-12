import type * as Datasworn from '../Datasworn.js'
import CONST from './CONST.js'

/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
namespace TypeId {
	/** Object types that can exist in collections. */
	export const Collectable = [
		'atlas_entry',
		'npc',
		'oracle_rollable',
		'asset',
		'move'
	] as const
	export type Collectable = (typeof Collectable)[number]

	export const Collection = [
		'atlas_collection',
		'npc_collection',
		'oracle_collection',
		'asset_collection',
		'move_category'
	] as const
	export type Collection = (typeof Collection)[number]

	/** ID type elements for types that don't use collections at all. */
	export const NonCollectable = [
		'delve_site',
		'delve_site_domain',
		'delve_site_theme',
		'rarity',
		'truth'
	] as const
	export type NonCollectable = (typeof NonCollectable)[number]

	/** Any primary node type. Primary node types can have IDs that address only their type (IDs without '.' separators). */
	export type AnyPrimary = Collectable | Collection | NonCollectable

	export const CollectedByMap = {
		asset_collection: 'asset',
		move_category: 'move',
		atlas_collection: 'atlas_entry',
		npc_collection: 'npc',
		oracle_collection: 'oracle_rollable'
	} as const satisfies Record<Collection, Collectable>

	export type CollectableOf<T extends Collection> = (typeof CollectedByMap)[T]

	export function getCollectableOf<T extends Collection>(typeId: T) {
		return CollectedByMap[typeId] as CollectableOf<T>
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

	export type CollectionOf<T extends Collectable> = (typeof CollectionOfMap)[T]
	export function getCollectionOf<T extends Collectable>(typeId: T) {
		return CollectionOfMap[typeId] as CollectionOf<T>
	}

	export const EmbeddablePrimaryTypes = [
		'oracle_rollable',
		'move'
	] as const satisfies [...(Collectable | NonCollectable)[]]
	export type EmbeddablePrimaryTypes = (typeof EmbeddablePrimaryTypes)[number]
	export const EmbedOnlyTypes = ['ability', 'option'] as const
	export type EmbedOnlyTypes = (typeof EmbedOnlyTypes)[number]
	type EmbedOnlyTypePath = `${AnyPrimary}${CONST.PathTypeSep}${EmbedOnlyTypes}`
	export const EmbeddableTypes = [
		'oracle_rollable',
		'move',
		'ability',
		'option'
	] as const satisfies [
		...typeof EmbeddablePrimaryTypes,
		...typeof EmbedOnlyTypes
	]
	export type EmbeddableTypes = (typeof EmbeddableTypes)[number]

	export const EmbeddedTypePaths = [
		'asset.ability',
		'truth.option',
		'move.oracle_rollable'
	] as const satisfies [
		...(
			| `${AnyPrimary}${CONST.PathTypeSep}${EmbeddablePrimaryTypes}`
			| EmbedOnlyTypePath
		)[]
	]
	export type EmbeddedTypePaths = (typeof EmbeddedTypePaths)[number]

	export const EmbedOfEmbedTypePaths = [
		'asset.ability.move',
		'asset.ability.oracle_rollable',
		'truth.option.oracle_rollable'
	] as const satisfies `${EmbeddedTypePaths}${CONST.PathTypeSep}${EmbeddablePrimaryTypes}`[]
	export type EmbedOfEmbedTypePaths = (typeof EmbedOfEmbedTypePaths)[number]

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
	} as const satisfies Record<AnyPrimary, keyof Datasworn.RulesPackage>
  export type RootKeys<T extends AnyPrimary = AnyPrimary> = (typeof RootKeys)[T]

	export const EmbeddedPropertyKeys = {
		ability: 'abilities',
		option: 'options'
	} as const satisfies Record<EmbedOnlyTypes, string>

	export type Any = AnyPrimary | EmbeddedTypePaths | EmbedOfEmbedTypePaths

	export type RootKey<T extends AnyPrimary = AnyPrimary> = (typeof RootKeys)[T]
	export type EmbeddedPropertyKey<T extends EmbeddableTypes> =
		T extends keyof typeof EmbeddedPropertyKeys
			? (typeof EmbeddedPropertyKeys)[T]
			: T extends AnyPrimary
				? RootKey<T>
				: never

	export function getRootKey<T extends AnyPrimary>(typeId: T) {
		const result = RootKeys[typeId] as RootKey<T>
		if (result == null)
			throw new Error(`Expected primary TypeId but got ${typeId}`)
		return result
	}
	export function getEmbeddedPropertyKey<T extends EmbeddableTypes>(
		typeId: T
	): EmbeddedPropertyKey<T> {
		const result =
			typeId in EmbeddedPropertyKeys
				? // @ts-expect-error
					EmbeddedPropertyKeys[typeId]
				: null

		if (result != null) return result

		try {
			return getRootKey(typeId as any)
		} catch (e) {
			throw new Error(`Expected embeddable TypeId but got ${typeId}`)
		}
	}

	export function getEmbeddableTypes<T extends Any>(typeId: T) {
		const allEmbeddedTypePaths = [
			...EmbeddedTypePaths,
			...EmbedOfEmbedTypePaths
		]
		const matches = new Set<string>()

		for (const typePath of allEmbeddedTypePaths) {
			const typeHead = typeId + CONST.PathTypeSep
			if (typePath.startsWith(typeId))
				matches.add(
					typePath
						// remove the parts that represent the current path
						.replace(typeHead, '')
						// get the first relevant segment
						.split(CONST.PathTypeSep)[0]
				)
		}

		return Array.from(matches) as EmbeddableTypes[]
	}
}

export default TypeId
