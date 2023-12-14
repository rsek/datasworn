import type * as Datasworn from '../types/Datasworn.js'
import {
	type ContentsKey,
	type CollectableTypeElement,
	type CollectionSubtypeElement,
	type CollectionTypeElement,
	type CollectionsKey,
	type NamesByTypeComposite,
	type NonCollectableTypeElement,
	type NonRecursiveCollectableTypeElement,
	type RecursiveCollectableTypeElement,
	type Sep
} from './const.js'
import type * as Symbols from './symbol.js'

type ExtractCollectableTypeElement<T extends CollectableId> =
	T extends CollectableId<infer U> ? U : never

type ExtractNonCollectableTypeElement<T extends NonCollectableId> =
	T extends NonCollectableId<infer U> ? U : never

export type ExtractCollectedTypeElement<T extends CollectionId> =
	T extends CollectionId<infer U> ? U : never

export type ExtractTypeElements<T extends AnyId> = T extends NonCollectableId
	? [ExtractNonCollectableTypeElement<T>]
	: T extends CollectionId
	  ? [CollectionTypeElement, ExtractCollectedTypeElement<T>]
	  : T extends CollectableId
	    ? [ExtractCollectableTypeElement<T>]
	    : never

/** Any Collection type capable of containing Collectable objects. */
export type AnyCollection = NamesByTypeComposite[CollectionSubtypeElement]
export type CollectionOf<T extends AnyCollectable> = Extract<
	AnyCollection,
	{ contents?: Record<string, T> }
>

/** Any Collection type that can contain Collectable objects, but never contains further collections. */
export type AnyNonRecursiveCollection = CollectionOf<
	NamesByTypeComposite[NonRecursiveCollectableTypeElement]
>
export type AnyNonRecursiveCollectable =
	NamesByTypeComposite[NonRecursiveCollectableTypeElement]

/** Any Collection type that may contain both Collectable objects and further collections. */
export type AnyRecursiveCollection =
	NamesByTypeComposite[RecursiveCollectableTypeElement] & {
		[CollectionsKey]?: Record<
			string,
			NamesByTypeComposite[RecursiveCollectableTypeElement]
		>
	}
/** Any object type eligible to be organized in a Collection */
export type AnyCollectable = NamesByTypeComposite[CollectableTypeElement]
/** Any object type which is never organized in a Collection */
export type AnyNonCollectable = NamesByTypeComposite[NonCollectableTypeElement]

export interface TypesByName {
	AssetCollection: Datasworn.AssetCollection
	Atlas: Datasworn.Atlas
	MoveCategory: Datasworn.MoveCategory
	NpcCollection: Datasworn.NpcCollection
	OracleCollection: Datasworn.OracleCollection
	Asset: Datasworn.Asset
	AtlasEntry: Datasworn.AtlasEntry
	DelveSite: Datasworn.DelveSite
	Move: Datasworn.Move
	Npc: Datasworn.Npc
	OracleRollable: Datasworn.OracleRollable
	Rarity: Datasworn.Rarity
	DelveSiteDomain: Datasworn.DelveSiteDomain
	DelveSiteTheme: Datasworn.DelveSiteTheme
	Truth: Datasworn.Truth
}
interface IdsByTypeName extends Record<AnyTypeName, AnyId> {
	AssetCollection: CollectionId<'assets'>
	Atlas: CollectionId<'atlas'>
	MoveCategory: CollectionId<'moves'>
	NpcCollection: CollectionId<'npcs'>
	OracleCollection: CollectionId<'oracles'>
	Asset: CollectableId<'assets'>
	AtlasEntry: CollectableId<'atlas'>
	Move: CollectableId<'moves'>
	Npc: CollectableId<'npcs'>
	OracleRollable: CollectableId<'oracles'>
	DelveSite: NonCollectableId<'delve_sites'>
	Rarity: NonCollectableId<'rarities'>
	DelveSiteDomain: NonCollectableId<'site_domains'>
	DelveSiteTheme: NonCollectableId<'site_themes'>
	Truth: NonCollectableId<'truths'>
}

type TypeNameById = { [P in keyof IdsByTypeName as IdsByTypeName[P]]: P }

type TypeNameForId<T extends AnyId> = TypeNameById[T]

export type RootKeyForId<T extends AnyId> = T extends CollectionId
	? ExtractCollectedTypeElement<T>
	: T extends CollectableId
	  ? ExtractCollectableTypeElement<T>
	  : T extends NonCollectableId
	    ? ExtractNonCollectableTypeElement<T>
	    : never

export type RootKeyForType<T extends AnyIdentified> = RootKeyForId<IdForType<T>>

type TypeForTypeName<T extends keyof TypesByName> = TypesByName[T]

export type TypeForId<T extends AnyId> = TypeForTypeName<TypeNameForId<T>>

type AnyTypeName = keyof TypesByName
type TypeToTypeName<T extends AnyTypeName> = TypesByName[T]
type TypeNameToType<T extends AnyIdentified> = T extends TypeToTypeName<infer U>
	? U
	: never

export type IdForType<T extends AnyIdentified> =
	IdsByTypeName[TypeNameToType<T>]

/** A major Datasworn type with an ID. */
export type AnyIdentified = TypeForTypeName<AnyTypeName>

type RecursiveDictKeys =
	| `${DictKey}`
	| `${DictKey}${Sep}${DictKey}`
	| `${DictKey}${Sep}${DictKey}${Sep}${DictKey}`

// ID TYPES

/** The ID type for the type of object collected by a given collection ID.  */
export type CollectedId<T extends CollectionId> =
	ExtractCollectedTypeElement<T> extends RecursiveCollectableTypeElement
		? RecursiveCollectableId<ExtractCollectedTypeElement<T>>
		: CollectableId<ExtractCollectedTypeElement<T>>

/** ID for a valid collectable object for a specific collection ID. */
export type ChildOfId<T extends CollectionId> =
	T extends `${infer A}${Sep}${CollectionsKey}${Sep}${infer B}`
		? `${A}${Sep}${B}${Sep}${string}`
		: never

export type RulesPackageId = string
export type DictKey = string
export type CollectableId<
	Type extends CollectableTypeElement = CollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${Sep}${DictKey}${Sep}${DictKey}`
export type RecursiveCollectableId<
	Type extends RecursiveCollectableTypeElement = RecursiveCollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${Sep}${RecursiveDictKeys}${Sep}${DictKey}`

export type NonRecursiveCollectableId<
	Type extends
		NonRecursiveCollectableTypeElement = NonRecursiveCollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${Sep}${DictKey}${Sep}${DictKey}`

export type CollectionId<
	Subtype extends CollectableTypeElement = CollectableTypeElement
> =
	`${RulesPackageId}${Sep}${CollectionTypeElement}${Sep}${Subtype}${Sep}${DictKey}`
export type RecursiveCollectionId<
	Subtype extends
		RecursiveCollectableTypeElement = RecursiveCollectableTypeElement
> =
	`${RulesPackageId}${Sep}${CollectionTypeElement}${Sep}${Subtype}${Sep}${RecursiveDictKeys}`
export type NonRecursiveCollectionId<
	Subtype extends
		NonRecursiveCollectableTypeElement = NonRecursiveCollectableTypeElement
> =
	`${RulesPackageId}${Sep}${CollectionTypeElement}${Sep}${Subtype}${Sep}${DictKey}`

export type NonCollectableId<
	Type extends NonCollectableTypeElement = NonCollectableTypeElement
> = `${RulesPackageId}${Sep}${Type}${Sep}${DictKey}`
export type AnyId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId
	| RecursiveCollectionId
	| NonRecursiveCollectionId
	| NonCollectableId

// real paths

type RulesPackageIdWildcard = RulesPackageId | typeof Symbols.Wildcard
type DictKeyWildcard = DictKey | typeof Symbols.Wildcard
type DictKeyGlobstar = DictKey | typeof Symbols.Globstar

type NonCollectablePath<T extends NonCollectableId = NonCollectableId> = [
	RulesPackageIdWildcard, // pkg key
	ExtractTypeElements<T>,
	DictKeyWildcard
]

type NonRecursiveCollectionPath<
	T extends NonRecursiveCollectionId = NonRecursiveCollectionId
> = [
	RulesPackageIdWildcard, // pkg key
	ExtractCollectedTypeElement<T>,
	DictKeyWildcard // collection key
]

type NonRecursiveCollectablePath<
	T extends NonRecursiveCollectableId = NonRecursiveCollectableId
> = [
	RulesPackageIdWildcard, // pkg key
	ExtractCollectableTypeElement<T>,
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

type RecursiveCollectionPath<
	T extends RecursiveCollectionId = RecursiveCollectionId
> = [
	RulesPackageIdWildcard, // pkg key
	ExtractCollectedTypeElement<T>,
	...RecursiveCollectionKeys
]

type RecursiveCollectablePath<
	T extends RecursiveCollectableId = RecursiveCollectableId
> = [
	RulesPackageIdWildcard, // pkg key
	ExtractCollectableTypeElement<T>,
	...RecursiveCollectionKeys, // ancestor collections
	ContentsKey,
	DictKeyWildcard // collectable's key
]

export type PathForId<T extends AnyId> = (T extends RecursiveCollectionId
	? RecursiveCollectionPath<T>
	: T extends RecursiveCollectableId
	  ? RecursiveCollectablePath<T>
	  : T extends NonRecursiveCollectionId
	    ? NonRecursiveCollectionPath<T>
	    : T extends NonRecursiveCollectableId
	      ? NonRecursiveCollectablePath<T>
	      : T extends NonCollectableId
	        ? NonCollectablePath<T>
	        : never) &
	PropertyKey[]

export type PathForType<T extends AnyIdentified> = PathForId<IdForType<T>>

// datasworn objects
export type DataswornTree = Record<RulesPackageId, Datasworn.RulesPackage>

export * from './const.js'
