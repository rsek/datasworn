import { Type } from '@sinclair/typebox'
import * as Utils from '../Utils.js'
import * as Generic from '../Generic.js'
import { Id } from '../common/index.js'

export const ObjectType = Utils.UnionEnum(['move', 'asset', 'oracle_table'], {
	$id: 'ObjectType'
})

export const TagId = Type.RegExp(/([a-z0-9_]{3,}):([a-z][a-z_]*)/, {
	$id: 'TagId'
})

export const TagRule = Type.Object(
	{
		id: Type.Ref(TagId),
		for: Utils.Nullable(Type.Array(Type.Ref(ObjectType)), {
			description:
				'Types of object that can receive this tag, or `null` if any type of object accepts it.'
		}),
		schema: Type.Intersect([
			Type.Ref('http://json-schema.org/draft-07/schema#'),
			Type.Object({
				properties: Generic.Dictionary(
					Type.Ref('http://json-schema.org/draft-07/schema#')
				)
			})
		])
	},
	{ $id: 'TagRule' }
)

export const Tag = Type.Object(
	{
		tag: Type.Ref(TagId)
	},
	{ additionalProperties: true, $id: 'Tag' }
)

// a tag object would need to include the following:
// * type of object it points to, if any
// * an identifier for the tag -- this should be namespace specific, e.g. `sundered_isles.curse_oracle`

// could this replace the "suggestions" object?
