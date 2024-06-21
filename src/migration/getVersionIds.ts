import FastGlob from 'fast-glob'
import fs from 'fs-extra'
import { ROOT_HISTORY, VERSION } from '../scripts/const.js'
import { replacementMap } from './replacementMap.js'
import { writeJSON } from '../scripts/utils/readWrite.js'
import path from 'path'
import type { IdReplacer } from '../pkg-core/Migrations/migrations.js'
import CONST from '../pkg-core/IdElements/CONST.js'
import { escapeRegExp } from 'lodash-es'
import TypeId from '../pkg-core/IdElements/TypeId.js'
import Pattern from '../pkg-core/IdElements/Pattern.js'

const oldVersion = '0.0.10'

const idKeys = new Set(['_id', '$id'])

const idBlacklist = new Set([
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
const stringKeyBlacklist = new Set([
	'label',
	'name',
	'title',
	'text',
	'description',
	'summary',
	'_comment',
	'result',
	'url',
	'license',
	'icon'
])

function mightBeId(value: unknown) {
	if (typeof value !== 'string') return false
	if (!value.includes('/')) return false

	// check for character sequences that can occur only in markdown strings
	for (const char of idBlacklist) if (value.includes(char)) return false

	return true
}

export async function forEachIdInVersion(
	version: string,
	forEach: (id: string) => void
) {
	const glob = `${ROOT_HISTORY}/${version}/*/*.json`

	const files = await FastGlob(glob)

	const readJobs: Promise<unknown>[] = []

	for (const file of files)
		readJobs.push(
			fs.readFile(file, { encoding: 'utf-8' }).then((v) =>
				JSON.parse(v.toString(), (k, v) => {
					if (idKeys.has(k) || (!stringKeyBlacklist.has(k) && mightBeId(v)))
						forEach(v as string)

					return v
				})
			)
		)

	await Promise.all(readJobs)
}

function getWildcardRegex(wildcardId: string) {
	// without any wildcards, there's not much to worry about. just escape it for use in the regex.
	if (!wildcardId.includes(CONST.WildcardString))
		return new RegExp(`^${escapeRegExp(wildcardId)}$`)

	const [fullTypeId, fullPath] = wildcardId.split(CONST.PrefixSep)
	const [primaryPath, ...embeddedKeys] = fullPath.split(CONST.TypeSep)
	const [rulesPackage, ...primaryPathKeys] = wildcardId.split(CONST.PathKeySep)

	const typePattern = fullTypeId.replaceAll(CONST.TypeSep, '\\' + CONST.TypeSep)
	let pathPattern = ''

	switch (rulesPackage) {
		case CONST.GlobstarString:
			// exit early, since this can match anything of its type.
			// lazy way to trawl IDs that are already known to be valid. don't use for production.
			return new RegExp(
				`^${typePattern}${CONST.PrefixSep}${Pattern.RulesPackageElement.source}(?:/[a-z\\d_
        \\.]+)+$`
			)
		case CONST.WildcardString:
			pathPattern += Pattern.RulesPackageElement.source
			break
		default:
			pathPattern += rulesPackage
			break
	}

	for (const pathKey of primaryPathKeys) {
		switch (pathKey) {
			case CONST.GlobstarString:
				pathPattern += `(/${Pattern.DictKeyElement.source})*`
				break
			case CONST.WildcardString:
				pathPattern += '/' + Pattern.DictKeyElement.source
				break
			default:
				pathPattern += '/' + pathKey
				break
		}
	}

	for (const embeddedKey of embeddedKeys) {
		pathPattern += '\\' + CONST.TypeSep
		switch (embeddedKey) {
			case CONST.WildcardString:
				pathPattern += `${Pattern.DictKeyElement.source}|\\d+`
				break
			default:
				pathPattern += embeddedKey
				break
		}
	}

	return new RegExp(`^${typePattern}${CONST.PrefixSep}${pathPattern}$`)
}

// console.log(getWildcardRegex('oracle_rollable:starforged/core/action'))

export async function generateIdMap(
	fromVersion: string,
	toVersion: string,
	replacers: Map<RegExp, string | null>
) {
	const currentIds = new Set<string>()
	const mappedIds = new Map<string, string | null>()
	const unmappedIds = new Set<string>()

	// console.log(replacementMap)

	await Promise.all([
		forEachIdInVersion(toVersion, (id) => currentIds.add(id)),

		forEachIdInVersion(fromVersion, (id) => {
			// skip RulesPackageIds
			if (!id.includes('/')) return
			// skip ones that are already done
			if (mappedIds.has(id) || unmappedIds.has(id)) return
			for (const [pattern, replacer] of replacers) {
				const isMatch = pattern.test(id)
				if (!isMatch) continue
				if (replacer === null) return mappedIds.set(id, null)
				else return mappedIds.set(id, id.replace(pattern, replacer))
			}

			return unmappedIds.add(id)
		})
	])

	if (unmappedIds.size > 0) {
		console.log(unmappedIds)
		throw new Error(
			`${unmappedIds.size} IDs from ${fromVersion} don't have a valid replacer. Change the regular expressions so that they can be matched to their equivalent in ${toVersion}, or explicitly assign them a null replacement (if no similarly-typed analogue exists).`
		)
	}

	// console.log(mappedIds)
	// if (unmappedIds.size > 0) console.log('unmappedIds', unmappedIds)

	const goodIds = new Map<string, string | null>()
	const badIds = new Map<string, string | null>()

	for (const [oldId, newId] of mappedIds) {
		switch (true) {
			case typeof newId === 'string' && currentIds.has(newId):
			case newId === null:
			case oldId.includes('*'):
			case newId?.includes('*'):
				goodIds.set(oldId, newId)
				break
			default:
				badIds.set(oldId, newId)
				break
		}
	}

	// console.log('GOOD IDS:', goodIds)
	if (badIds.size > 0) {
		console.log(badIds)
		throw new Error(
			`Got ${goodIds.size + badIds.size} replacement IDs, but ${badIds.size} have targets that don't exist.`
		)
	}

	return goodIds
}

const data = Object.fromEntries(
	await generateIdMap(oldVersion, VERSION, replacementMap)
)

// console.log(data)

await writeJSON(path.join(ROOT_HISTORY, VERSION, 'id_map.json'), data)