import type * as Datasworn from '../Datasworn.js'
import { TypeSep } from './CONST.js'

/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * On major nodes, TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
namespace TypeId {
	/** Object types that can exist in collections. */
	export const Collectable = [
		'atlas_entry',
		'npc',
		'oracle_rollable',
		'asset',
		'move',
	] as const
	export type Collectable = (typeof Collectable)[number]

	export const Collection = [
		'atlas_collection',
		'npc_collection',
		'oracle_collection',
		'asset_collection',
		'move_category',
	] as const
	export type Collection = (typeof Collection)[number]

	/** ID type elements for types that don't use collections at all. */
	export const NonCollectable = [
		'delve_site',
		'delve_site_domain',
		'delve_site_theme',
		'rarity',
		'truth',
	] as const
	export type NonCollectable = (typeof NonCollectable)[number]

	/** Any primary node type. Primary node types can have IDs that address only their type (IDs without '.' separators). */
	export type Primary = Collectable | Collection | NonCollectable

	export const Primary = [
		...Collectable,
		...Collection,
		...NonCollectable,
	] satisfies [
		...typeof Collectable,
		...typeof Collection,
		...typeof NonCollectable,
	]

	export const CollectedByMap = {
		asset_collection: 'asset',
		move_category: 'move',
		atlas_collection: 'atlas_entry',
		npc_collection: 'npc',
		oracle_collection: 'oracle_rollable',
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
		oracle_rollable: 'oracle_collection',
	} as const satisfies {
		[k in keyof typeof CollectedByMap as (typeof CollectedByMap)[k]]: k
	}

	export type CollectionOf<T extends Collectable> = (typeof CollectionOfMap)[T]
	export function getCollectionOf<T extends Collectable>(typeId: T) {
		return CollectionOfMap[typeId] as CollectionOf<T>
	}

	export const EmbeddablePrimary = [
		'oracle_rollable',
		'move',
	] as const satisfies [...(Collectable | NonCollectable)[]]
	export type EmbeddablePrimary = (typeof EmbeddablePrimary)[number]
	export const EmbedOnly = [
		'ability',
		'option',
		'row',
		'feature',
		'danger',
		'denizen',
		'variant',
	] as const
	export type EmbedOnly = (typeof EmbedOnly)[number]
	export const Embeddable = [
		'oracle_rollable',
		'move',
		'ability',
		'option',
		'row',
		'feature',
		'danger',
		'denizen',
		'variant',
	] as const satisfies [...typeof EmbeddablePrimary, ...typeof EmbedOnly]
	export type Embeddable = EmbeddablePrimary | EmbedOnly

	export const EmbedTypeMap = {
		asset: ['ability'],
		ability: ['move', 'oracle_rollable'],
		truth: ['option'],
		option: ['oracle_rollable'],
		move: ['oracle_rollable'],
		oracle_rollable: ['row'],
		delve_site: ['denizen'],
		delve_site_domain: ['feature', 'danger'],
		delve_site_theme: ['feature', 'danger'],
		npc: ['variant'],
	} as const satisfies Partial<Record<Primary | EmbedOnly, Embeddable[]>>
	export type Embedding = keyof typeof EmbedTypeMap

	export type EmbeddableIn<T extends Embedding> =
		(typeof EmbedTypeMap)[T][number]

	/** Types that can be an embed of an embed. */
	export const EmbeddableInEmbeddedTypeMap = {
		ability: ['oracle_rollable', 'move'],
		move: [],
		option: ['oracle_rollable'],
		oracle_rollable: ['row'],
	} as const satisfies {
		[T in Embeddable & Embedding]: (typeof EmbedTypeMap)[T][number][]
	}

	export type EmbeddingWhenEmbeddedType =
		keyof typeof EmbeddableInEmbeddedTypeMap

	export type EmbeddableInEmbeddedType<
		T extends EmbeddingWhenEmbeddedType = EmbeddingWhenEmbeddedType,
	> = (typeof EmbeddableInEmbeddedTypeMap)[T][number]

	export function canHaveEmbed(
		typeId: string,
		typeIsEmbedded = false
	): typeId is Embedding {
		return getEmbeddableTypes(typeId as Any, typeIsEmbedded).length > 0
	}

	export function canBeEmbedded(typeId: string) {
		return getTypesThatCanHaveEmbedOfType(typeId).length > 0
	}

	export function isPrimary(typeId: string): typeId is Primary {
		return Primary.includes(typeId as Primary)
	}
	export function isEmbedOnly(typeId: string): typeId is EmbedOnly {
		return EmbedOnly.includes(typeId as EmbedOnly)
	}

	export function getEmbeddableTypes(
		embeddingType: Any,
		typeIsEmbedded = false
	): Embeddable[] {
		if (typeIsEmbedded) return (EmbeddableInEmbeddedTypeMap as Record<string, Embeddable[]>)[embeddingType] ?? []

		return (EmbedTypeMap as Record<string, Embeddable[]>)[embeddingType] ?? []
	}

	export function getTypesThatCanHaveEmbedOfType(typeId: string): Embedding[] {
		const typeIds: Embedding[] = []

		for (const embedder in EmbedTypeMap) {
			const embeddables = (EmbedTypeMap as Record<string, string[]>)[embedder]
			if (embeddables.includes(typeId)) typeIds.push(embedder as Embedding)
		}

		return typeIds
	}

	export type CanEmbedType<T extends Embeddable = Embeddable> = {
		[P in keyof typeof EmbedTypeMap as (typeof EmbedTypeMap)[P][number]]: P
	}[T]

	export const EmbeddedTypePath = [] as string[]

	function expandTypePath(typeId: Embedding, path: string[] = []) {
		const isPrimary = path.length === 0
		const thisPath = [...path, typeId]
		if (!isPrimary) EmbeddedTypePath.push(thisPath.join(TypeSep))
		if (typeId in EmbedTypeMap) {
			for (const childTypeId of (EmbedTypeMap as Record<string, string[]>)[typeId])
				if (
					isPrimary ||
					((EmbeddableInEmbeddedTypeMap as Record<string, string[]>)[typeId] ?? []).includes(childTypeId)
				)
					expandTypePath(childTypeId as Embedding, thisPath)
		}
	}

	for (const typeId in EmbedTypeMap) expandTypePath(typeId as Embedding)

	export const EmbeddedPropertyKeys = {
		ability: 'abilities',
		option: 'options',
		row: 'rows',
		feature: 'features',
		danger: 'dangers',
		denizen: 'denizens',
		variant: 'variants',
	} as const satisfies Record<EmbedOnly, string>

	// TODO
	// is there a logic to this that i can formalize?
	// i think it comes down to whether the type has a required `name` property to generate a key from.
	const EmbeddedPropertyType = {
		abilities: 'array',
		dangers: 'array',
		denizens: 'array',
		features: 'array',
		options: 'array',
		rows: 'array',
		variants: 'dictionary',
	} as const satisfies Record<
		EmbeddedPropertyKey<EmbedOnly>,
		'array' | 'dictionary'
	>

	export function getEmbeddedPropertyType(
		typeId: TypeId.Any
	): 'array' | 'dictionary' {
		if (Primary.includes(typeId as Primary)) return 'dictionary'

		const propKey = getEmbeddedPropertyKey(typeId as EmbedOnly)

		if (propKey == null)
			throw new Error(
				`Expected an embeddable TypeId, but got ${String(typeId)}`
			)

		return EmbeddedPropertyType[propKey]
	}

	export type Any = Primary | EmbedOnly
	export const Any = [
		'atlas_entry',
		'npc',
		'oracle_rollable',
		'asset',
		'move',
		'atlas_collection',
		'npc_collection',
		'oracle_collection',
		'asset_collection',
		'move_category',
		'delve_site',
		'delve_site_domain',
		'delve_site_theme',
		'rarity',
		'truth',
		'ability',
		'option',
		'row',
		'feature',
		'danger',
		'denizen',
		'variant',
	] as const satisfies [...typeof Primary, ...typeof EmbedOnly]
	// | EmbeddedTypePath | EmbedOfEmbedTypePaths

	/** The ancestor key of this type on the {@link Datasworn.RulesPackage} object. */
	export const BranchKey = {
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
		rarity: 'rarities',
	} as const satisfies Record<Primary, keyof Datasworn.RulesPackage>

	export type BranchKey<T extends Primary = Primary> = (typeof BranchKey)[T]

	/** The ancestor key of this type when it's embedded in another object. */
	export type EmbeddedPropertyKey<T extends Embeddable> =
		T extends keyof typeof EmbeddedPropertyKeys
			? (typeof EmbeddedPropertyKeys)[T]
			: T extends Primary
				? BranchKey<T>
				: never

	export function getBranchKey<T extends Primary>(typeId: T) {
		const result = BranchKey[typeId] as BranchKey<T>
		if (result == null)
			throw new Error(`Expected primary TypeId but got ${typeId}`)
		return result
	}
	export function getEmbeddedPropertyKey<T extends Embeddable>(
		typeId: T
	): EmbeddedPropertyKey<T> {
		const result =
			typeId in EmbeddedPropertyKeys
				? // @ts-expect-error
					EmbeddedPropertyKeys[typeId]
				: null

		if (result != null) return result

		try {
			return getBranchKey(typeId as any)
		} catch (e) {
			throw new Error(`Expected embeddable TypeId but got ${typeId}`)
		}
	}
}

export default TypeId
