import {
	Type,
	type ObjectOptions,
	type Static,
	type TObject,
	type TRef,
	type TRefUnsafe,
	type TSchema,
	type TUnion
} from '@sinclair/typebox'
import {
	EnhancesKey,
	ContentsKey,
	CollectionsKey
} from '../../scripts/const.js'
import TypeId from '../../pkg-core/IdElements/TypeId.js'
import * as Text from '../common/Text.js'
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
	| TDictionary<TRef | TRefUnsafe<TSchema> | TUnion<TRef[]>>
	| TUnion<TDictionary<TRef | TRefUnsafe<TSchema> | TUnion<TRef[]>>[]>

export function getCollectionNodeMetadata(
	enhances: TRef<string>,
	contentChild?: TCollectionDictionary,
	collectionChild?: TCollectionDictionary
) {
	const props: Record<string, TSchema> = {
		[EnhancesKey]: Type.Optional(
			Type.Array(enhances, {
				description:
					"This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own."
			})
		),
		summary: Type.Optional(
			Type.Ref(Text.MarkdownString, {
				description:
					'A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.'
			})
		),
		description: Type.Optional(
			Type.Ref(Text.MarkdownString, {
				description:
					"A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead."
			})
		)
	}

	if (contentChild != null)
		props[ContentsKey] = contentChild

	if (collectionChild != null)
		props[CollectionsKey] = collectionChild

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

	const thisWildcardIdRef = Type.Ref(thisIdSchemaId + 'Wildcard')
	const thisIdRef = Type.Ref(thisIdSchemaId)
	const thisSchemaRef = Type.Ref(thisSchemaId)

	// Use explicit TObject casts to avoid deep type instantiation
	const metadata = getCollectionNodeMetadata(
		thisWildcardIdRef,
		setSourceOptional(Dictionary(collectableSchemaRef)),
		setSourceOptional(Dictionary(thisSchemaRef))
	)
	const enhancedBase: TObject = Assign(metadata as TObject, base as TObject) as TObject

	return PrimaryTypeNode(enhancedBase, type, {
		...options,
		$id: thisSchemaId,
		[CollectionBrand]: 'Collection'
	}) as unknown as TCollectionNode<TBase, TType>
}

type TCollectionMeta = ReturnType<typeof getCollectionNodeMetadata>
type CollectionMeta = Static<TCollectionMeta>

export type CollectionNode<
	TBase extends object,
	TType extends TypeId.Collection
> = PrimaryTypeNode<TBase & CollectionMeta, TType>

/** Simplified type to avoid deep instantiation */
export type TCollectionNode<
	TBase extends TObject = TObject,
	TType extends TypeId.Collection = TypeId.Collection
> = TObject & {
	$id: string
	[CollectionBrand]: 'Collection'
	_collectionType: TType
	_collectionBase: TBase
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

	const thisIdWildcardRef = Type.Ref(baseSchemaName + 'IdWildcard')

	// Use explicit TObject casts to avoid deep type instantiation
	const metadata = getCollectionNodeMetadata(thisIdWildcardRef, contents, collections)
	const enhancedBase: TObject = Assign(metadata as TObject, base as TObject) as TObject

	return PrimarySubtypeNode(enhancedBase, type, subtypeKey, subtype, options)
}
