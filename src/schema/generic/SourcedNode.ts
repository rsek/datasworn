import {
	Type,
	type ObjectOptions,
	type Static,
	type TObject,
	type TRef,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import { Label } from '../common/Localize.js'
import { SourceInfo, Suggestions } from '../common/Metadata.js'
import { Tags } from '../rules/TagRule.js'
import { FlatIntersect, type TAssign } from '../utils/FlatIntersect.js'
import { IdNode, type TIdNode } from './IdNode.js'
import type { TAnyId } from '../common/Id.js'

const SourcedNodeBase = Type.Object({
	name: Type.Ref(Label, {
		description: 'The primary name/label for this node.'
	}),
	canonical_name: Type.Optional(
		Type.Ref(Label, {
			description:
				"The name of this node as it appears on the page in the book, if it's different from `name`."
		})
	),
	_source: Type.Ref(SourceInfo, {
		description:
			'Attribution for the original source (such as a book or website) of this node, including the author and licensing information.'
	}),
	suggestions: Type.Optional(Type.Ref(Suggestions)),
	tags: Type.Optional(Type.Ref(Tags))
})

/** Interface shared by objects with source attribute. */

export function SourcedNode<TBase extends TObject>(
	base: TBase,
	_id: TAnyId,
	options: ObjectOptions = {}
) {
	const enhancedBase = FlatIntersect([SourcedNodeBase, base])

	return IdNode(enhancedBase, _id, options)
}

export type TSourcedNode<TBase extends TObject> = TIdNode<
	TAssign<typeof SourcedNodeBase, TBase>
> & { static: SourcedNode<Static<TBase>> }

export type SourcedNode<TBase extends object = object> = Static<
	typeof SourcedNodeBase
> &
	IdNode<TBase>
