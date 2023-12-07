import { type JSONSchema } from 'json-schema-to-typescript'
import { defsKey } from '../const.js'
import { SourceInfo } from '../../schema/datasworn/common/Metadata.js'
import { RulesPackage } from '../../schema/datasworn/RulesPackages.js'
import Log from '../utils/Log.js'
import { Keywords } from '../augmentations.js'

// TODO: this could be done programmatically by looking at the appropriate symbol key on DiscriminatedUnion schemas
const discriminatorKeys = [
	'category',
	'card_type',
	'content_type',
	'field_type',
	'roll_type',
	'package_type',
	'choice_type',
	'oracle_type',
	'using'
] as const

const keywordKeys = [...Object.keys(Keywords)]

export const unsortableKeys = [
	'columns',
	'controls',
	'contents',
	'options',
	'collections',
	'choices'
] as const

const idKeys = ['id'] as const

const relationshipKeys = [
	'replaces',
	'enhances',
	'oracle',
	'asset',
	'region',
	'theme',
	'domain',
	'name_oracle',
	'npc',
	'extra_card'
]

const usageKeys = [
	'auto',
	'duplicates',
	'number_of_rolls',
	'by',
	'method',
	'roll_options',
	'ally',
	'player',
	'is_impact',
	'disables_asset'
]

const shortDescriptionKeys = [
	'result',
	'summary',
	'detail',
	'requirement',
	'features',
	'dangers',
	'drives',
	'tactics'
]
const longDescriptionKeys = ['description', 'text', 'your_character']
const longArrayKeys = ['denizens', 'enhance_moves', 'rows', 'table']

const numericKeys = ['min', 'max', 'value', 'rank']

const rulesKeys = [
	// top level
	'condition_meters',
	'stats',
	'impacts',
	'special_tracks',
	// properties
	'rollable',
	'prevents_recovery',
	'permanent',
	'optional',
	'control',
	'option',
	'condition_meter',
	'stat',

	'tracks',
	'conditions',

	'recover',
	'suffer',
	'choices',
	'xp_cost'
] as const

const sourceMetadataKeys = [...Object.keys(SourceInfo.properties), 'email']

export const dataSwornKeyOrder = [
	...idKeys,
	'title',
	'name',
	'canonical_name',
	'label',
	'datasworn_version',
	...discriminatorKeys,
	...sourceMetadataKeys,
	'ruleset',
	'rules',
	...rulesKeys,
	...relationshipKeys,
	...numericKeys,
	'nature',
	'color',
	'icon',
	'images',
	'track',
	'dice',
	'enabled',
	'frequency',
	'options',
	'count_as_impact',
	...usageKeys,
	'shared',
	'attachments',
	'trigger',
	'roll',
	...shortDescriptionKeys,
	'strong_hit',
	'weak_hit',
	'miss',
	'variants',
	...longDescriptionKeys,
	'abilities',
	'template',
	'rolls',
	'contents',
	'collections',
	'outcomes',
	'quest_starter',
	'your_truth',
	'controls',
	'date',
	'page',
	'authors',
	'license',
	'url',
	'embed_table',
	'match',
	'recommended_rolls',
	'column_labels',
	// relationships
	'oracles',
	'suggestions',
	'enhance_asset',
	'oracle_rolls',
	'tags',
	// very long content

	...longArrayKeys,

	'assets',
	'atlas',
	'moves',
	'npcs',
	'rarities',
	'delve_sites',
	'site_domains',
	'site_themes',
	'truths',
	'source',
	'i18n'
] as const

const warnedKeys = new Set<string>()

export function compareObjectKeys(
	a: string,
	b: string,
	keyOrder: Readonly<string[]> = []
) {
	const [indexA, indexB] = [a, b].map((key) => {
		const index = keyOrder.indexOf(key)
		if (index === -1 && !warnedKeys.has(key)) {
			Log.warn(`key ${key} has not been assigned a sort order.`)
			warnedKeys.add(key)
		}

		return index
	})

	// this shouldn't happen; but if a and b are the same, fall back to alphabetical order.
	if (indexA === indexB) return a.localeCompare(b, 'en-US')

	// if one key lacks an explicit sort, place it last
	if (indexA === -1) return 1
	if (indexB === -1) return -1

	return indexA - indexB
}

export function isSortableObjectSchema(schema: JSONSchema) {
	switch (true) {
		// skip non-object schema or dictionary-like object
		case schema.type !== 'object':
		case schema.patternProperties != null:
			// console.log('SKIP', schema.title ?? schema)
			return false
		default:
			// console.log('Sorting', schema.title ?? schema)
			return true
	}
}

export function sortDataswornKeys<T extends object>(
	object: T,
	sortOrder = dataSwornKeyOrder
) {
	return sortObjectKeys(object, sortOrder)
}

const schemaKeyOrder = [
	'$schema',
	'$id',
	'$ref',
	'title',
	'type',
	'description',
	'$comment',
	...keywordKeys,
	'default',
	'examples',
	// constant
	'const',
	'enum',
	// string
	'format',
	'pattern',
	// number
	'multipleOf',
	'minimum',
	'maximum',
	// array
	'items',
	'minItems',
	'maxItems',
	// object
	'required',
	'properties',
	'patternProperties',
	'additionalItems',
	'additionalProperties',
	// union
	'allOf',
	'anyOf',
	'oneOf',
	defsKey
]

export function sortSchemaKeys<T extends JSONSchema>(schema: T) {
	const sortedSchema = sortObjectKeys(schema, schemaKeyOrder)
	if (sortedSchema.properties != null)
		sortedSchema.properties = sortDataswornKeys(sortedSchema.properties)
	if (Array.isArray(sortedSchema.required)) {
		sortedSchema.required = sortedSchema.required.sort((a, b) =>
			compareObjectKeys(a, b, dataSwornKeyOrder)
		)
	}

	return sortedSchema
}

function sortObjectKeys<T extends object>(
	object: T,
	keyOrder: Readonly<string[]> = []
) {
	if (Array.isArray(object)) return object
	const entries = Object.entries(object).sort(([a], [b]) =>
		compareObjectKeys(a, b, keyOrder)
	)
	return Object.fromEntries(entries) as T
}
