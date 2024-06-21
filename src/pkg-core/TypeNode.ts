import type * as Datasworn from './Datasworn.js'
import type TypeId from './IdElements/TypeId.js'
import type { DataswornSource } from './index.js'

namespace TypeNode {
	export type Collection<T extends TypeId.Collection = TypeId.Collection> =
		CollectionTypeMap[T]
	export type Collectable<T extends TypeId.Collectable = TypeId.Collectable> =
		CollectableTypeMap[T]
	export type NonCollectable<
		T extends TypeId.NonCollectable = TypeId.NonCollectable
	> = NonCollectableTypeMap[T]
	export type EmbedOnly<T extends TypeId.EmbedOnly = TypeId.EmbedOnly> =
		EmbedOnlyTypeMap[T]

	export type CollectionSource<
		T extends TypeId.Collection = TypeId.Collection
	> = CollectionSourceTypeMap[T]
	export type CollectableSource<
		T extends TypeId.Collectable = TypeId.Collectable
	> = CollectableSourceTypeMap[T]
	export type NonCollectableSource<
		T extends TypeId.NonCollectable = TypeId.NonCollectable
	> = NonCollectableSourceTypeMap[T]
	export type EmbedOnlySource<T extends TypeId.EmbedOnly = TypeId.EmbedOnly> =
		EmbedOnlySourceTypeMap[T]
	// type TypeMapLike<T extends string> = { [K in T]: { type: K } }

	type NonCollectableTypeMap = {
		delve_site: Datasworn.DelveSite
		truth: Datasworn.Truth
		delve_site_domain: Datasworn.DelveSiteDomain
		delve_site_theme: Datasworn.DelveSiteTheme
		rarity: Datasworn.Rarity
	}

	type CollectableTypeMap = {
		asset: Datasworn.Asset
		move: Datasworn.Move
		atlas_entry: Datasworn.AtlasEntry
		oracle_rollable: Datasworn.OracleRollable
		npc: Datasworn.Npc
	}

	type CollectionTypeMap = {
		asset_collection: Datasworn.AssetCollection
		move_category: Datasworn.MoveCategory
		atlas_collection: Datasworn.AtlasCollection
		npc_collection: Datasworn.NpcCollection
		oracle_collection: Datasworn.OracleCollection
	}

	type PrimaryTypeMap = CollectionTypeMap &
		CollectableTypeMap &
		NonCollectableTypeMap

	type NonCollectableSourceTypeMap = {
		delve_site: DataswornSource.DelveSite
		truth: DataswornSource.Truth
		delve_site_domain: DataswornSource.DelveSiteDomain
		delve_site_theme: DataswornSource.DelveSiteTheme
		rarity: DataswornSource.Rarity
	}

	type CollectableSourceTypeMap = {
		asset: DataswornSource.Asset
		move: DataswornSource.Move
		atlas_entry: DataswornSource.AtlasEntry
		oracle_rollable: DataswornSource.OracleRollable
		npc: DataswornSource.Npc
	}

	type CollectionSourceTypeMap = {
		asset_collection: DataswornSource.AssetCollection
		move_category: DataswornSource.MoveCategory
		atlas_collection: DataswornSource.AtlasCollection
		npc_collection: DataswornSource.NpcCollection
		oracle_collection: DataswornSource.OracleCollection
	}

	type PrimarySourceTypeMap = CollectionSourceTypeMap &
		CollectableSourceTypeMap &
		NonCollectableSourceTypeMap

	type EmbedOnlyTypeMap = {
		ability: Datasworn.AssetAbility
		option: Datasworn.TruthOption
		row: Datasworn.OracleRollableRow
		feature: Datasworn.DelveSiteThemeFeature | Datasworn.DelveSiteDomainFeature
		danger: Datasworn.DelveSiteThemeDanger | Datasworn.DelveSiteDomainDanger
		denizen: Datasworn.DelveSiteDenizen
		variant: Datasworn.NpcVariant
	}

	type EmbedOnlySourceTypeMap = {
		ability: DataswornSource.AssetAbility
		option: DataswornSource.TruthOption
		row: DataswornSource.OracleRollableRow
		feature:
			| DataswornSource.DelveSiteThemeFeature
			| DataswornSource.DelveSiteDomainFeature
		danger:
			| DataswornSource.DelveSiteThemeDanger
			| DataswornSource.DelveSiteDomainDanger
		denizen: DataswornSource.DelveSiteDenizen
		variant: DataswornSource.NpcVariant
	}

	type EmbeddableTypeMap = Pick<
		EmbedOnlyTypeMap & PrimaryTypeMap,
		TypeId.Embeddable
	>
	type EmbeddableSourceTypeMap = Pick<
		EmbedOnlySourceTypeMap & PrimarySourceTypeMap,
		TypeId.Embeddable
	>

	export type CollectableOf<T extends Collection> = ByType<
		TypeId.CollectableOf<T['type']>
	> &
		Collectable

	/** Gets the node type(s) corresponding to a given TypeId. */
	export type ByType<T extends keyof PrimaryTypeMap | keyof EmbeddableTypeMap> =
		T extends keyof PrimaryTypeMap
			? T extends keyof EmbeddableTypeMap
				? PrimaryTypeMap[T] | EmbeddableTypeMap[T]
				: PrimaryTypeMap[T]
			: T extends keyof EmbeddableTypeMap
				? EmbeddableTypeMap[T]
				: never

	export type BySourceType<
		T extends keyof PrimarySourceTypeMap | keyof EmbedOnlySourceTypeMap
	> = T extends keyof PrimarySourceTypeMap
		? T extends keyof EmbedOnlySourceTypeMap
			? PrimarySourceTypeMap[T] | EmbedOnlySourceTypeMap[T]
			: PrimarySourceTypeMap[T]
		: T extends keyof EmbedOnlySourceTypeMap
			? EmbedOnlySourceTypeMap[T]
			: never

	/** Any Datasworn primary node type. */
	export type Primary<T extends TypeId.Primary = TypeId.Primary> =
		PrimaryTypeMap[T]

	/** Any Datasworn embedded node type. */
	export type Embedded<
		T extends keyof EmbeddableTypeMap = keyof EmbeddableTypeMap
	> = EmbeddableTypeMap[T]

	/** Any primary or embedded Datasworn node type. */
	export type Any = Primary | Embedded
}

export default TypeNode
