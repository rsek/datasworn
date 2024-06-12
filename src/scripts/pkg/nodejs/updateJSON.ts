import fs from 'fs-extra'
import { writeJSON } from '../../utils/readWrite.js'

export async function updateJSON<T>(
	path: string,
	update: Partial<T> | ((data: T) => T)
) {
	const json = await fs.readJson(path)

	let updated: T

	if (typeof update !== 'function') updated = Object.assign(json, update)
	else updated = update(json)

	await writeJSON(path, updated)
}
