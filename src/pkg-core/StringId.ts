import type { DictKey, ExpansionId, RulesetId } from './Datasworn.js'
import { type CONST, type TypeId } from './IdElements/index.js'
import type * as PathKeys from './IdElements/PathKeys.js'
import { type Join, type Split } from './Utils/String.js'

export type RulesPackageId = RulesetId | ExpansionId

export type TypeIdParts = string[]

export type IdBase<
	TypeIds extends TypeIdParts,
	PathSegments extends string[] & { length: TypeIds['length'] }
> = `${Join<TypeIds, CONST.PathTypeSep>}${CONST.PrefixSep}${Join<PathSegments, CONST.PathTypeSep>}`

type f = IdBase<['move', 'oracle_rollable'], ['foo', 'bar']>

export type EmbeddedId<
	TypeIds extends [TypeId.AnyPrimary, ...string[]]= [TypeId.AnyPrimary, ...string[]],
	PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
		length: TypeIds['length']
	}
> = IdBase<TypeIds, PathSegments>

export type PrimaryId<
	TypeId extends TypeId.AnyPrimary,
	RulesPackage extends RulesPackageId,
	PathKeys extends DictKey[]
> = IdBase<[TypeId], [Join<[RulesPackage, ...PathKeys]>]>

export type CollectionId<
	TypeId extends TypeId.Collection = TypeId.Collection,
	RulesPackage extends RulesPackageId = RulesPackageId,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> = PrimaryId<TypeId, RulesPackage, [...CollectionAncestorKeys, Key]>

export type CollectableId<
	TypeId extends TypeId.Collectable = TypeId.Collectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	CollectionPathKeys extends
		PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
	Key extends string = string
> = PrimaryId<TypeId, RulesPackage, [...CollectionPathKeys, Key]>

type _AssetCollectionId = CollectionId<
	'asset_collection',
	'starforged',
	['path'],
	string
>

export type NonCollectableId<
	TypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	Key extends DictKey = DictKey
> = PrimaryId<TypeId, RulesPackage, [Key]>

type _TruthId = NonCollectableId<'truth', 'fff', 'f'>

export type AnyId = CollectableId | CollectionId | NonCollectableId
