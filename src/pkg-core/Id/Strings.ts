import type { DictKey, ExpansionId, RulesetId } from '../Datasworn.js'
import type * as IdElements from '../IdElements/index.js'
import { type Join } from './Utils.js'

// next two types originally from https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range/70307091#comment127925458_70307091

type Enumerate<
	N extends number,
	Acc extends number[] = []
> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>

/** A Union of integer values from F to T, exclusive */
type Range<F extends number, T extends number> = Exclude<
	Enumerate<T>,
	Enumerate<F>
>

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

export type TupleOfLength<Length extends number, T> = T[] & { length: Length }
export type RulesPackageId = RulesetId | ExpansionId

// export type CollectionAncestorKeys = [] | [DictKey] | [DictKey, DictKey]
export type CollectionAncestorKeys = TupleOfLength<
	CollectionAncestorsLength,
	DictKey
>
// export type CollectionPathKeys =
// 	| [DictKey]
// 	| [DictKey, DictKey]
// 	| [DictKey, DictKey, DictKey]
export type CollectionPathKeys = TupleOfLength<CollectionPathLength, DictKey>
export type CollectablePathKeys = [...CollectionPathKeys, DictKey]
export type NonCollectablePathKeys = [DictKey]

/** ID for a valid collectable object for a collection ID. */
export type ExtractCollectee<T extends AnyCollectionId> =
	T extends Join<
		[
			infer A extends string,
			IdElements.CONST.CollectionsKey,
			infer B extends string
		],
		IdElements.CONST.Sep
	>
		? Join<[A, B, DictKey], IdElements.CONST.Sep>
		: never

// `${infer A}${IdElements.CONST.Sep}${IdElements.CONST.CollectionsKey}${IdElements.CONST.Sep}${infer B}`
// `${A}${IdElements.CONST.Sep}${B}${IdElements.CONST.Sep}${string}`

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${Key}`

export type OmitItemsOfType<T extends any[], O> = T extends [
	infer Head extends any,
	...infer Tail extends any[]
]
	? [...(Head extends O ? [] : [Head]), ...OmitItemsOfType<Tail, O>]
	: []

export type Id<
	RulesPackage extends RulesPackageId,
	TypeKey extends IdElements.TypeElements.Any,
	PathKeys extends DictKey[]
> = Join<[RulesPackage, TypeKey, ...PathKeys], IdElements.CONST.Sep>

// Subtype extends null
// 	? Join<[RulesPackage, Type, ...CollectionKeys, Key], IdElements.CONST.Sep>
// 	: Join<
// 			[RulesPackage, Type, Subtype, ...CollectionKeys, Key],
// 			IdElements.CONST.Sep
// 	  >

export type RecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collectable.Recursive = IdElements.TypeElements.Collectable.Recursive,
	AncestorKeys extends CollectionPathKeys = CollectionPathKeys,
	Key extends string = string
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>
type _AtlasEntryId = RecursiveCollectableId<
	string,
	IdElements.TypeElements.Collectable.Recursive.AtlasEntry,
	['ff'],
	'f'
>

export type CollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collectable.Any = IdElements.TypeElements.Collectable.Any,
	AncestorKeys extends DictKey[] = DictKey[],
	Key extends DictKey = DictKey
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${RecursiveCollectionKeys}${IdElements.CONST.Sep}${Key}`

export type NonRecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive,
	ParentKey extends DictKey = DictKey,
	Key extends DictKey = DictKey
> = CollectableId<RulesPackage, Type, [ParentKey], Key>
type _AssetId = NonRecursiveCollectableId<
	string,
	IdElements.TypeElements.Collectable.NonRecursive.Asset,
	'a',
	'b'
>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${Key}`

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${Key}`

export type CollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collection.Any = IdElements.TypeElements.Collection.Any,
	AncestorKeys extends string[] = string[],
	Key extends string = string
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>

export type RecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collection.Recursive = IdElements.TypeElements.Collection.Recursive,
	AncestorKeys extends CollectionAncestorKeys = CollectionAncestorKeys,
	Key extends string = string
> = CollectionId<RulesPackage, Type, AncestorKeys, Key>

type _AtlasCollectionId = RecursiveCollectionId<
	string,
	IdElements.TypeElements.Collection.Recursive.AtlasCollection,
	[],
	'f'
>

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${RecursiveCollectionKeysString}`
export type NonRecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collection.NonRecursive = IdElements.TypeElements.Collection.NonRecursive,
	Key extends DictKey = DictKey
> = CollectionId<RulesPackage, Type, [], Key>

type _AssetCollectionId = NonRecursiveCollectionId<
	string,
	IdElements.TypeElements.Collection.NonRecursive.AssetCollection
>

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${Key}`

export type NonCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.NonCollectable = IdElements.TypeElements.NonCollectable,
	Key extends DictKey = DictKey
> = Id<RulesPackage, Type, [Key]>

type _TruthId = NonCollectableId<
	'fff',
	IdElements.TypeElements.NonCollectable.Truth,
	'f'
>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${Key}`

export type AnyCollectableId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId

export type AnyCollectionId = RecursiveCollectionId | NonRecursiveCollectionId

export type AnyId = AnyCollectableId | AnyCollectionId | NonCollectableId

export type AnyCollectionKeys = CollectionAncestorKeys | CollectionPathKeys
