/**
 * TODO: Complete i18n extraction implementation
 *
 * This script requires implementing loadDataswornNamespace or refactoring
 * to use RulesPackageBuilder to load built Datasworn packages.
 */

import type { JsonSchema } from 'json-schema-library'
import { ROOT_OUTPUT, SCHEMA_PATH } from '../const.js'
import * as pkgs from '../pkg/pkgConfig.js'
import { promises as fs } from 'node:fs'
import { extractLocaleStrings } from './extractLocaleStrings.js'
import path from 'node:path'
import type { Datasworn } from '../../pkg-core/index.js'
import { IdKey } from '../../pkg-core/IdElements/CONST.js'
import { readJSON } from '../utils/readWrite.js'

const DEFAULT_LOCALE = 'en'

/**
 * TODO: Implement this function to load built Datasworn packages
 * Should return an array of RulesPackage objects for the given namespace
 */
async function loadDataswornNamespace(
	_namespaceId: string
): Promise<Datasworn.RulesPackage[]> {
	throw new Error(
		'loadDataswornNamespace is not implemented. ' +
			'This script needs to be updated to load built Datasworn packages.'
	)
}

const schema = await readJSON<JsonSchema>(SCHEMA_PATH)

for (const pkg of Object.values(pkgs)) {
	const collections = await loadDataswornNamespace(pkg.id)

	const localeDir = path.join(ROOT_OUTPUT, pkg.id, 'i18n', DEFAULT_LOCALE)

	await fs.mkdir(localeDir, { recursive: true })

	for (const collection of collections) {
		const omitKeys: string[] = ['_source', IdKey]
		const [type] = Object.keys(collection).filter((k) => !omitKeys.includes(k))
		if (type == null) continue

		const result = extractLocaleStrings(collection, schema)

		const data: Array<{ text: string; sources: string[] }> = []

		for (const [text, sources] of result) data.push({ text, sources })

		const dest = path.join(localeDir, `${String(type)}.json`)

		await fs.writeFile(dest, JSON.stringify(data, null, '\t'), 'utf-8')
	}
}
