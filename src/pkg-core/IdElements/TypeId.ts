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

	export const AnyPrimary = [
		...Collectable,
		...Collection,
		...NonCollectable
	] satisfies [
		...typeof Collectable,
		...typeof Collection,
		...typeof NonCollectable
	]

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

	export const EmbeddablePrimaryType = [
		'oracle_rollable',
		'move'
	] as const satisfies [...(Collectable | NonCollectable)[]]
	export type EmbeddablePrimaryType = (typeof EmbeddablePrimaryType)[number]
	export const EmbedOnlyType = ['ability', 'option', 'row'] as const
	export type EmbedOnlyType = (typeof EmbedOnlyType)[number]
	export const EmbeddableType = [
		'oracle_rollable',
		'move',
		'ability',
		'option',
		'row'
	] as const satisfies [
		...typeof EmbeddablePrimaryType,
		...typeof EmbedOnlyType
	]
	export type EmbeddableType = (typeof EmbeddableType)[number]

	export const EmbedTypeMap = {
		asset: ['ability'],
		ability: ['move', 'oracle_rollable'],
		truth: ['option'],
		option: ['oracle_rollable'],
		move: ['oracle_rollable'],
		oracle_rollable: ['row']
	} as const satisfies Partial<
		Record<AnyPrimary | EmbedOnlyType, EmbeddableType[]>
	>
	export type CanEmbed = keyof typeof EmbedTypeMap

	export const AllowedEmbedOfEmbedTypes = {
		ability: ['oracle_rollable', 'move'],
		move: [],
		option: ['oracle_rollable'],
		oracle_rollable: ['row']
	} as const satisfies {
		[T in EmbeddableType & CanEmbed]: (typeof EmbedTypeMap)[T][number][]
	}

	export function canHaveEmbed(typeId: string, typeIsEmbedded = false) {
		return getEmbeddableTypes(typeId, typeIsEmbedded).length > 0
	}

	export function canBeEmbedded(typeId: string) {
		return getTypesThatCanHaveEmbedOfType(typeId).length > 0
	}

	export function isPrimary(typeId: string): typeId is AnyPrimary {
		return AnyPrimary.includes(typeId as AnyPrimary)
	}
	export function isEmbedOnly(typeId: string): typeId is EmbedOnlyType {
		return EmbedOnlyType.includes(typeId as EmbedOnlyType)
	}

	export function getEmbeddableTypes(
		typeId: string,
		typeIsEmbedded = false
	): EmbeddableType[] {
		if (typeIsEmbedded) return AllowedEmbedOfEmbedTypes[typeId] ?? []

		return EmbedTypeMap[typeId] ?? []
	}

	export function getTypesThatCanHaveEmbedOfType(typeId: string): CanEmbed[] {
		const typeIds: CanEmbed[] = []

		for (const embedder in EmbedTypeMap) {
			const embeddables = EmbedTypeMap[embedder]
			if (embeddables.includes(typeId)) typeIds.push(embedder as CanEmbed)
		}

		return typeIds
	}

	export type CanEmbedType<T extends EmbeddableType = EmbeddableType> = {
		[P in keyof typeof EmbedTypeMap as (typeof EmbedTypeMap)[P][number]]: P
	}[T]

	export const EmbeddedTypePaths = [] as string[]

	function expandTypePath(typeId: CanEmbed, path: string[] = []) {
		const isPrimary = path.length === 0
		const thisPath = [...path, typeId]
		if (!isPrimary) EmbeddedTypePaths.push(thisPath.join(CONST.PathTypeSep))
		if (typeId in EmbedTypeMap) {
			for (const childTypeId of EmbedTypeMap[typeId])
				if (
					isPrimary ||
					(AllowedEmbedOfEmbedTypes[typeId] ?? []).includes(childTypeId)
				)
					expandTypePath(childTypeId as CanEmbed, thisPath)
		}
	}

	for (const typeId in EmbedTypeMap) expandTypePath(typeId as CanEmbed)

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
		option: 'options',
		row: 'rows'
	} as const satisfies Record<EmbedOnlyType, string>

	export type Any = AnyPrimary | EmbedOnlyType
	// | EmbeddedTypePath | EmbedOfEmbedTypePaths

	export type RootKey<T extends AnyPrimary = AnyPrimary> = (typeof RootKeys)[T]
	export type EmbeddedPropertyKey<T extends EmbeddableType> =
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
	export function getEmbeddedPropertyKey<T extends EmbeddableType>(
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
}

export default TypeId
