import type { DictKey, ExpansionId, RulesetId } from '../Datasworn.js'
import type * as IdElements from '../IdElements/index.js'
import { type TupleOfLength } from './ArrayUtils.js'
import { type Range } from './NumberUtils.js'
import { type Join } from './StringUtils.js'

type CollectionPathLength =
	| IdElements.CONST.RECURSIVE_PATH_ELEMENTS_MIN
	| Range<
			IdElements.CONST.RECURSIVE_PATH_ELEMENTS_MIN,
			IdElements.CONST.RECURSIVE_PATH_ELEMENTS_MAX
	  >
	| IdElements.CONST.RECURSIVE_PATH_ELEMENTS_MAX

type CollectionAncestorsLength =
	| 0
	| Range<
			IdElements.CONST.RECURSIVE_PATH_ELEMENTS_MIN,
			IdElements.CONST.RECURSIVE_PATH_ELEMENTS_MAX
	  >

export type RulesPackageId = RulesetId | ExpansionId

export type CollectionAncestorKeys =
	| TupleOfLength<CollectionAncestorsLength, DictKey>
	| []
export type CollectionPathKeys = [...CollectionAncestorKeys, DictKey]
export type CollectableAncestorKeys = CollectionPathKeys
export type CollectablePathKeys = [...CollectableAncestorKeys, DictKey]
export type NonCollectablePathKeys = [DictKey]

export type OmitItemsOfType<T extends any[], O> = T extends [
	infer Head extends any,
	...infer Tail extends any[]
]
	? [...(Head extends O ? [] : [Head]), ...OmitItemsOfType<Tail, O>]
	: []

export type Id<
	RulesPackage extends RulesPackageId,
	TypeKey extends IdElements.TypeId.Any,
	PathKeys extends DictKey[]
> = Join<[RulesPackage, TypeKey, ...PathKeys], IdElements.CONST.Sep>

export type RecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.Collectable.Recursive = IdElements.TypeId.Collectable.Recursive,
	AncestorKeys extends CollectionPathKeys = CollectionPathKeys,
	Key extends string = string
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>
type _AtlasEntryId = RecursiveCollectableId<string, 'atlas_entry', ['ff'], 'f'>

export type CollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.Collectable.Any = IdElements.TypeId.Collectable.Any,
	AncestorKeys extends DictKey[] = DictKey[],
	Key extends DictKey = DictKey
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>

export type NonRecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.Collectable.NonRecursive = IdElements.TypeId.Collectable.NonRecursive,
	ParentKey extends DictKey = DictKey,
	Key extends DictKey = DictKey
> = CollectableId<RulesPackage, Type, [ParentKey], Key>
type _AssetId = NonRecursiveCollectableId<string, 'asset', 'a', 'b'>

export type CollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.Collection.Any = IdElements.TypeId.Collection.Any,
	CollectionPathKeys extends string[] = string[],
	Key extends string = string
> = Id<RulesPackage, Type, [...CollectionPathKeys, Key]>

export type RecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.Collection.Recursive = IdElements.TypeId.Collection.Recursive,
	CollectionPathKeys extends CollectionAncestorKeys = CollectionAncestorKeys,
	Key extends string = string
> = CollectionId<RulesPackage, Type, CollectionPathKeys, Key>

type _AtlasCollectionId = RecursiveCollectionId<
	string,
	'atlas_collection',
	[],
	'f'
>

export type NonRecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.Collection.NonRecursive = IdElements.TypeId.Collection.NonRecursive,
	Key extends DictKey = DictKey
> = CollectionId<RulesPackage, Type, [], Key>

type _AssetCollectionId = NonRecursiveCollectionId<
	string,
	'asset_collection',
	'path'
>

export type NonCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeId.NonCollectable = IdElements.TypeId.NonCollectable,
	Key extends DictKey = DictKey
> = Id<RulesPackage, Type, [Key]>

type _TruthId = NonCollectableId<'fff', 'truth', 'f'>

export type AnyCollectableId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId

export type AnyCollectionId = RecursiveCollectionId | NonRecursiveCollectionId

export type AnyId = AnyCollectableId | AnyCollectionId | NonCollectableId
