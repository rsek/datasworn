import type TypeId from '../IdElements/TypeId.js'
import {
	type Primary,
	type RulesPackageId,
	type NonCollectable,
	type Collectable,
	type Collection
} from '../StringId.js'
import {
	type CollectionAncestorKeys,
	type CollectionPathKeys,
	type CollectableAncestorKeys
} from '../IdElements/PathKeys.js'
import { type Split } from './String.js'
import type CONST from '../IdElements/CONST.js'
import type { PathKeys } from '../IdElements/index.js'

export type AnyCollectionKeys = CollectionAncestorKeys | CollectionPathKeys

export type ExtractTypeId<T extends Primary> = T extends NonCollectable
	? ExtractNonCollectableTypeId<T>
	: T extends Collectable
		? ExtractCollectableTypeId<T>
		: T extends Collection
			? ExtractCollectionTypeId<T>
			: never

type ExtractNonCollectableTypeId<T extends NonCollectable> =
	Split<T, CONST.PrefixSep> extends [
		infer TypeId extends TypeId.NonCollectable,
		...string[]
	]
		? TypeId
		: never
type ExtractCollectableTypeId<T extends Collectable> =
	Split<T, CONST.PrefixSep> extends [
		infer TypeId extends TypeId.Collectable,
		...string[]
	]
		? TypeId
		: never
type ExtractCollectionTypeId<T extends Collection> =
	Split<T, CONST.PrefixSep> extends [
		infer TypeId extends TypeId.Collection,
		...string[]
	]
		? TypeId
		: never

type ExtractPath<T extends Primary> =
	Split<T, CONST.PrefixSep> extends [string, infer U extends string] ? U : never

type ExtractPrimaryPath<T extends Primary> =
	Split<ExtractPath<T>, CONST.TypeSep> extends [
		infer U extends string,
		...string[]
	]
		? U
		: Split<ExtractPath<T>, CONST.TypeSep> extends [infer U extends string]
			? U
			: never

export type ExtractRulesPackage<T extends Primary> =
	Split<ExtractPrimaryPath<T>> extends [
		infer RulesPackage extends RulesPackageId,
		TypeId.Primary,
		...string[]
	]
		? RulesPackage
		: never

export type ExtractPathKeys<T extends Primary> = Split<ExtractPath<T>>

export type ExtractPrimaryPathKeys<T extends Primary> = Split<
	ExtractPrimaryPath<T>
>

export type ExtractPrimaryKey<T extends Primary> =
	ExtractPrimaryPathKeys<T> extends [infer U extends string]
		? U
		: ExtractPrimaryPathKeys<T> extends [...string[], infer U extends string]
			? U
			: never

export type ExtractPrimaryAncestorKeys<T extends Primary> = T extends Collection
	? ExtractPrimaryPathKeys<T> extends [
			...infer U extends PathKeys.CollectionAncestorKeys,
			string
		]
		? U
		: T extends Collectable
			? ExtractPrimaryPathKeys<T> extends [
					...infer U extends PathKeys.CollectableAncestorKeys,
					string
				]
				? U
				: never
			: T extends NonCollectable
				? []
				: never
	: never

export type ExtractKey<T extends Primary> =
	Split<T> extends [
		TypeId.Primary,
		RulesPackageId,
		...string[],
		infer Key extends string
	]
		? Key
		: Split<T> extends [
					TypeId.Primary,
					RulesPackageId,
					infer Key extends string
			  ]
			? Key
			: never
export type ExtractAncestorKeys<T extends Primary> = T extends Collectable
	? ExtractCollectionAncestorKeys<T>
	: T extends Collectable
		? ExtractCollectableAncestorKeys<T>
		: Split<T> extends [
					RulesPackageId,
					TypeId.Primary,
					...infer AncestorKeys extends string[],
					string
			  ]
			? AncestorKeys
			: Split<T> extends [RulesPackageId, TypeId.Primary, string]
				? []
				: never
export type ExtractParentCollectionKey<T extends Collectable> =
	Split<T> extends [
		RulesPackageId,
		TypeId.Collectable,
		infer ParentCollectionKey extends string,
		string
	]
		? ParentCollectionKey
		: never
type ExtractCollectionAncestorKeys<T extends Collectable> =
	Split<T> extends [
		RulesPackageId,
		TypeId.Collection,
		...infer AncestorKeys extends CollectionAncestorKeys,
		string
	]
		? AncestorKeys
		: never
type ExtractCollectableAncestorKeys<T extends Collectable> =
	Split<T> extends [
		RulesPackageId,
		TypeId.Collectable,
		...infer AncestorKeys extends CollectableAncestorKeys,
		string
	]
		? AncestorKeys
		: never
