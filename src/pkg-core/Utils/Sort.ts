import type { Datasworn } from '../index.js'

export const unsortableKeys = [
	'columns',
	'controls',
	'contents',
	'options',
	'collections',
	'choices'
] as const
export const idKeys = ['_id', '_key', '_index'] as const

export const relationshipKeys = [
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
] as const

// TODO: this could be done programmatically by looking at the appropriate symbol key on DiscriminatedUnion schemas
export const discriminatorKeys = [
	'type',
	'category',
	'field_type',
	'roll_type',
	'choice_type',
	'oracle_type',
	'value_type',
	'using'
] as const

export const usageKeys = [
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
] as const

export const shortDescriptionKeys = [
	'result',
	'summary',
	'detail',
	'requirement',
	'features',
	'dangers',
	'drives',
	'tactics'
] as const
export const longDescriptionKeys = [
	'text',
	'text2',
	'text3',
	'description',
	'your_character'
] as const
export const longArrayKeys = [
	'denizens',
	'enhance_moves',
	'rows',
	'table'
] as const
export const numericKeys = ['min', 'max', 'value', 'rank'] as const
export const rulesKeys = [
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
export const sourceMetadataKeys = [
	'email',
	'authors',
	'date',
	'license',
	'page',
	'title',
	'url'
] as const satisfies (
	| keyof Datasworn.SourceInfo
	| keyof Omit<Datasworn.AuthorInfo, 'name'>
)[]

export const dataSwornKeyOrder = [
	...idKeys,
	'datasworn_version',
	'type',
	'ruleset',
	'title',
	'name',
	'canonical_name',
	'label',
	...discriminatorKeys,
	...sourceMetadataKeys,
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

	'_comment',

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
	'_source',
	'_i18n'
] as const

export function compareObjectKeys(
	a: string,
	b: string,
	keyOrder: Readonly<string[]> = [],
	unsortableKeys?: Set<string>
) {
	const [indexA, indexB] = [a, b].map((key) => {
		const index = keyOrder.indexOf(key)
		if (unsortableKeys != null && index === -1)
			// logger.warn(`key ${key} has not been assigned a sort order.`)
			unsortableKeys.add(key)

		return index
	})

	// this shouldn't happen; but if a and b are the same, fall back to alphabetical order.
	if (indexA === indexB) return a.localeCompare(b, 'en-US')

	// if one key lacks an explicit sort, place it last
	if (indexA === -1) return 1
	if (indexB === -1) return -1

	return indexA - indexB
}
export function sortDataswornKeys<T extends object>(
	object: T,
	sortOrder = dataSwornKeyOrder
) {
	return sortObjectKeys(object, sortOrder)
}

export function sortObjectKeys<T extends object>(
	object: T,
	keyOrder: Readonly<string[]> = []
) {
	if (Array.isArray(object)) return object
	const entries = Object.entries(object).sort(([a], [b]) =>
		compareObjectKeys(a, b, keyOrder)
	)
	return Object.fromEntries(entries) as T
}
