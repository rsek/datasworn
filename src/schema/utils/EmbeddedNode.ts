import {
	Type,
	type ObjectOptions,
	type Static,
	type TLiteral,
	type TObject,
	type TOmit,
	type TRef,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import type { Writable } from 'type-fest'
import type CONST from '../../pkg-core/IdElements/CONST.js'
import NodeTypeId from '../../pkg-core/IdElements/NodeTypeId.js'
import { Computed } from './Computed.js'
import { pascalCase } from './string.js'

const EmbeddedDictionaryKeys = Object.values(NodeTypeId.RootKeys)
type EmbeddedDictionaryKeys = (typeof EmbeddedDictionaryKeys)[number]

const ReplacedEmbedKeys = ['_id'] as const
type ReplacedEmbedKeys = Writable<typeof ReplacedEmbedKeys>
const OmittedEmbedKeys = ['_source', 'enhances', 'replaces'] as const
type OmittedEmbedKeys = Writable<typeof OmittedEmbedKeys>

type TTypeNode = TObject<{ type: TLiteral<string> }>

export function EmbeddedNode<
	TBase extends TTypeNode,
	TId extends TRef<TString | TUnion<TString[]>>,
	TEmbedKeys extends EmbeddedDictionaryKeys[]
>(base: TBase, allowEmbeds: TEmbedKeys, options: ObjectOptions = {}) {
	const typeName = `Embedded${pascalCase(base.properties.type.const)}`

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
> = TLiteral<`${TParentType}${CONST.PathTypeSep}${Static<TBase>['type']}`>

export type TEmbeddedNode<
	TBase extends TTypeNode,
	TParentType extends string,
	TId extends TRef<TString | TUnion<TString[]>>,
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
