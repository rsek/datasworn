import {
	Type,
	CloneType,
	type SchemaOptions,
	type TObject,
	type TOptional,
	type TProperties,
	type TRef
} from '@sinclair/typebox'
import type * as TypeFest from 'type-fest'
import * as Utils from '../Utils.js'
import type * as Id from '../common/Id.js'
import * as Localize from '../common/Localize.js'
import * as Metadata from '../common/Metadata.js'
import { type TFuzzyObject } from '../utils/typebox.js'
import { Dictionary, type TDictionary } from './Dictionary.js'
import { type IdentifiedNode } from './IdentifiedNode.js'
import { SourcedNode, type TSourcedNode } from './SourcedNode.js'
import type { ObjectProperties } from '../utils/ObjectProperties.js'

const CollectionMixin = Type.Object({
	color: Type.Optional(
		Type.Ref(Metadata.CssColor, {
			description: 'A thematic color associated with this collection.'
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
	),
	images: Type.Optional(
		Type.Array(
			Type.Ref(Metadata.WebpImageUrl, {
				description: 'Extra images associated with this collection.'
			})
		)
	),
	icon: Type.Optional(
		Type.Ref(Metadata.SvgImageUrl, {
			description: 'An SVG icon associated with this collection.'
		})
	)
})

export const CollectionBrand = Symbol('Collection')
type TCollectionID = Id.TAnyId
type TCollectionIdMixin<T extends TRef = TRef> = TObject<{
	enhances: TOptional<TCollectionID>
	replaces: TOptional<TCollectionID>
	contents: TDictionary<T>
}>

export function Collection<
	Collectable extends TRef<TFuzzyObject>,
	Props extends TProperties
>(
	_id: TCollectionID,
	collectable: Collectable,
	properties: Props,
	options: SchemaOptions = {}
) {
	const generic = {
		enhances: Type.Optional(
			CloneType(_id, {
				description:
					"This collection's content enhances the identified collection, rather than being a standalone collection of its own."
			})
		),
		replaces: Type.Optional(
			CloneType(_id, {
				description:
					'This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.'
			})
		),
		contents: Type.Optional(Dictionary(collectable))
	}
	const base = Type.Object({
		...CloneType(CollectionMixin).properties,
		...generic,
		...properties
	} as ObjectProperties<typeof CollectionMixin> & typeof generic & Props)

	const result = SourcedNode(_id, base, {
		...options,
		[CollectionBrand]: 'Collection'
	}) as TSourcedNode<typeof base> & {
		[CollectionBrand]: 'Collection'
	}

	return result
}

export type TCollection<
	Collectable extends TRef<TFuzzyObject>,
	Props extends TProperties
> = ReturnType<typeof Collection<Collectable, Props>>

export type Collection<
	Collectable extends IdentifiedNode = IdentifiedNode,
	Props extends object = object
> = SourcedNode<{
	_id: string
	color?: string
	summary?: string
	description?: string
	images?: string[]
	icon?: string
	enhances?: string
	replaces?: string
	contents: Record<string, Collectable>
}> &
	Props

export type CollectionSource<T extends IdentifiedNode = IdentifiedNode> =
	TypeFest.SetOptional<
		Omit<Collection<T>, 'contents'> & {
			contents?: Record<string, TypeFest.SetOptional<T, '_id'>>
		},
		'_id'
	>

export const RecursiveCollectionBrand = Symbol('RecursiveCollection')

export function RecursiveCollection<
	T extends TCollection<TRef<TFuzzyObject>, TProperties>
>(
	collection: T,
	options: TypeFest.SetRequired<SchemaOptions, '$id'>
): TRecursiveCollection<T, 3> {
	// @ts-expect-error
	return Type.Recursive(
		(TThis) =>
			Utils.Assign([
				collection,
				Type.Object({
					collections: Type.Optional(Dictionary(TThis))
				})
			]),
		{
			...options,
			[CollectionBrand]: 'Collection',
			[RecursiveCollectionBrand]: 'RecursiveCollection'
		}
	)
}
// based on es2019 FlatArray
/** Limits recursion to 3 levels (which is the maximum number of times the IDs can recurse through collections) */

export type TRecursiveCollection<
	Base extends TCollection<TRef<TFuzzyObject>, TProperties>,
	Depth extends number = 3
> = Base & {
	[RecursiveCollectionBrand]: 'RecursiveCollection'
} & {
		done: Base

		// This should probably be TDictionary<TRecursiveCollection<T>, [-1,-1,0,1][Depth]>, but TS complains about recursion depth even with that
		recur: TRecursiveCollection<Base, [-1, 0, 1, 2][Depth]>
	}[Depth extends -1 ? 'done' : 'recur']

export type RecursiveCollection<
	T extends Collection<IdentifiedNode>,
	Depth extends number = 3
> = {
	done: T
	recur: RecursiveCollection<T, [-1, 0, 1, 2][Depth]> &
		T & {
			collections: Record<string, RecursiveCollection<T, [-1, -1, 0, 1][Depth]>>
		}
}[Depth extends -1 ? 'done' : 'recur']

export type RecursiveCollectionSource<
	Base extends CollectionSource,
	Depth extends number = 3
> = {
	done: Base
	recur: RecursiveCollectionSource<Base, [-1, 0, 1, 2][Depth]> &
		Base & {
			collections?: Record<
				string,
				RecursiveCollectionSource<Base, [-1, -1, 0, 1][Depth]>
			>
		}
}[Depth extends -1 ? 'done' : 'recur']
