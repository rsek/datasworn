import type { DictKey, ExpansionId, RulesetId } from './Datasworn.js'
import { type CONST, type TypeId } from './IdElements/index.js'
import type * as PathKeys from './IdElements/PathKeys.js'
import { type Join, type Split } from './Utils/String.js'

export type RulesPackageId = RulesetId | ExpansionId

export type TypeIdParts = string[]

type IdBase<
	TypeIds extends TypeIdParts,
	PathSegments extends string[] & { length: TypeIds['length'] }
> = `${Join<TypeIds, CONST.TypeSep>}${CONST.PrefixSep}${Join<PathSegments, CONST.TypeSep>}`

type f = IdBase<['move', 'oracle_rollable'], ['foo', 'bar']>

export type EmbeddedId<
	TypeIds extends [TypeId.Primary, ...string[]] = [TypeId.Primary, ...string[]],
	PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
		length: TypeIds['length']
	}
> = IdBase<TypeIds, PathSegments>

type PrimaryBase<
	TypeId extends TypeId.Primary,
	RulesPackage extends RulesPackageId,
	PathKeys extends DictKey[]
> = IdBase<[TypeId], [Join<[RulesPackage, ...PathKeys]>]>

export type Collection<
	TypeId extends TypeId.Collection = TypeId.Collection,
	RulesPackage extends RulesPackageId = RulesPackageId,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> = PrimaryBase<TypeId, RulesPackage, [...CollectionAncestorKeys, Key]>

export type ExtractCollectionType<T extends Collection> =
	T extends Collection<infer U extends TypeId.Collection> ? U : never
export type ExtractCollectableType<T extends Collectable> =
	T extends Collectable<infer U extends TypeId.Collectable> ? U : never
export type ExtractNonCollectableType<T extends NonCollectable> =
	T extends NonCollectable<infer U extends TypeId.NonCollectable> ? U : never

export type ExtractPrimaryRulesPackage<
	T extends `${string}:${string}${CONST.PathKeySep}${string}`
> = Split<Split<T, CONST.PrefixSep>[1], CONST.PathKeySep>[0]

export type ExtractNonCollectableKey<T extends NonCollectable> =
	T extends NonCollectable<
		TypeId.NonCollectable,
		string,
		infer U extends string
	>
		? U
		: never

export type ExtractCollectableKey<T extends Collectable> =
	T extends Collectable<
		TypeId.Collectable,
		string,
		PathKeys.CollectableAncestorKeys,
		infer U extends string
	>
		? U
		: never

export type ExtractCollectionKey<T extends Collection> =
	T extends Collection<
		TypeId.Collection,
		string,
		PathKeys.CollectionAncestorKeys,
		infer U extends string
	>
		? U
		: never

export type ExtractCollectionAncestorsKeys<T extends Collection> =
	T extends Collection<
		TypeId.Collection,
		string,
		infer U extends PathKeys.CollectionAncestorKeys,
		string
	>
		? U
		: never

export type ExtractCollectableAncestorsKeys<T extends Collectable> =
	T extends Collectable<
		TypeId.Collectable,
		string,
		infer U extends PathKeys.CollectableAncestorKeys,
		string
	>
		? U
		: never

export type Collectable<
	TypeId extends TypeId.Collectable = TypeId.Collectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	CollectionPathKeys extends
		PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
	Key extends string = string
> = PrimaryBase<TypeId, RulesPackage, [...CollectionPathKeys, Key]>

type _AssetCollectionId = Collection<
	'asset_collection',
	'starforged',
	['path'],
	string
>

export type NonCollectable<
	TypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	Key extends DictKey = DictKey
> = PrimaryBase<TypeId, RulesPackage, [Key]>

type _TruthId = NonCollectable<'truth', 'fff', 'f'>

export type Primary = Collectable | Collection | NonCollectable
