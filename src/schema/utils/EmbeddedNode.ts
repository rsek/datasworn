import {
	Type,
	type ObjectOptions,
	type Static,
	type TLiteral,
	type TObject,
	type TOmit,
	type TRefUnsafe,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import type { Writable } from 'type-fest'
import {
	IdKey,
	SourceInfoKey,
	EnhancesKey,
	ReplacesKey,
	type TypeSep
} from '../../scripts/const.js'
import TypeId from '../../pkg-core/IdElements/TypeId.js'
import { Computed } from './Computed.js'
import { pascalCase } from './string.js'

const EmbeddedDictionaryKeys = Object.values(TypeId.BranchKey)
type EmbeddedDictionaryKeys = (typeof EmbeddedDictionaryKeys)[number]

const ReplacedEmbedKeys = [IdKey] as const
type ReplacedEmbedKeys = Writable<typeof ReplacedEmbedKeys>
const OmittedEmbedKeys = [SourceInfoKey, EnhancesKey, ReplacesKey] as const
type OmittedEmbedKeys = Writable<typeof OmittedEmbedKeys>

type TTypeNode = TObject<{ type: TLiteral<string> }>

export function EmbeddedPrimaryNode<
	TBase extends TObject,
	TId extends TRefUnsafe<TString | TUnion<TString[]>>,
	TEmbedKeys extends EmbeddedDictionaryKeys[]
>(base: TBase, allowEmbeds: TEmbedKeys, options: ObjectOptions = {}) {
	const typeSchema = (base as unknown as TTypeNode).properties?.type
	const typeName = `Embedded${pascalCase(typeSchema?.const ?? 'Unknown')}`

	const _id = Computed(Type.Ref(typeName + 'Id'))

	const forbiddenEmbedChildren = (
		allowEmbeds == null
			? EmbeddedDictionaryKeys
			: EmbeddedDictionaryKeys.filter((k) => !allowEmbeds.includes(k))
	) as [
		...Exclude<(typeof EmbeddedDictionaryKeys)[number], TEmbedKeys[number]>[]
	]
	const omittedKeys = [
		...forbiddenEmbedChildren,
		...ReplacedEmbedKeys,
		...OmittedEmbedKeys
	] as const

	const { properties } = Type.Omit(base, omittedKeys)

	const result = Type.Object({ _id, ...properties }, options)

	// @ts-expect-error
	return result as TEmbeddedNode<TBase, TParentType, TId, TEmbedKeys>
}

export type TEmbeddedNodeTypeLiteral<
	TBase extends TTypeNode,
	TParentType extends string
> = TLiteral<`${TParentType}${TypeSep}${Static<TBase>['type']}`>

export type TEmbeddedNode<
	TBase extends TTypeNode,
	TParentType extends string,
	TId extends TRefUnsafe<TString | TUnion<TString[]>>,
	TEmbedKeys extends EmbeddedDictionaryKeys[]
> = TObject<
	{
		_id: TId
		type: TEmbeddedNodeTypeLiteral<TBase, TParentType>
	} & TOmit<
		TBase,
		[
			...OmittedEmbedKeys,
			...ReplacedEmbedKeys,
			...Exclude<EmbeddedDictionaryKeys, TEmbedKeys[number]>[]
		]
	>['properties']
>

// export function EmbeddedDiscriminatedUnion<
// 	TUnionBase extends TDiscriminatedUnion<
// 		TDiscriminatorMap<TDiscriminable<TTypeNode>>
// 	>,
// 	TParentType extends string,
// 	TId extends TRef<TString | TUnion<TString[]>>,
// 	TEmbedKeys extends EmbeddedDictionaryKeys[] = []
// >(
// 	base: TUnionBase,
// 	parent: TParentType,

// 	allowEmbeds?: TEmbedKeys,
// 	options: ObjectOptions = {}
// ) {
// 	const mapping = base[Mapping]
// 	type TMapBase = TUnionBase[typeof Mapping]
// 	type TRemap = {
// 		[K in keyof TMapBase]: TEmbeddedNode<
// 			TMapBase[K] & TTypeNode,
// 			TParentType,
// 			TId,
// 			TEmbedKeys
// 		>
// 	}
// 	if (allowEmbeds == null) allowEmbeds = [] as any
// 	const remapping = {} as TRemap

// 	for (const k in mapping) {
// 		// @ts-expect-error
// 		const subtype = base[Mapping][k]
// 		// @ts-expect-error
// 		remapping[k] = EmbeddedNode(subtype, parent, allowEmbeds)
// 	}

// 	return DiscriminatedUnion(
// 		remapping,
// 		// @ts-expect-error
// 		base[Discriminator],
// 		options
// 	) as TDiscriminatedUnion<
// 		TRemap,
// 		TUnionBase[typeof Discriminator] & TDiscriminableKeyFor<TRemap>
// 	>
// }

// export type TEmbeddedDiscriminatorMap<
// 	TBase extends TDiscriminatorMap<TDiscriminable<TTypeNode>>,
// 	TParentType extends string,
// 	TId extends TRef<TString | TUnion<TString[]>>,
// 	TEmbedKeys extends EmbeddedDictionaryKeys[]
// > = {
// 	[K in keyof TBase]: TEmbeddedNode<
// 		TBase[K] & TTypeNode,
// 		TParentType,
// 		TId,
// 		TEmbedKeys
// 	>
// }

// export type TEmbeddedDiscriminatedUnion<
// 	TUnionBase extends TDiscriminatedUnion<
// 		TDiscriminatorMap<TDiscriminable<TTypeNode>, 'type'>,
// 		'type'
// 	>,
// 	TParentType extends string,
// 	TId extends TRef<TString | TUnion<TString[]>>,
// 	TEmbedKeys extends EmbeddedDictionaryKeys[]
// > = TDiscriminatedUnion<
// 	TEmbeddedDiscriminatorMap<
// 		TUnionBase[typeof Mapping],
// 		TParentType,
// 		TId,
// 		TEmbedKeys
// 	>,
// 	TUnionBase[typeof Discriminator] &
// 		TDiscriminableKeyFor<
// 			TEmbeddedDiscriminatorMap<
// 				TUnionBase[typeof Mapping],
// 				TParentType,
// 				TId,
// 				TEmbedKeys
// 			>
// 		>
// >
