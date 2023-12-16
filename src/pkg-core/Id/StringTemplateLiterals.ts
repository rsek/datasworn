import type * as IdElements from './IdElements/index.js'
import { type ExtractCollectedTypeElement } from './Utils.js'

export type RulesPackageId = string
export type DictKey = string

type RecursiveDictKeys =
	| `${DictKey}`
	| `${DictKey}${IdElements.CONST.Sep}${DictKey}`
	| `${DictKey}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${DictKey}`

/** The ID type for the type of object collected by a given collection ID.  */

export type CollectedId<T extends CollectionId> =
	ExtractCollectedTypeElement<T> extends IdElements.TypeElements.Collectable.Recursive
		? RecursiveCollectableId<ExtractCollectedTypeElement<T>>
		: CollectableId<ExtractCollectedTypeElement<T>>

/** ID for a valid collectable object for a specific collection ID. */
export type ChildOfId<T extends CollectionId> =
	T extends `${infer A}${IdElements.CONST.Sep}${IdElements.CONST.CollectionsKey}${IdElements.CONST.Sep}${infer B}`
		? `${A}${IdElements.CONST.Sep}${B}${IdElements.CONST.Sep}${string}`
		: never

export type CollectableId<
	Type extends
		IdElements.TypeElements.Collectable.Any = IdElements.TypeElements.Collectable.Any
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${DictKey}`
export type RecursiveCollectableId<
	Type extends
		IdElements.TypeElements.Collectable.Recursive = IdElements.TypeElements.Collectable.Recursive
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${RecursiveDictKeys}${IdElements.CONST.Sep}${DictKey}`

export type NonRecursiveCollectableId<
	Type extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}${IdElements.CONST.Sep}${DictKey}`

export type CollectionId<
	Subtype extends
		IdElements.TypeElements.Collectable.Any = IdElements.TypeElements.Collectable.Any
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${DictKey}`
export type RecursiveCollectionId<
	Subtype extends
		IdElements.TypeElements.Collectable.Recursive = IdElements.TypeElements.Collectable.Recursive
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${RecursiveDictKeys}`
export type NonRecursiveCollectionId<
	Subtype extends
		IdElements.TypeElements.Collectable.NonRecursive = IdElements.TypeElements.Collectable.NonRecursive
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${Subtype}${IdElements.CONST.Sep}${DictKey}`

export type NonCollectableId<
	Type extends
		IdElements.TypeElements.NonCollectable = IdElements.TypeElements.NonCollectable
> =
	`${RulesPackageId}${IdElements.CONST.Sep}${Type}${IdElements.CONST.Sep}${DictKey}`
export type AnyId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId
	| RecursiveCollectionId
	| NonRecursiveCollectionId
	| NonCollectableId
