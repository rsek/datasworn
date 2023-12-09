import { Type, type Static } from '@sinclair/typebox'
import { snakeCase } from 'lodash-es'
import { type SnakeCase } from 'type-fest'
import { JsonTypeDef } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'
import * as Utils from '../Utils.js'
import * as Id from '../common/Id.js'
import * as Localize from '../common/Localize.js'
import * as Rolls from '../common/Rolls.js'
import { pascalCase } from '../utils/string.js'

const collectableTypes = [
	'OracleRollable',
	'Move',
	'Asset',
	'AtlasEntry',
	'Npc'
] as const
const collectionTypes = [
	'OracleCollection',
	'MoveCategory',
	'AssetCollection',
	'Atlas',
	'NpcCollection'
] as const
const nonCollectableTypes = [
	'DelveSite',
	'DelveSiteTheme',
	'DelveSiteDomain',
	'Truth',
	'Rarity'
] as const

const objectTypes = [
	...collectableTypes,
	...collectionTypes,
	...nonCollectableTypes
]

const objectTypesSnakeCase = objectTypes.map(snakeCase) as [
	...SnakeCase<(typeof objectTypes)[number]>[]
]

export const CollectionType = Utils.UnionEnum(
	collectionTypes.map(snakeCase) as [
		...SnakeCase<(typeof collectionTypes)[number]>[]
	],
	{
		$id: 'CollectionType'
	}
)
export type CollectionType = Static<typeof CollectionType>

export const CollectableType = Utils.UnionEnum(
	collectableTypes.map(snakeCase) as [
		...SnakeCase<(typeof collectableTypes)[number]>[]
	],
	{
		$id: 'CollectableType'
	}
)
export type CollectableType = Static<typeof CollectableType>

export const NonCollectableType = Utils.UnionEnum(
	nonCollectableTypes.map(snakeCase) as [
		...SnakeCase<(typeof nonCollectableTypes)[number]>[]
	],
	{
		$id: 'NonCollectableType'
	}
)
export type NonCollectableType = Static<typeof NonCollectableType>

export const ObjectType = Type.Union(
	[
		Type.Ref(CollectableType),
		Type.Ref(NonCollectableType),
		Type.Ref(CollectionType)
	],
	{
		[JsonTypeDef]: {
			schema: JtdType.Enum(objectTypesSnakeCase)
		},
		$id: 'ObjectType'
	}
)

const TagId = Type.RegExp(/([a-z0-9_]{3,}):([a-z][a-z_]*)/, {
	$id: 'TagId'
})

// these are all pretty close to JSON schema already. is it worth taking them all the way?

// or should we favor abstraction to a limited set of dataworn constructs instead?

const TagRuleBase = Type.Object({
	applies_to: Utils.Nullable(Type.Array(Type.Ref(ObjectType)), {
		description:
			'Types of object that can receive this tag, or `null` if any type of object accepts it.'
	}),
	description: Type.Ref(Localize.MarkdownString)
})

const typedTags = [
	...(['boolean', 'integer'] as const).map((type) =>
		Utils.Assign([
			TagRuleBase,
			Type.Object({
				array: Type.Boolean({ default: false }),
				value_type: Type.Literal(type)
			})
		])
	),
	...objectTypesSnakeCase.map((type) =>
		Utils.Assign([
			TagRuleBase,
			Type.Object({
				wildcard: Type.Boolean({
					default: false,
					description:
						'If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.'
				}),
				value_type: Type.Literal(type)
			})
		])
	),
	Utils.Assign([
		TagRuleBase,
		Type.Object({
			array: Type.Boolean({ default: false }),
			value_type: Type.Literal('enum'),
			enum: Type.Array(Type.Ref(Id.DictKey))
		})
	])
].map((tag) => ({
	...tag,
	title: 'TagRule' + pascalCase(tag.properties.value_type.const)
}))

export const TagRule = Utils.DiscriminatedUnion(typedTags, 'value_type', {
	$id: 'TagRule'
})
export type TagRule = Static<typeof TagRule>

const TagValueNonId = [
	Type.Boolean(),
	Type.Integer(),
	Type.Ref(Id.DictKey), // from enums
	Type.Ref(Rolls.DiceExpression)
]

export const Tag = Type.Union(
	[
		...TagValueNonId,
		...objectTypes.map((type) => Type.Ref(type + 'Id')),
		Type.Array(
			Type.Union([
				// Type.Ref(Id.DictKey), // from enums
				// Type.Ref(Rolls.DiceExpression),
				...objectTypes.map((type) => Type.Ref(type + 'IdWildcard'))
			])
		)
	],
	{ $id: 'Tag', [JsonTypeDef]: { schema: JtdType.Any() } }
)

// export const Tag = Type.Object(
// 	{
// 		tag: Type.Ref(TagId)
// 	},
// 	{ additionalProperties: true, $id: 'Tag' }
// )

// a tag object would need to include the following:
// * type of object it points to, if any
// * an identifier for the tag -- this should be namespace specific, e.g. `sundered_isles.curse_oracle`

// could this replace the "suggestions" object?
