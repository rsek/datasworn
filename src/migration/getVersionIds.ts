import FastGlob from 'fast-glob'
import fs from 'fs-extra'
import { ROOT_HISTORY, VERSION } from '../scripts/const.js'
import { replacementMap } from './replacementMap.js'

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
					if (k === '_id') forEach(v as string)
					return v
				})
			)
		)

	await Promise.all(readJobs)
}

const currentIds = new Set<string>()
const mappedIds = new Map<string, string>()
const unmappedIds = new Set<string>()

// console.log(replacementMap)

await Promise.all([
	forEachIdInVersion(VERSION, (id) => currentIds.add(id)),

	forEachIdInVersion('0.0.10', (id) => {
		if (!id.includes('/')) return
		if (mappedIds.has(id) || unmappedIds.has(id)) return
		for (const [pattern, replacer] of replacementMap) {
			const mappedId = id.replace(pattern, replacer)
			if (id.localeCompare(mappedId, 'en-us') === 0) continue

			return mappedIds.set(id, mappedId)
		}

		return unmappedIds.add(id)
	})
])

// console.log(mappedIds)
if (unmappedIds.size > 0) console.log('unmappedIds', unmappedIds)

const goodIds = new Map<string, string>()
const badIds = new Map<string, string>()

for (const [oldId, newId] of mappedIds) {
	if (currentIds.has(newId)) goodIds.set(oldId, newId)
	else badIds.set(oldId, newId)
}

console.log('GOOD IDS:', goodIds)
console.log('BAD IDS', badIds)
