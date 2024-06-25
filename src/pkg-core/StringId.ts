import type { DictKey, ExpansionId, RulesetId } from './Datasworn.js'
import { type CONST, type TypeId } from './IdElements/index.js'
import type * as PathKeys from './IdElements/PathKeys.js'
import type { TupleOfLength } from './Utils/Array.js'
import type { AnyCollectionKeys } from './Utils/Id.js'
import { type Join, type Split } from './Utils/String.js'

export type RulesPackageId = RulesetId | ExpansionId

export type TypeIdParts = string[]

export type IdSegments<T extends number> = TupleOfLength<T, string>

type IdBase<
	L extends number,
	TypeIds extends IdSegments<L>,
	PathSegments extends IdSegments<L>
> = `${Join<TypeIds, CONST.TypeSep>}${CONST.PrefixSep}${Join<PathSegments, CONST.TypeSep>}`

type f = IdBase<2, ['move', 'oracle_rollable'], ['foo', 'bar']>

export type Embedded<
	TPrimary extends TypeId.Primary & TypeId.Embedding,
	TPrimaryPath extends string,
	TEmbedded extends TypeId.EmbeddableIn<TPrimary>,
	TEmbeddedPath extends string
> = IdBase<2, [TPrimary, TEmbedded], [TPrimaryPath, TEmbeddedPath]>

export type EmbeddedInEmbedded<
	TPrimary extends TypeId.Primary & TypeId.Embedding,
	TPrimaryPath extends string,
	TEmbedded extends TypeId.EmbeddableIn<TPrimary> &
		TypeId.EmbeddingWhenEmbeddedType,
	TEmbeddedPath extends string,
	TEmbedded2 extends TypeId.EmbeddableInEmbeddedType<TEmbedded>,
	TEmbeddedPath2 extends string
> = IdBase<
	3,
	[TPrimary, TEmbedded, TEmbedded2],
	[TPrimaryPath, TEmbeddedPath, TEmbeddedPath2]
>

export type EmbedIn<
	TBase extends
		| Collectable
		| NonCollectable
		| EmbedIn<any, TypeId.Embeddable, any>,
	EmbedTypeId extends TypeId.Embeddable,
	Key extends string | number
> = IdBase<
	// @ts-expect-error
	[...ExtractTypeIdParts<TBase>, EmbedTypeId]['length'],
	[...ExtractTypeIdParts<TBase>, EmbedTypeId],
	[...ExtractPathSegments<TBase>, `${Key}`]
>

type ExtractTypeIdParts<T extends `${string}${CONST.PrefixSep}${string}`> =
	Split<Split<T, CONST.PrefixSep>[0], CONST.TypeSep>
type ExtractPathSegments<T extends `${string}${CONST.PrefixSep}${string}`> =
	Split<Split<T, CONST.PrefixSep>[1], CONST.TypeSep>

type PrimaryBase<
	TypeId extends TypeId.Primary,
	RulesPackage extends RulesPackageId,
	PathKeys extends DictKey[]
> = IdBase<1, [TypeId], [Join<[RulesPackage, ...PathKeys]>]>

export type Collection<
	TypeId extends TypeId.Collection = TypeId.Collection,
	RulesPackage extends RulesPackageId = RulesPackageId,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> = PrimaryBase<TypeId, RulesPackage, [...CollectionAncestorKeys, Key]>

export type ExtractCollectionType<T extends Collection> =
	T extends Collection<infer U extends TypeId.Collection> ? U : never
export type ExtractCollectableType<T extends Collectable> =
	T extends Collectable<infer U extends TypeId.Collectable> ? U : never
export type ExtractNonCollectableType<T extends NonCollectable> =
	T extends NonCollectable<infer U extends TypeId.NonCollectable> ? U : never

export type ExtractPrimaryRulesPackage<
	T extends `${string}:${string}${CONST.PathKeySep}${string}`
> = Split<Split<T, CONST.PrefixSep>[1], CONST.PathKeySep>[0]

export type ExtractNonCollectableKey<T extends NonCollectable> =
	T extends NonCollectable<
		TypeId.NonCollectable,
		string,
		infer U extends string
	>
		? U
		: never

export type ExtractCollectableKey<T extends Collectable> =
	T extends Collectable<
		TypeId.Collectable,
		string,
		PathKeys.CollectableAncestorKeys,
		infer U extends string
	>
		? U
		: never

export type ExtractCollectionKey<T extends Collection> =
	T extends Collection<
		TypeId.Collection,
		string,
		PathKeys.CollectionAncestorKeys,
		infer U extends string
	>
		? U
		: never

export type ExtractCollectionAncestorsKeys<T extends Collection> =
	T extends Collection<
		TypeId.Collection,
		string,
		infer U extends PathKeys.CollectionAncestorKeys,
		string
	>
		? U
		: never

export type ExtractCollectableAncestorsKeys<T extends Collectable> =
	T extends Collectable<
		TypeId.Collectable,
		string,
		infer U extends PathKeys.CollectableAncestorKeys,
		string
	>
		? U
		: never

export type Collectable<
	TypeId extends TypeId.Collectable = TypeId.Collectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	CollectionPathKeys extends
		PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
	Key extends string = string
> = PrimaryBase<TypeId, RulesPackage, [...CollectionPathKeys, Key]>

type _AssetCollectionId = Collection<
	'asset_collection',
	'starforged',
	['path'],
	string
>

export type NonCollectable<
	TypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends RulesPackageId = RulesPackageId,
	Key extends DictKey = DictKey
> = PrimaryBase<TypeId, RulesPackage, [Key]>

type _TruthId = NonCollectable<'truth', 'fff', 'f'>

export type Primary = Collectable | Collection | NonCollectable
