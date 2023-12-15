import type * as Datasworn from '../../types/Datasworn.js'
import type * as Id from './StringTemplateLiterals.js'
import type * as IdElements from './IdElements/index.js'

import {
	type NamesByTypeComposite,
	type IdsByTypeName,
	type TypesByName
} from './TypeMaps.js'

export type ExtractCollectableTypeElement<T extends Id.CollectableId> =
	T extends Id.CollectableId<infer U> ? U : never

type ExtractNonCollectableTypeElement<T extends Id.NonCollectableId> =
	T extends Id.NonCollectableId<infer U> ? U : never

export type ExtractCollectedTypeElement<T extends Id.CollectionId> =
	T extends Id.CollectionId<infer U> ? U : never

export type ExtractTypeElements<T extends Id.AnyId> =
	T extends Id.NonCollectableId
		? [ExtractNonCollectableTypeElement<T>]
		: T extends Id.CollectionId
		  ? [IdElements.TypeElements.Collection, ExtractCollectedTypeElement<T>]
		  : T extends Id.CollectableId
		    ? [ExtractCollectableTypeElement<T>]
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

export type ExtractRulesPackageId<T extends Id.AnyId> = Split<
	T,
	IdElements.Sep
>[0]

export type ExtractIdAncestorKeys<T extends Id.AnyId> = T extends
	| Id.CollectableId
	| Id.CollectionId
	? Split<T, IdElements.Sep> extends [...infer U extends string[], string]
		? U
		: []
	: string[]

export type ExtractIdSelfKey<T extends Id.AnyId> = Split<
	T,
	IdElements.Sep
> extends [...string[], infer U extends string]
	? U
	: string

/** Any Collection type capable of containing Collectable objects. */
export type AnyCollection = NamesByTypeComposite[Extract<
	keyof NamesByTypeComposite,
	`${IdElements.TypeElements.Collection}/${string}`
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
		[IdElements.CollectionsKey]?: Record<
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

export type RootKeyForId<T extends Id.AnyId> = T extends Id.CollectionId
	? ExtractCollectedTypeElement<T>
	: T extends Id.CollectableId
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
