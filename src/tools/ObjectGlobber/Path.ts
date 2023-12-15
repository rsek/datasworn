import { type CollectionsKey, type ContentsKey } from '../Id/IdElement/const.js'
import type ObjectGlobber from '../ObjectGlobber/ObjectGlobber.js'
import type * as Id from '../Id/index.js'

export type PathForId<T extends Id.AnyId> = (T extends Id.RecursiveCollectionId
	? RecursiveCollectionPath<T>
	: T extends Id.RecursiveCollectableId
	  ? RecursiveCollectablePath<T>
	  : T extends Id.NonRecursiveCollectionId
	    ? NonRecursiveCollectionPath<T>
	    : T extends Id.NonRecursiveCollectableId
	      ? NonRecursiveCollectablePath<T>
	      : T extends Id.NonCollectableId
	        ? NonCollectablePath<T>
	        : never) &
	PropertyKey[]

export type PathForType<T extends Id.Utils.AnyIdentified> = PathForId<
	Id.Utils.IdForType<T>
> // real paths
type RulesPackageIdWildcard = Id.RulesPackageId | typeof ObjectGlobber.WILDCARD
type DictKeyWildcard = Id.DictKey | typeof ObjectGlobber.WILDCARD
type DictKeyGlobstar = Id.DictKey | typeof ObjectGlobber.GLOBSTAR

export type NonCollectablePath<
	T extends Id.NonCollectableId = Id.NonCollectableId
> = [
	RulesPackageIdWildcard, // pkg key
	Id.Utils.ExtractTypeElements<T>,
	DictKeyWildcard
]

export type NonRecursiveCollectionPath<
	T extends Id.NonRecursiveCollectionId = Id.NonRecursiveCollectionId
> = [
	RulesPackageIdWildcard, // pkg key
	Id.Utils.ExtractCollectedTypeElement<T>,
	DictKeyWildcard // collection key
]

export type NonRecursiveCollectablePath<
	T extends Id.NonRecursiveCollectableId = Id.NonRecursiveCollectableId
> = [
	RulesPackageIdWildcard, // pkg key
	Id.Utils.ExtractCollectableTypeElement<T>,
	DictKeyWildcard, // parent collection key
	ContentsKey,
	DictKeyWildcard // collectable's key
]
type RecursiveCollectionKeys =
	| [DictKeyGlobstar]
	| [DictKeyWildcard, CollectionsKey, DictKeyGlobstar]
	| [DictKeyGlobstar, CollectionsKey, DictKeyWildcard]
	| [DictKeyWildcard]
	| [DictKeyWildcard, CollectionsKey, DictKeyWildcard]
	| [
			DictKeyWildcard,
			CollectionsKey,
			DictKeyWildcard,
			CollectionsKey,
			DictKeyWildcard
	  ]

export type RecursiveCollectionPath<
	T extends Id.RecursiveCollectionId = Id.RecursiveCollectionId
> = [
	RulesPackageIdWildcard, // pkg key
	Id.Utils.ExtractCollectedTypeElement<T>,
	...RecursiveCollectionKeys
]

export type RecursiveCollectablePath<
	T extends Id.RecursiveCollectableId = Id.RecursiveCollectableId
> = [
	RulesPackageIdWildcard, // pkg key
	Id.Utils.ExtractCollectableTypeElement<T>,
	...RecursiveCollectionKeys, // ancestor collections
	ContentsKey,
	DictKeyWildcard // collectable's key
]
