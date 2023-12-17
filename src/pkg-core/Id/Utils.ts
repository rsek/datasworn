import type * as Datasworn from '../Datasworn.js'
import type * as Id from './StringTemplateLiterals.js'
import type * as IdElements from './IdElements/index.js'

import {
	type NamesByTypeComposite,
	type IdsByTypeName,
	type TypesByName
} from './TypeMaps.js'

export type ExtractCollectableTypeElement<T extends Id.AnyCollectableId> =
	T extends Id.NonRecursiveCollectableId<
		infer Type extends IdElements.TypeElements.Collectable.NonRecursive
	>
		? Type
		: T extends Id.RecursiveCollectableId<
					infer Type extends IdElements.TypeElements.Collectable.Recursive
		    >
		  ? Type
		  : never

type ExtractNonCollectableTypeElement<T extends Id.NonCollectableId> =
	T extends Id.NonCollectableId<
		infer U extends IdElements.TypeElements.NonCollectable
	>
		? U
		: never

export type ExtractCollectedTypeElement<T extends Id.AnyCollectionId> =
	T extends Id.NonRecursiveCollectionId<
		infer Subtype extends IdElements.TypeElements.Collectable.NonRecursive
	>
		? Subtype
		: T extends Id.RecursiveCollectionId<
					infer Subtype extends IdElements.TypeElements.Collectable.Recursive
		    >
		  ? Subtype
		  : never

type ExtractCollectionTypeElements<T extends Id.AnyCollectionId> = [
	IdElements.TypeElements.Collection,
	ExtractCollectedTypeElement<T>
]

export type ExtractTypeElements<T extends Id.AnyId> = T extends Id.NonCollectableId
	? [ExtractNonCollectableTypeElement<T>]
	: T extends Id.AnyCollectionId
	  ? ExtractCollectionTypeElements<T>
	  : T extends Id.AnyCollectableId
	    ? [ExtractCollectableTypeElement<T>]
	    : never

export type ExtractTypeElement<T extends Id.AnyId> =
	T extends Id.AnyCollectionId
		? IdElements.TypeElements.Collection
		: T extends `${Id.RulesPackageId}${IdElements.CONST.Sep}${infer U extends
					IdElements.TypeElements.AnyPrimary}${IdElements.CONST.Sep}${infer _Tail}`
		  ? U
		  : never

// cribbed from type-fest
export type Split<
	S extends string,
	Delimiter extends string
> = S extends `${infer Head}${Delimiter}${infer Tail}`
	? [Head, ...Split<Tail, Delimiter>]
	: S extends Delimiter
	  ? []
	  : [S]

export type Join<
	Strings extends string[],
	Delimiter extends string
> = Strings extends [infer U extends string]
	? U
	: Strings extends [infer Head extends string, ...infer Tail extends string[]]
	  ? `${Head}${Delimiter}${Join<Tail, Delimiter>}`
	  : never

export type ExtractRulesPackageId<T extends Id.AnyId> = Split<
	T,
	IdElements.CONST.Sep
>[0]

export type ExtractAncestorKeys<T extends Id.AnyId> =
	T extends `${string}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer U}${IdElements.CONST.Sep}${string}`
		? Split<U, IdElements.CONST.Sep>
		: []

export type ExtractIdSelfKey<T extends Id.AnyId> = Split<
	T,
	IdElements.CONST.Sep
> extends [...string[], infer U extends string]
	? U
	: never

/** Any Collection type capable of containing Collectable objects. */
export type AnyCollection = NamesByTypeComposite[Extract<
	keyof NamesByTypeComposite,
	`${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${string}`
>]
export type CollectionOf<T extends AnyCollectable> = Extract<
	AnyCollection,
	{ contents?: Record<string, T> }
>

/** Any Collection type that can contain Collectable objects, but never contains further collections. */
export type AnyNonRecursiveCollection = CollectionOf<
	NamesByTypeComposite[IdElements.TypeElements.Collectable.NonRecursive]
>
export type AnyNonRecursiveCollectable =
	NamesByTypeComposite[IdElements.TypeElements.Collectable.NonRecursive]

/** Any Collection type that may contain both Collectable objects and further collections. */
export type AnyRecursiveCollection =
	NamesByTypeComposite[IdElements.TypeElements.Collectable.Recursive] & {
		[IdElements.CONST.CollectionsKey]?: Record<
			string,
			NamesByTypeComposite[IdElements.TypeElements.Collectable.Recursive]
		>
	}
/** Any object type eligible to be organized in a Collection */
export type AnyCollectable =
	NamesByTypeComposite[IdElements.TypeElements.Collectable.Any]
/** Any object type which is never organized in a Collection */
export type AnyNonCollectable =
	NamesByTypeComposite[IdElements.TypeElements.NonCollectable]

type TypeNameById = { [P in keyof IdsByTypeName as IdsByTypeName[P]]: P }

type TypeNameForId<T extends Id.AnyId> = TypeNameById[T]

export type RootKeyForId<T extends Id.AnyId> = T extends Id.AnyCollectionId
	? ExtractCollectedTypeElement<T>
	: T extends Id.NonRecursiveCollectableId
	  ? ExtractCollectableTypeElement<T>
	  : T extends Id.NonCollectableId
	    ? ExtractNonCollectableTypeElement<T>
	    : never

export type RootKeyForType<T extends AnyIdentified> = RootKeyForId<IdForType<T>>

type TypeForTypeName<T extends keyof TypesByName> = TypesByName[T]

export type TypeForId<T extends Id.AnyId> = TypeForTypeName<TypeNameForId<T>>

export type AnyTypeName = keyof TypesByName
type TypeToTypeName<T extends AnyTypeName> = TypesByName[T]
type TypeNameToType<T extends AnyIdentified> = T extends TypeToTypeName<infer U>
	? U
	: never

export type IdForType<T extends AnyIdentified> =
	IdsByTypeName[TypeNameToType<T>]

/** A major Datasworn type with an ID. */
export type AnyIdentified = TypeForTypeName<AnyTypeName>

// datasworn objects
export type DataswornTree = Record<Id.RulesPackageId, Datasworn.RulesPackage>


// export type CollectionParent<T extends Id.RecursiveCollectionId | Id.AnyCollectableId> = T extends Join<[
//   infer RulesPackage extends string,
//   infer Type extends IdElements.CONST.CollectionsKey,
//   infer Subtype extends IdElements.TypeElements.Collectable.Any,
// ...infer AncestorKeys extends string[],
// infer Key extends string,
// string
// ], IdElements.CONST.Sep> ? Join<[RulesPackage,Type,Subtype, ...AncestorKeys, Key], IdElements.CONST.Sep> : never

export type CollectableChildOf<T extends Id.AnyCollectionId, Key extends Id.DictKey = Id.DictKey> = T extends `${infer RulesPackage extends string}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${infer Type extends IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer Tail}` ? Join<[RulesPackage,Type,Tail,Key], IdElements.CONST.Sep>: never

export type CollectionChildOf<T extends Id.RecursiveCollectionId, Key extends Id.DictKey = Id.DictKey> =  T extends `${infer RulesPackage extends string}${IdElements.CONST.Sep}${infer Type extends IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${infer Subtype extends IdElements.TypeElements.Collectable.Recursive}${IdElements.CONST.Sep}${infer Tail}` ? Join<[RulesPackage,Type,Subtype,Tail,Key], IdElements.CONST.Sep>: never


export type ParentOf<T extends  Id.RecursiveCollectionId | Id.AnyCollectableId> = T extends Id.RecursiveCollectionId ? RecursiveCollectionParent<T> : T extends Id.AnyCollectableId ? CollectableParent<T> : never



export type RecursiveCollectionParent<T extends Id.RecursiveCollectionId> = T extends
`${infer RulesPackage}${IdElements.CONST.Sep}${infer Type extends IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${infer Subtype extends IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer Ancestors}${IdElements.CONST.Sep}${infer _Key}`
? Join<[RulesPackage,Type,Subtype, Ancestors], IdElements.CONST.Sep> : never

export type CollectableParent<T extends Id.AnyCollectableId> = T extends
`${infer RulesPackage}${IdElements.CONST.Sep}${infer Subtype extends IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer Ancestors}${IdElements.CONST.Sep}${infer _Key}`
? Join<[RulesPackage,IdElements.CONST.CollectionsKey, Subtype, Ancestors], IdElements.CONST.Sep> : never

// T extends `${string}${IdElements.CONST.Sep}${infer Subtype extends IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer CollectionKeyHead}${IdElements.CONST.Sep}${string}`