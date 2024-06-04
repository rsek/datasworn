import type * as IdElements from '../IdElements/index.js'
import {
	type CollectionAncestorKeys,
	type CollectionPathKeys,
	type AnyId,
	type RulesPackageId,
	type NonCollectableId,
	type RecursiveCollectableId,
	type NonRecursiveCollectableId,
	type RecursiveCollectionId,
	type NonRecursiveCollectionId,
	type CollectableAncestorKeys
} from './StringId'
import { type Split } from './StringUtils.js'

export type AnyCollectionKeys = CollectionAncestorKeys | CollectionPathKeys

export type ExtractRulesPackage<T extends AnyId> =
	Split<T> extends [
		infer RulesPackage extends RulesPackageId,
		IdElements.TypeId.Any,
		...string[]
	]
		? RulesPackage
		: never

export type ExtractTypeId<T extends AnyId> = T extends NonCollectableId
	? ExtractNonCollectableTypeId<T>
	: T extends RecursiveCollectableId
		? ExtractRecursiveCollectableTypeId<T>
		: T extends NonRecursiveCollectableId
			? ExtractNonRecursiveCollectableTypeId<T>
			: T extends RecursiveCollectionId
				? ExtractRecursiveCollectionTypeId<T>
				: T extends NonRecursiveCollectionId
					? ExtractNonRecursiveCollectionTypeId<T>
					: never

type ExtractNonCollectableTypeId<T extends NonCollectableId> =
	Split<T> extends [
		RulesPackageId,
		infer TypeId extends IdElements.TypeId.NonCollectable,
		...string[]
	]
		? TypeId
		: never
type ExtractRecursiveCollectableTypeId<T extends RecursiveCollectableId> =
	Split<T> extends [
		RulesPackageId,
		infer TypeId extends IdElements.TypeId.Collectable.Recursive,
		...string[]
	]
		? TypeId
		: never
type ExtractNonRecursiveCollectableTypeId<T extends NonRecursiveCollectableId> =
	Split<T> extends [
		RulesPackageId,
		infer TypeId extends IdElements.TypeId.Collectable.NonRecursive,
		...string[]
	]
		? TypeId
		: never
type ExtractRecursiveCollectionTypeId<T extends RecursiveCollectionId> =
	Split<T> extends [
		RulesPackageId,
		infer TypeId extends IdElements.TypeId.Collection.Recursive,
		...string[]
	]
		? TypeId
		: never
type ExtractNonRecursiveCollectionTypeId<T extends NonRecursiveCollectionId> =
	Split<T> extends [
		RulesPackageId,
		infer TypeId extends IdElements.TypeId.Collection.NonRecursive,
		...string[]
	]
		? TypeId
		: never
export type ExtractPathKeys<T extends AnyId> =
	Split<T> extends [RulesPackageId, IdElements.TypeId.Any, ...infer U]
		? U
		: never
export type ExtractKey<T extends AnyId> =
	Split<T> extends [
		RulesPackageId,
		IdElements.TypeId.Any,
		...string[],
		infer Key extends string
	]
		? Key
		: Split<T> extends [
					RulesPackageId,
					IdElements.TypeId.Any,
					infer Key extends string
			  ]
			? Key
			: never
export type ExtractAncestorKeys<T extends AnyId> =
	T extends RecursiveCollectionId
		? ExtractRecursiveCollectionAncestorKeys<T>
		: T extends RecursiveCollectableId
			? ExtractRecursiveCollectableAncestorKeys<T>
			: Split<T> extends [
						RulesPackageId,
						IdElements.TypeId.Any,
						...infer AncestorKeys extends string[],
						string
				  ]
				? AncestorKeys
				: Split<T> extends [RulesPackageId, IdElements.TypeId.Any, string]
					? []
					: never
export type ExtractParentCollectionKey<T extends NonRecursiveCollectableId> =
	Split<T> extends [
		RulesPackageId,
		IdElements.TypeId.Collectable.NonRecursive,
		infer ParentCollectionKey extends string,
		string
	]
		? ParentCollectionKey
		: never
type ExtractRecursiveCollectionAncestorKeys<T extends RecursiveCollectionId> =
	Split<T> extends [
		RulesPackageId,
		IdElements.TypeId.Collection.Recursive,
		...infer AncestorKeys extends CollectionAncestorKeys,
		string
	]
		? AncestorKeys
		: never
type ExtractRecursiveCollectableAncestorKeys<T extends RecursiveCollectableId> =
	Split<T> extends [
		RulesPackageId,
		IdElements.TypeId.Collectable.Recursive,
		...infer AncestorKeys extends CollectableAncestorKeys,
		string
	]
		? AncestorKeys
		: never
