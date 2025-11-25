/**
 * Regenerates the schemas and write them to file.
 */

import type { JsonSchema } from 'json-schema-library'
import {
	SCHEMA_NAME,
	SCHEMA_PATH,
	DIR_HISTORY_CURRENT,
	SOURCE_SCHEMA_NAME,
	SOURCEDATA_SCHEMA_PATH,
	SOURCE_SCHEMA_PATH,
	DefsKey,
} from '../const.js'
import { writeJSON } from '../utils/readWrite.js'
import { sortSchemaKeys } from '../datasworn/sort.js'
import Log from '../utils/Log.js'
import AJV from '../validation/ajv.js'
import * as Schema from '../../schema/index.js'

import type { TRoot } from '../../schema/root/Root.js'
import path from 'node:path'
import { kebabCase } from 'lodash-es'

interface SchemaOptions {
	name: string
	rootSchema: TRoot
	paths: string[]
	messages: {
		writeStart: string
		writeFinish: string
	}
}

const schemaOptions: SchemaOptions[] = [
	{
		name: SCHEMA_NAME,
		rootSchema: Schema.DataswornSchema,
		paths: [
			SCHEMA_PATH,
			path.join(DIR_HISTORY_CURRENT, `${kebabCase(SCHEMA_NAME)}.schema.json`)
		],
		messages: {
			writeStart: '✏️  Writing schema for Datasworn',
			writeFinish: '✅ Finished writing schema for Datasworn'
		}
	},
	{
		name: SOURCE_SCHEMA_NAME,
		rootSchema: Schema.DataswornSourceSchema,
		paths: [
			SOURCEDATA_SCHEMA_PATH,
			SOURCE_SCHEMA_PATH,
			path.join(
				DIR_HISTORY_CURRENT,
				`${kebabCase(SOURCE_SCHEMA_NAME)}.schema.json`
			)
		],
		messages: {
			writeStart: '✏️  Writing schema for DataswornSource',
			writeFinish: '✅ Finished writing schema for DataswornSource'
		}
	}
]

const metadataKeys: string[] = []


function replacer(k: string, v: unknown) {
	if (metadataKeys.includes(k)) return undefined

	if (k === '$id' && typeof v === 'string' && !v.startsWith('http'))
		// omit $ids that aren't the root URI, they're redundant and only there for TypeBox
		return undefined
	if (
		k === '$ref' &&
		typeof v === 'string' &&
		!v.startsWith('http') &&
		!v.startsWith(`#/${DefsKey}/`)
	)
		// adjust references for use with standard json validation
		return `#/${DefsKey}/${v}`

  return v
}

/** Pending operations to write the schema to disk */
const writeOps: Promise<unknown>[] = []

for (const { rootSchema, name, paths, messages } of schemaOptions) {
	AJV.addSchema(rootSchema as JsonSchema, name)

	try {
		Log.info(messages.writeStart)

		// Recursively sort all keys in the schema
		const sortedSchema = sortSchemaKeys(JSON.parse(JSON.stringify(rootSchema)))

		writeOps.push(
			writeJSON(paths, sortedSchema, {
				replacer,
			}).then(() => Log.info(messages.writeFinish))
		)
	} catch (error) {
		Log.error(error)

		await writeJSON(paths, rootSchema, { replacer })
	}
}

await Promise.all(writeOps)
