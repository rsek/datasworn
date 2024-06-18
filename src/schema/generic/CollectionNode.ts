import {
	Type,
	type ObjectOptions,
	type Static,
	type TObject,
	type TRef,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import CONST from '../../pkg-core/IdElements/CONST.js'
import TypeId from '../../pkg-core/IdElements/TypeId.js'
import * as Localize from '../common/Localize.js'
import { Assign, FlatIntersect, type TAssign } from '../utils/FlatIntersect.js'
import { pascalCase } from '../utils/string.js'
import { Dictionary, type TDictionary } from './Dictionary.js'
import {
	PrimarySubtypeNode,
	PrimaryTypeNode,
	type TPrimaryTypeNode
} from './PrimaryTypeNode.js'
import type { SetRequired } from 'type-fest'
import { setSourceOptional } from '../Utils.js'

export const CollectionBrand = Symbol('Collection')

type TCollectionDictionary =
	| TDictionary<TRef | TUnion<TRef[]>>
	| TUnion<TDictionary<TRef | TUnion<TRef[]>>[]>

export function getCollectionNodeMetadata(
	enhances: TRef<TString>,
	contentChild?: TCollectionDictionary,
	collectionChild?: TCollectionDictionary
) {
	const props = {
		enhances: Type.Optional(
			Type.Array(enhances, {
				description:
					"This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own."
			})
		),
		summary: Type.Optional(
			Type.Ref(Localize.MarkdownString, {
				description:
					'A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.'
			})
		),
		description: Type.Optional(
			Type.Ref(Localize.MarkdownString, {
				description:
					"A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead."
			})
		)
	}
	// @ts-expect-error
	if (contentChild != null) props[CONST.ContentsKey] = contentChild

	// @ts-expect-error
	if (collectionChild != null) props[CONST.CollectionsKey] = collectionChild
	return Type.Object(props)
}

export function CollectionNode<
	TBase extends TObject,
	TType extends TypeId.Collection
>(base: TBase, type: TType, options: ObjectOptions = {}) {
	const collectableTypeId = TypeId.getCollectableOf(type)
	const collectableSchemaRef = Type.Ref(pascalCase(collectableTypeId))
	const thisSchemaId = pascalCase(type)
	const thisIdSchemaId = thisSchemaId + 'Id'

	const thisWildcardIdRef = Type.Ref<TString>(thisIdSchemaId + 'Wildcard')
	const thisIdRef = Type.Ref<TString>(thisIdSchemaId)
	const thisSchemaRef = Type.Ref(thisSchemaId)

	const enhancedBase = Assign(
		getCollectionNodeMetadata(
			thisWildcardIdRef,
			setSourceOptional(Dictionary(collectableSchemaRef, { default: {} })),
			setSourceOptional(Dictionary(thisSchemaRef, { default: {} }))
		),
		base
	)

	return PrimaryTypeNode(enhancedBase, type, {
		...options,
		$id: thisSchemaId,
		[CollectionBrand]: 'Collection'
	}) as unknown as TCollectionNode<typeof enhancedBase, TType>
}

type TCollectionMeta = ReturnType<typeof getCollectionNodeMetadata>
type CollectionMeta = Static<TCollectionMeta>

export type CollectionNode<
	TBase extends object,
	TType extends TypeId.Collection
> = PrimaryTypeNode<TBase & CollectionMeta, TType>

export type TCollectionNode<
	TBase extends TObject,
	TType extends TypeId.Collection
> = TPrimaryTypeNode<TAssign<TCollectionMeta, TBase>, TType> & {
	$id: string
	[CollectionBrand]: 'Collection'
	static: CollectionNode<Static<TBase>, TType>
}

export function CollectionSubtypeNode<
	TBase extends TObject,
	TType extends TypeId.Collection,
	TSubtypeKey extends string,
	TSubtype extends string
>(
	base: TBase,
	type: TType,
	subtypeKey: TSubtypeKey,
	subtype: TSubtype,
	contents: TCollectionDictionary | undefined,
	collections: TCollectionDictionary | undefined,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const baseSchemaName = pascalCase(type)
	const thisSchemaName = baseSchemaName + pascalCase(subtype)

	const thisId = Type.Ref<TString | TUnion<TString[]>>(baseSchemaName + 'Id')
	const thisIdWildcardRef = Type.Ref<TString>(baseSchemaName + 'IdWildcard')

	const enhancedBase = Assign(
		getCollectionNodeMetadata(thisIdWildcardRef, contents, collections),
		base
	)

	return PrimarySubtypeNode(enhancedBase, type, subtypeKey, subtype, options)
}
