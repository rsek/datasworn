const neverLegacyIdSubstrings = new Set([
	',',
	'. ',
	': ',
	'[',
	']',
	'(',
	')',
	'://',
	'.svg',
	'.webp'
])

const alwaysMdKeys = new Set([
	'description',
	'summary',
	'quest_starter',
	'your_truth',
	'text',
	'text2',
	'text3',
	'requirement'
])

const neverMdOrIdKeys = new Set([
	'label',
	'name',
	'title',
	'_comment',
	'url',
	'license',
	'icon',
	'roll_type',
	'field_type',
	'oracle_type',
	'field_type',
	'choice_type'
])

/**
 *
 * @param k The key of the JSON value.
 * @param v The JSON value.
 * @param replacementMap
 * @param unreplacedIds An optional set that contains any IDs that were unable to be replaced.
 * @example ```typescript
 * const [replacementMap, oldJson] = await Promise.all([
 *   fs.readFile('./path/to/id_replacement_hash.json'),
 *   fs.readFile('./path/to/old_datasworn_data.json')
 * ])
 * const unreplacedIds = new Set<string>()
 *
 * // parse and do ID replacements
 * const updated = JSON.parse(oldJson, (k,v) => updateIdsInString(k,v,replacementMap, unreplacedIds))
 * ```
 */
export function updateIdInString(
	k: unknown,
	v: unknown,
	replacementMap: Record<string, string | null>,
	unreplacedIds?: Set<string>
) {
	switch (true) {
		case typeof v !== 'string':
		case neverMdOrIdKeys.has(k as string):
			return v
		case isPlainLegacyId(k as string | number, v as string):
			return updateId(v, replacementMap, unreplacedIds)
		case alwaysMdKeys.has(k as string):
		default:
			return updateIdsInMarkdown(v, replacementMap, unreplacedIds)
	}
}

/**
 * Updates markdown ID pointers and templates from v0.0.10 to v0.1.0.
 * @param md The markdown string to change.
 * @returns A new string with the replaced values.
 */
export function updateIdsInMarkdown(
	md: string,
	replacementMap: Record<string, string | null>,
	unreplacedIds?: Set<string>
) {
	let newStr = md

	newStr = newStr.replaceAll(
		oldMarkdownLinkPattern,
		(substring: string, linkText: string, id: string) => {
			const replacementId = updateId(id, replacementMap, unreplacedIds)
			if (id == null) return substring
			return `[${linkText}](${replacementId})`
		}
	)
	newStr = newStr.replaceAll(
		oldMarkdownMacroPattern,
		(substring: string, directive: string, id: string) => {
			const replacementId = updateId(id, replacementMap, unreplacedIds)
			if (id == null) return substring
			return `{{${directive}>${replacementId}}}`
		}
	)

	return newStr
}

export function updateId(
	id: string,
	replacementMap: Record<string, string | null>,
	unreplacedIds?: Set<string>
): string | null {
	const replacement = replacementMap[id]

	if (replacement == null) {
		unreplacedIds?.add(id)
		return null
	}

	return replacement
}

/**
 * Matches the entire markdown macro.
 * @example "{{text:starforged/oracle_rollable/factions/name/legacy}}"
 */
const oldMarkdownMacroPattern =
	/\{\{(?<directive>[a-z_]+):(?<id>[a-z_\\/\\.\d]+?)\}\}/g
/**
 * Matches *only* the actual ID.
 * @example "[Legacy](id:starforged/oracle_rollable/factions/name/legacy)"
 */
const oldMarkdownLinkPattern =
	/\[(?<linkText>\w.+?)\]\(id:(?<id>[a-z_\\/\\.\d]+?)\)/g

function isPlainLegacyId(k: string | number, v: string): boolean {
	switch (true) {
		case alwaysMdKeys.has(k as string):
		case neverMdOrIdKeys.has(k as string):
		case !v.includes('/'):
			return false
		default:
			for (const substr of neverLegacyIdSubstrings)
				if (v.includes(substr)) return false
			return true
	}
}
