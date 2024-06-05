import CONST from './IdElements/CONST.js'
import type NodeTypeId from './IdElements/NodeTypeId.js'

const moveIdPatterns = [
	// standard moves
	/(?<pkg>\*|[a-z][a-z0-9_]{3,})\/moves\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))/,
	// asset moves
	/(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>\*|[a-z][a-z_]*)\/(\*|[a-z][a-z_]*)\/abilities\/(\*|(?:0|[1-9][0-9]*))\/moves\/(?<key>\*|[a-z][a-z_]*)/
]

// const key = /(?<key>[a-z][a-z_]*|\*)/
// const recursiveCollectionPath =
// 	/(?<path>[a-z][a-z_]*(?:\/[a-z][a-z_]*){0,2}|\*{1,2})/

// const pkg = /(?<pkg>[a-z][a-z0-9_]{3,}|\*)/
// const recursivePath =child_id_n
// 	/(?<path>[a-z][a-z_]*(?:\/(?:[a-z][a-z_]*|\*|\**)){0,2}|\*\*)/
// const path = /(?<path>[a-z][a-z_]*|\*)/

const MinorNodeTypes = ['asset_ability_move', 'asset_ability'] as const
type MinorNodeType = (typeof MinorNodeTypes)[number]

type IdReplacer = { old: RegExp; new: string }

type IdReplacementMap = Record<NodeTypeId.Any | MinorNodeType, IdReplacer[]>

const idReplacementMap: IdReplacementMap = {
	asset_collection: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/assets\/(?<path>[a-z_/*]+)$/,
			new: '$1/asset_collection/$2'
		}
	],
	asset: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>[a-z_/*]+)$/,
			new: '$1/asset/$2'
		}
	],
	atlas_collection: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/atlas\/(?<path>[a-z_/*]+)$/,
			new: '$1/atlas_collection/$2'
		}
	],
	atlas_entry: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/atlas\/(?<path>[a-z_/*]+)$/,
			new: '$1/atlas_entry/$2'
		}
	],
	delve_site_domain: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/site_domains\/(?<path>[a-z_/*]+)$/,
			new: '$1/delve_site_domain/$2'
		}
	],
	delve_site_theme: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/site_themes\/(?<path>[a-z_/*]+)$/,
			new: '$1/delve_site_theme/$2'
		}
	],
	delve_site: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/delve_sites\/(?<path>[a-z_/*]+)$/,
			new: '$1/delve_site/$2'
		}
	],
	move_category: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/moves\/(?<path>[a-z_/*]+)$/,
			new: '$1/move_category/$2'
		}
	],
	move: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/moves\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))$/,
			new: '$1/move/$2'
		}
	],
	npc_collection: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/npcs\/(?<path>[a-z_/*]+)$/,
			new: '$1/npc_collection/$2'
		}
	],
	npc: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/npcs\/(?<path>[a-z_/*]+)$/,
			new: '$1/npc/$2'
		}
	],
	oracle_collection: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/oracles\/(?<path>[a-z_/*]+)$/,
			new: '$1/oracle_collection/$2'
		}
	],
	oracle_rollable: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/oracles\/(?<path>[a-z_/*]+)$/,
			new: '$1/oracle_rollable/$2'
		}
	],
	rarity: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/rarities\/(?<path>[a-z_/*]+)$/,
			new: '$1/rarity/$2'
		}
	],
	truth: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/truths\/(?<path>[a-z_/*]+)$/,
			new: '$1/truth/$2'
		}
	],
	asset_ability_move: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(?<index>\*|\d+)\/moves\/(?<key>\*|[a-z][a-z_]*)$/,
			new: '$1/asset/$2.abilities/$3.moves/$4'
		}
	],
	asset_ability: [
		{
			old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(?<index>\*|\d+)$/,
			new: '$1/asset/$2.abilities/$3'
		}
	]
}

/**
 * Updates old (pre-0.1.0) Datasworn IDs (and pointers that reference them in markdown strings) for use with v0.1.0.
 * Intended for use as the `replacer` in {@link JSON.stringify} or the `reviver` in {@link JSON.parse}; this way, it will iterate over every string value so you can update all the IDs in one go.
 * @param key The JSON value's key. Not actually used right now, but retained so it's parameters are consistent with the typical replacer/reviver functions.
 * @param value The JSON value itself.
 * @returns The updated string value, or the original string value if no changes were made.
 * @example ```typescript
 * // Read old data asynchronously
 * const oldJson = await fs.readFile('./path/to/old_datasworn_data.json')
 * // parse and do ID replacements
 * const updated = JSON.parse(oldJson, updateIdsInString)
 * ```
 */
export function updateIdsInString(key: string, value: unknown) {
	const str = value as string

	switch (true) {
		// *all* relevant IDs include this character;
		// strings without them can be safely ignored.
		// won't match a RulesPackageId, but we don't
		// care about them.
		case typeof value !== 'string':
		case !str.includes(CONST.Sep):
			return value

		// implies a markdown ID reference.
		case str.includes('['):
		case str.includes('{{'):
			return updateIdsInMarkdown(value)

		// if it's come this far, it's either
		// * a complete ID
		// * a string with a plain text separator character
		// only the former is relevant.
		default:
			return updateId(value)
	}

	// skip if it's not a string

	// skip if it has no slash characters -- all replaced IDs have them
}

/**
 * Matches *only* the actual ID.
 * @example "{{text:starforged/oracle_rollable/factions/name/legacy}}"
 */
const markdownMacroPattern = /(?<=\{\{[a-z_]+:)[a-z_\/\.\d]+?(?=\}\})/g
/**
 * Matches *only* the actual ID.
 * @example "[Legacy](id:starforged/oracle_rollable/factions/name/legacy)"
 */
const markdownLinkPattern = /(?<=\[\w.+\]\(id:)[a-z_\/\.\d]+?(?=\))/g

const markdownIdPatterns = [markdownMacroPattern, markdownLinkPattern]

/**
 *
 * @param md The markdown string to change.
 * @returns A new string with the replaced values.
 */
function updateIdsInMarkdown(md: string) {
	let newStr = md
	for (const pattern of markdownIdPatterns)
		newStr = newStr.replaceAll(pattern, updateId)
	return newStr
}

function updateId(oldId: string, typeHint?: NodeTypeId.Any) {
	if (typeHint != null && typeHint in idReplacementMap) {
		// type is already known, so we can skip straight to running the replacements
		const replacers = idReplacementMap[typeHint]
		return _applyReplacements(oldId, replacers) ?? oldId
	} else {
		// unknown type, run all of them until one sticks
		for (const typeId in idReplacementMap) {
			const replacers =
				idReplacementMap[typeId as keyof typeof idReplacementMap]
			const newId = _applyReplacements(oldId, replacers)
			if (newId == null) continue
			return newId
		}
	}
	// fall back to old id
	return oldId
}

/** Applies a replacement from an array of replacer objects to a string; the first matching replacer is used. If no matching replacer is found, returns `null` instead. */
function _applyReplacements(str: string, replacers: IdReplacer[]) {
	for (const replacer of replacers)
		if (replacer.old.test(str)) return str.replace(replacer.old, replacer.new)

	// if no replacement is found, return null
	return null
}
