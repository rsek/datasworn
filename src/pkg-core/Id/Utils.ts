import type * as Datasworn from '../Datasworn.js'
import type * as IdElements from '../IdElements/index.js'
import type * as Strings from './Strings.js'

import {
	type NonCollectableId,
	type NonRecursiveCollectableId
} from './IdParser/Id.js'
import {
	type IdsByTypeName,
	type NamesByTypeComposite,
	type TypesByName
} from './TypeMaps.js'

export type ExtractCollectableTypeElement<T extends Strings.AnyCollectableId> =
	T extends Strings.NonRecursiveCollectableId<
		string,
		infer Type extends IdElements.TypeElements.Collectable.NonRecursive
	>
		? Type
		: T extends Strings.RecursiveCollectableId<
					string,
					infer Type extends IdElements.TypeElements.Collectable.Recursive
		    >
		  ? Type
		  : never

export type ExtractCollectionSubtype<T extends Strings.AnyCollectionId> =
	T extends Strings.RecursiveCollectionId<
		string,
		infer Subtype extends IdElements.TypeElements.Collectable.Recursive
	>
		? Subtype
		: T extends Strings.NonRecursiveCollectionId<
					string,
					infer Subtype extends IdElements.TypeElements.Collectable.NonRecursive
		    >
		  ? Subtype
		  : never

type ExtractNonCollectableTypeElement<T extends Strings.NonCollectableId> =
	T extends Strings.NonCollectableId<
		string,
		infer U extends IdElements.TypeElements.NonCollectable
	>
		? U
		: never

export type ExtractCollectedTypeElement<T extends Strings.AnyCollectionId> =
	T extends Strings.NonRecursiveCollectionId<
		string,
		infer Subtype extends IdElements.TypeElements.Collectable.NonRecursive
	>
		? Subtype
		: T extends Strings.RecursiveCollectionId<
					string,
					infer Subtype extends IdElements.TypeElements.Collectable.Recursive
		    >
		  ? Subtype
		  : never

type ExtractCollectionTypeElements<T extends Strings.AnyCollectionId> = [
	IdElements.TypeElements.Collection,
	ExtractCollectedTypeElement<T>
]

export type ExtractTypeElements<T extends Strings.AnyId> =
	T extends Strings.NonCollectableId
		? [ExtractNonCollectableTypeElement<T>]
		: T extends Strings.AnyCollectionId
		  ? ExtractCollectionTypeElements<T>
		  : T extends Strings.AnyCollectableId
		    ? [ExtractCollectableTypeElement<T>]
		    : never

export type ExtractTypeElement<T extends Strings.AnyId> =
	T extends Strings.AnyCollectionId
		? IdElements.TypeElements.Collection
		: T extends `${Strings.RulesPackageId}${IdElements.CONST.Sep}${infer U extends
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

export type ExtractRulesPackage<T extends Strings.AnyId> = Split<
	T,
	IdElements.CONST.Sep
>[0]

export type ExtractRecursiveCollectionKeys<
	T extends Strings.RecursiveCollectionId | Strings.RecursiveCollectableId
> = T extends Strings.RecursiveCollectionId<
	any,
	any,
	infer U extends Strings.CollectionAncestorKeys,
	any
>
	? U
	: T extends Strings.RecursiveCollectableId<
				any,
				any,
				infer U extends Strings.CollectionPathKeys,
				any
	    >
	  ? U
	  : never

export type ExtractCollectionAncestorKeys<
	T extends Strings.RecursiveCollectionId
> = T extends Strings.RecursiveCollectionId<
	string,
	IdElements.TypeElements.Collectable.Recursive,
	infer U extends Strings.CollectionAncestorKeys,
	string
>
	? U
	: never

export type ExtractRecursiveCollectableAncestorKeys<
	T extends Strings.RecursiveCollectableId
> = T extends Strings.RecursiveCollectableId<
	any,
	any,
	infer U extends Strings.CollectionPathKeys
>
	? U
	: never

export type ExtractCollectionKeys<T extends Strings.AnyId> = T extends
	| Strings.NonRecursiveCollectionId
	| Strings.NonCollectableId
	? []
	: T extends Strings.RecursiveCollectionId<
				any,
				IdElements.TypeElements.Collectable.Recursive,
				infer U extends Strings.CollectionAncestorKeys,
				any
	    >
	  ? U
	  : T extends Strings.NonRecursiveCollectableId<
					any,
					IdElements.TypeElements.Collectable.NonRecursive,
					[infer U extends string],
					any
	      >
	    ? [U]
	    : T extends Strings.RecursiveCollectableId<
						any,
						IdElements.TypeElements.Collectable.Recursive,
						infer U extends Strings.CollectionPathKeys,
						any
	        >
	      ? U
	      : never

// T extends Id.NonRecursiveCollectionId
// 	? []
// 	: T extends Id.RecursiveCollectionId<any, any, infer U>
// 	  ? U
//     : T extends Id.NonRecursiveCollectableId<any,any>
// 	  : T extends `${string}${IdElements.CONST.Sep}${IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer U}${IdElements.CONST.Sep}${string}`
// 	    ? Split<U, IdElements.CONST.Sep>
// 	    : []

export type ExtractKey<T extends Strings.AnyId> = Split<
	T,
	IdElements.CONST.Sep
> extends [...string[], infer U extends string]
	? U
	: never

export type AnyPathKeys =
	| Strings.CollectionPathKeys
	| Strings.CollectablePathKeys
	| Strings.NonCollectablePathKeys

export type ExtractTypeKeys<T extends Strings.AnyId> =
	T extends Strings.AnyCollectionId
		? ExtractCollectionTypeKeys<T>
		: Split<T, IdElements.CONST.Sep> extends [string, infer U, ...string[]]
		  ? [U]
		  : AnyTypeKeys

export type AnyTypeKeys =
	| [
			IdElements.TypeElements.Collection,
			IdElements.TypeElements.Collectable.Any
	  ]
	| [IdElements.TypeElements.Collectable.Any]
	| [IdElements.TypeElements.NonCollectable]

type ExtractCollectionTypeKeys<T extends Strings.AnyCollectionId> = Split<
	T,
	IdElements.CONST.Sep
> extends [
	string,
	infer A extends IdElements.TypeElements.Collection,
	infer B extends IdElements.TypeElements.Collectable.Any,
	...string[]
]
	? [A, B]
	: never

export type ExtractPathKeys<T extends Strings.AnyId> =
	T extends Strings.NonRecursiveCollectionId<any, any, infer U extends string>
		? [U]
		: T extends Strings.RecursiveCollectionId<
					any,
					any,
					infer U extends Strings.CollectionPathKeys
		    >
		  ? U
		  : T extends Strings.NonRecursiveCollectionId<
						any,
						any,
						infer U extends string
		      >
		    ? [U]
		    : T extends NonRecursiveCollectableId<
							any,
							any,
							infer U0 extends string,
							infer U1 extends string
		        >
		      ? [U0, U1]
		      : T extends Strings.RecursiveCollectableId<any, any, infer U>
		        ? U
		        : T extends NonCollectableId<any, any, infer U extends string>
		          ? [U]
		          : never
// T extends Strings.Id<
// 	any,
// 	any,
// 	infer U extends string[]
// >
// 	? U
// 	: never

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

type TypeNameForId<T extends Strings.AnyId> = TypeNameById[T]

export type RootKeyForId<T extends Strings.AnyId> =
	T extends Strings.AnyCollectionId
		? ExtractCollectedTypeElement<T>
		: T extends Strings.NonRecursiveCollectableId
		  ? ExtractCollectableTypeElement<T>
		  : T extends Strings.NonCollectableId
		    ? ExtractNonCollectableTypeElement<T>
		    : never

export type RootKeyForType<T extends AnyIdentified> = RootKeyForId<IdForType<T>>

type TypeForTypeName<T extends keyof TypesByName> = TypesByName[T]

export type TypeForId<T extends Strings.AnyId> = TypeForTypeName<
	TypeNameForId<T>
>

export type TypeForTypeElements<
	Type extends IdElements.TypeElements.AnyPrimary,
	Subtype extends Strings.SubtypeOf<Type>
> = Type extends IdElements.TypeElements.Collection
	? NamesByTypeComposite[`${Type}/${Subtype}`]
	: Type extends
				| IdElements.TypeElements.Collectable.Any
				| IdElements.TypeElements.NonCollectable
	  ? NamesByTypeComposite[Type]
	  : never

export type TypeForTypeKeys<T extends AnyTypeKeys> =
	TypesByName[NameFromTypeKeys<T>]

type NameFromCollectionSubtype<
	T extends IdElements.TypeElements.Collectable.Any
> = NamesByTypeComposite[`${IdElements.TypeElements.Collection}/${T}`]

type CollectionTypeFromSubtype<
	T extends IdElements.TypeElements.Collectable.Any
> = TypesByName[NameFromCollectionSubtype<T>]

type NameFromTypeKeys<T extends AnyTypeKeys> = T extends [
	infer Type extends IdElements.TypeElements.Collection,
	infer Subtype extends IdElements.TypeElements.Collectable.Any
]
	? NameFromCollectionSubtype<Subtype>
	: T extends [
				infer U extends
					| IdElements.TypeElements.Collectable.Any
					| IdElements.TypeElements.NonCollectable
	    ]
	  ? NamesByTypeComposite[U]
	  : never

type f = NameFromTypeKeys<['site']>

export type ExtractParentCollectionKey<
	T extends Strings.NonRecursiveCollectableId
> = T extends Strings.NonRecursiveCollectableId<
	any,
	any,
	[infer U extends string],
	any
>
	? U
	: never

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
export type DataswornTree = Record<
	Strings.RulesPackageId,
	Datasworn.RulesPackage
>

// export type CollectionParent<T extends Id.RecursiveCollectionId | Id.AnyCollectableId> = T extends Join<[
//   infer RulesPackage extends string,
//   infer Type extends IdElements.CONST.CollectionsKey,
//   infer Subtype extends IdElements.TypeElements.Collectable.Any,
// ...infer AncestorKeys extends string[],
// infer Key extends string,
// string
// ], IdElements.CONST.Sep> ? Join<[RulesPackage,Type,Subtype, ...AncestorKeys, Key], IdElements.CONST.Sep> : never

export type CollectableChildOf<
	T extends Strings.AnyCollectionId,
	Key extends Strings.DictKey = Strings.DictKey
> = T extends `${infer RulesPackage extends
	string}${IdElements.CONST.Sep}${IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${infer Type extends
	IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer Tail}`
	? Join<[RulesPackage, Type, Tail, Key], IdElements.CONST.Sep>
	: never

export type CollectionChildOf<
	T extends Strings.RecursiveCollectionId,
	Key extends Strings.DictKey = Strings.DictKey
> = T extends `${infer RulesPackage extends
	string}${IdElements.CONST.Sep}${infer Type extends
	IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${infer Subtype extends
	IdElements.TypeElements.Collectable.Recursive}${IdElements.CONST.Sep}${infer Tail}`
	? Join<[RulesPackage, Type, Subtype, Tail, Key], IdElements.CONST.Sep>
	: never

export type ParentOf<
	T extends Strings.RecursiveCollectionId | Strings.AnyCollectableId
> = T extends Strings.RecursiveCollectionId
	? RecursiveCollectionParent<T>
	: T extends Strings.AnyCollectableId
	  ? CollectableParent<T>
	  : never

export type RecursiveCollectionParent<T extends Strings.RecursiveCollectionId> =
	T extends `${infer RulesPackage}${IdElements.CONST.Sep}${infer Type extends
		IdElements.TypeElements.Collection}${IdElements.CONST.Sep}${infer Subtype extends
		IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer Ancestors}${IdElements.CONST.Sep}${infer _Key}`
		? Join<[RulesPackage, Type, Subtype, Ancestors], IdElements.CONST.Sep>
		: never

export type CollectableParent<T extends Strings.AnyCollectableId> =
	T extends `${infer RulesPackage}${IdElements.CONST.Sep}${infer Subtype extends
		IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer Ancestors}${IdElements.CONST.Sep}${infer _Key}`
		? Join<
				[RulesPackage, IdElements.CONST.CollectionsKey, Subtype, Ancestors],
				IdElements.CONST.Sep
		  >
		: never

// T extends `${string}${IdElements.CONST.Sep}${infer Subtype extends IdElements.TypeElements.Collectable.Any}${IdElements.CONST.Sep}${infer CollectionKeyHead}${IdElements.CONST.Sep}${string}`