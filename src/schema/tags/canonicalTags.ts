import {
	Type,
	type ObjectOptions,
	type TProperties,
	type TSchema
} from '@sinclair/typebox'
import Pattern from '../../pkg-core/IdElements/Pattern.js'
import type { Tag } from '../Rules.js'

export function canonicalTags<Props extends TProperties>(
	tags: Props,
	options: ObjectOptions = {}
) {
	return Type.Partial(Type.Object(tags), {
		...options,
		patternProperties: {
			[Pattern.DictKey.source]: Type.Ref<typeof Tag>('Tag')
		}
	})
}
const TagsClassic = {}
const TagsStarforged = {
	recommended: Type.Boolean({
		description: 'This object is ideal for use in Starforged.'
	})
} satisfies Record<string, TSchema>
const TagsDelve = {} satisfies Record<string, TSchema>
type TagParams = {
	schema: TSchema
	applies_to: []
}
// TODO:
const TagsSunderedIsles = {
	recommended: Type.Boolean({
		description: 'This object is ideal for use in Sundered Isles.'
	}),
	cursed_version_of: Type.Array(Type.Ref('OracleRollableIdWildcard')),
	// wrap these into their own objects: "cursed" and "curses"?
	curse_behavior: Type.Array(), // TODO: enum
	cursed_by: Type.Array(),
	region: null // TODO: enum
	// overland_region
	// location
	// faction_type
	// ship_size
	// treasure_size
} satisfies Record<string, TSchema>
