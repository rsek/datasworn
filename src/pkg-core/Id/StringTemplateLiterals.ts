import type * as IdElements from './IdElements/index.js'
import { type Join } from './Utils.js'

export type RulesPackageId = string
export type DictKey = string

type CollectionAncestors = [] | [DictKey] | [DictKey, DictKey]
type RecursiveCollectionKeys = [...CollectionAncestors, DictKey]

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

export type RecursiveCollectableId<
	Type extends
		IdElements.TypeElements.Collectable.Recursive = IdElements.TypeElements.Collectable.Recursive,
	RulesPackage extends RulesPackageId = RulesPackageId,
	AncestorKeys extends RecursiveCollectionKeys = RecursiveCollectionKeys,
	Key extends DictKey = DictKey
> = Join<[RulesPackage, Type, ...AncestorKeys, Key], IdElements.CONST.Sep>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${RecursiveCollectionKeys}${IdElements.CONST.Sep}${Key}`

export type NonRecursiveCollectableId<
	Type extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive,
	RulesPackage extends RulesPackageId = RulesPackageId,
	ParentKey extends DictKey = DictKey,
	Key extends DictKey = DictKey
> = Join<[RulesPackage, Type, ParentKey, Key], IdElements.CONST.Sep>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${Key}`

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${Key}`
export type RecursiveCollectionId<
	Subtype extends
		IdElements.TypeElements.Collectable.Recursive = IdElements.TypeElements.Collectable.Recursive,
	RulesPackage extends RulesPackageId = RulesPackageId,
	AncestorKeys extends CollectionAncestors = CollectionAncestors,
	Key extends DictKey = DictKey
> = Join<
	[
		RulesPackage,
		IdElements.TypeElements.Collection,
		Subtype,
		...AncestorKeys,
		Key
	],
	IdElements.CONST.Sep
>

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${RecursiveCollectionKeysString}`
export type NonRecursiveCollectionId<
	Subtype extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive,
	RulesPackage extends RulesPackageId = RulesPackageId,
	Key extends DictKey = DictKey
> = Join<
	[RulesPackage, IdElements.TypeElements.Collection, Subtype, Key],
	IdElements.CONST.Sep
>

// `${RulesPackage}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${Key}`

export type NonCollectableId<
	Type extends
		IdElements.TypeElements.NonCollectable = IdElements.TypeElements.NonCollectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	Key extends DictKey = DictKey
> = Join<[RulesPackage, Type, Key], IdElements.CONST.Sep>

// `${RulesPackage}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${Key}`

export type AnyCollectableId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId

export type AnyCollectionId = RecursiveCollectionId | NonRecursiveCollectionId

export type AnyId = AnyCollectableId | AnyCollectionId | NonCollectableId

