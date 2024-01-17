import type * as IdElements from '../IdElements/index.js'
import { type AnyTypeKeys, type Join } from './Utils.js'

export type RulesPackageId = string
export type DictKey = string

export type CollectionAncestorKeys = [] | [DictKey] | [DictKey, DictKey]
export type CollectionPathKeys =
	| [DictKey]
	| [DictKey, DictKey]
	| [DictKey, DictKey, DictKey]
export type CollectablePathKeys = [...CollectionPathKeys, DictKey]
export type NonCollectablePathKeys = [DictKey]

/** ID for a valid collectable object for a collection ID. */
export type ExtractCollectee<T extends AnyCollectionId> = T extends Join<
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
	TypeKeys extends AnyTypeKeys,
	PathKeys extends string[]
> = Join<[RulesPackage, ...TypeKeys, ...PathKeys], IdElements.CONST.Sep>

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
> = Id<RulesPackage, [Type], [...AncestorKeys, Key]>
type _AtlasEntryId = RecursiveCollectableId<string, 'atlas'>

export type CollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collectable.Any = IdElements.TypeElements.Collectable.Any,
	AncestorKeys extends DictKey[] = DictKey[],
	Key extends DictKey = DictKey
> = Id<RulesPackage, [Type], [...AncestorKeys, Key]>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${RecursiveCollectionKeys}${IdElements.CONST.Sep}${Key}`

export type NonRecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive,
	ParentKey extends DictKey = DictKey,
	Key extends DictKey = DictKey
> = CollectableId<RulesPackage, Type, [ParentKey], Key>
type _AssetId = NonRecursiveCollectableId<string, 'moves'>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${Key}`

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${Key}`

export type CollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Subtype extends
		IdElements.TypeElements.Collectable.Any = IdElements.TypeElements.Collectable.Any,
	AncestorKeys extends string[] = string[],
	Key extends string = string
> = Id<
	RulesPackage,
	[IdElements.TypeElements.Collection, Subtype],
	[...AncestorKeys, Key]
>

export type RecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Subtype extends
		IdElements.TypeElements.Collectable.Recursive = IdElements.TypeElements.Collectable.Recursive,
	AncestorKeys extends CollectionAncestorKeys = CollectionAncestorKeys,
	Key extends string = string
> = CollectionId<RulesPackage, Subtype, AncestorKeys, Key>

type _AtlasId = RecursiveCollectionId<string, 'atlas'>

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${RecursiveCollectionKeysString}`
export type NonRecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Subtype extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive,
	Key extends DictKey = DictKey
> = CollectionId<RulesPackage, Subtype, [], Key>

type _AssetCollectionId = NonRecursiveCollectionId<string, 'moves'>

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${Key}`

export type NonCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		IdElements.TypeElements.NonCollectable = IdElements.TypeElements.NonCollectable,
	Key extends DictKey = DictKey
> = Id<RulesPackage, [Type], [Key]>

type _TruthId = NonCollectableId<string, 'truths'>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${Key}`

export type AnyCollectableId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId

export type AnyCollectionId = RecursiveCollectionId | NonRecursiveCollectionId

export type AnyId = AnyCollectableId | AnyCollectionId | NonCollectableId

export type AnyCollectionKeys = CollectionAncestorKeys | CollectionPathKeys

export type SubtypeOf<Type extends IdElements.TypeElements.AnyPrimary> =
	Type extends IdElements.TypeElements.Collection
		? IdElements.TypeElements.Collectable.Any
		: null
