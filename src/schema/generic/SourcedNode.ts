import { Type, type ObjectOptions, type TObject } from '@sinclair/typebox'
import * as Utils from '../Utils.js'
import { Id, Localize, Metadata } from '../common/index.js'
import { type Tag } from '../rules/TagRule.js'
import { Dictionary } from './Dictionary.js'
import { IdentifiedNode, type TIdentifiedNode } from './IdentifiedNode.js'
import type { ObjectProperties } from '../utils/ObjectProperties.js'

/** Interface shared by objects with source attribute. */

export const SourcedNodeBase = Type.Object(
	{
		_id: Type.String(),
		name: Type.Ref(Localize.Label, {
			description: 'The primary name/label for this item.'
		}),
		canonical_name: Type.Optional(
			Type.Ref(Localize.Label, {
				description:
					"The name of this item as it appears on the page in the book, if it's different from `name`."
			})
		),
		_source: Type.Ref(Metadata.SourceInfo, {
			description:
				'Attribution for the original source (such as a book or website) of this item, including the author and licensing information.'
		}),
		suggestions: Type.Optional(Type.Ref(Metadata.Suggestions)),

		tags: Type.Optional(
			Type.Record(Id.RulesetId, Dictionary(Type.Ref<typeof Tag>('Tag')), {
				releaseStage: 'experimental'
			})
		)
		// _sort: Type.Optional(SourceOnly(Type.Number()))
	},
	// overridden when it's used as a mixin, left in for use in validation
	{ additionalProperties: true }
)
export function SourcedNode<T extends TObject = TObject>(
	_id: Id.TAnyId,
	schema: T,
	options: ObjectOptions = {}
): TSourcedNode<T> {
	return IdentifiedNode(
		_id,
		Utils.Assign([SourcedNodeBase, schema]),
		options
	) as any
}
export type TSourcedNode<T extends TObject = TObject> = TIdentifiedNode<
	TObject<
		Utils.Assign<ObjectProperties<typeof SourcedNodeBase>, ObjectProperties<T>>
	>
>
export type SourcedNode<T extends object = object> = IdentifiedNode<T> & {
	name: string
	canonical_name?: string
	_source: Metadata.SourceInfo
	suggestions?: Metadata.Suggestions
}
