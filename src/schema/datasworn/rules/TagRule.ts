import { Type } from '@sinclair/typebox'
import * as Utils from '../Utils.js'
import * as Generic from '../Generic.js'
import { Id, Localize } from '../common/index.js'

export const CollectableType = Utils.UnionEnum(
	['move', 'asset', 'oracle_table', 'atlas_entry', 'npc'],
	{ $id: 'CollectableType' }
)

export const NonCollectableType = Utils.UnionEnum(
	['delve_site', 'site_theme', 'site_domain', 'truth', 'rarity'],
	{ $id: 'NonCollectableType' }
)

export const ObjectType = Type.Union(
	[Type.Ref(CollectableType), Type.Ref(NonCollectableType)],
	{
		$id: 'ObjectType'
	}
)

export const TagId = Type.RegExp(/([a-z0-9_]{3,}):([a-z][a-z_]*)/, {
	$id: 'TagId'
})

// these are all pretty close to JSON schema already. is it worth taking them all the way?

// or should we favor abstraction to a limited set of dataworn constructs instead?

const TagRuleBase = Type.Object(
	{
		applies_to: Utils.Nullable(Type.Array(Type.Ref(ObjectType)), {
			description:
				'Types of object that can receive this tag, or `null` if any type of object accepts it.'
		}),
		array: Type.Boolean(),
		description: Type.Ref(Localize.MarkdownString)

		// possible types:
		// label
		// markdown

		// enum (string values)
		// number
		// boolean

		// [various IDs]
		// oracle_table

		// array (this subschema then lets the )

		// schema: Type.Intersect([
		// 	Type.Ref('http://json-schema.org/draft-07/schema#'),
		// 	Type.Object({
		// 		properties: Generic.Dictionary(
		// 			Type.Ref('http://json-schema.org/draft-07/schema#')
		// 		)
		// 	})
		// ])
	}
	// { $id: 'TagRule' }
)

export const TagType = Utils.UnionEnumFromRecord({
	// strings
	label: 'A localizable plain text label.',
	markdown: 'Localizable text formatted in markdown.',
	dice: 'A dice expression.',

	oracle_table: 'An oracle table wildcard ID.',
	move: 'A move wildcard ID.',
	asset: 'An asset wildcard ID.',

	enum: 'Choose from one of several preset values.',

	integer: 'An integer value.',
	boolean: 'A true or false value.'

	// array: 'An array of values belonging to one of the other types.'
})

const TagBoolean = Utils.Assign([
	TagRuleBase,
	Type.Object({
		type: Type.Literal('boolean')
	})
])

const TagDice = Utils.Assign([
	TagRuleBase,
	Type.Object({
		type: Type.Literal('dice')
	})
])

const TagInteger = Utils.Assign([
	TagRuleBase,
	Type.Object({
		type: Type.Literal('integer')
	})
])

const TagEnum = Utils.Assign([
	TagRuleBase,
	Type.Object({
		type: Type.Literal('enum'),
		enum: Type.Array(Type.Ref(Id.DictKey), { uniqueItems: true })
	})
])

const IdTags




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
