/**
 * Regenerates the schemas and write them to file.
 */

import JsonPointer from 'json-pointer'
import { type JsonSchema } from 'json-schema-library'
import * as CONST from '../const.js'
import { getPrettierOptions, writeJSON } from '../utils/readWrite.js'
import { sortSchemaKeys } from '../datasworn/sort.js'
import Log from '../utils/Log.js'
import AJV from '../validation/ajv.js'
import * as Schema from '../../schema/index.js'

import JSL from 'json-schema-library'
import { type TRoot } from '../../schema/root/Root.js'
import path from 'path'
import { kebabCase } from 'lodash-es'

const draft7 = new JSL.Draft07()

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
		name: CONST.SCHEMA_NAME,
		rootSchema: Schema.DataswornSchema,
		paths: [
			CONST.SCHEMA_PATH,
			path.join(
				CONST.DIR_HISTORY_CURRENT,
				kebabCase(CONST.SCHEMA_NAME) + '.schema.json'
			)
		],
		messages: {
			writeStart: '✏️  Writing schema for Datasworn',
			writeFinish: '✅ Finished writing schema for Datasworn'
		}
	},
	{
		name: CONST.SOURCE_SCHEMA_NAME,
		rootSchema: Schema.DataswornSourceSchema,
		paths: [
			CONST.SOURCEDATA_SCHEMA_PATH,
			CONST.SOURCE_SCHEMA_PATH,
			path.join(
				CONST.DIR_HISTORY_CURRENT,
				kebabCase(CONST.SOURCE_SCHEMA_NAME) + '.schema.json'
			)
		],
		messages: {
			writeStart: '✏️  Writing schema for DataswornSource',
			writeFinish: '✅ Finished writing schema for DataswornSource'
		}
	}
]

const prettierOptions = await getPrettierOptions(CONST.SCHEMA_PATH)

const metadataKeys: string[] = []

function replacer(k: string, v: unknown) {
	if (metadataKeys.includes(k)) return undefined

	// omit $ids that aren't the root URI, they're redundant and only there for TypeBox
	if (k === '$id' && typeof v === 'string' && !v.startsWith('http'))
		return undefined

	// adjust references for use with standard json validation
	if (
		k === '$ref' &&
		typeof v === 'string' &&
		!v.startsWith('http') &&
		!v.startsWith(`#/${CONST.DefsKey}/`)
	)
		return `#/${CONST.DefsKey}/` + v

	return v
}

for (const { rootSchema, name, paths, messages } of schemaOptions) {
	// serialize first as a lazy way to strip some properties
	// const serialized = JSON.stringify(options.rootSchema)

	// await fsExtra.writeJSON('dump.json', rootSchema)

	AJV.addSchema(rootSchema as JsonSchema, name)

	Log.info(messages.writeStart)

	try {
		for (const path of paths) {
			let sortedSchema: Record<string, unknown> = {}

			draft7.eachSchema((schema, hashPointer) => {
				const pointer = hashPointer.replace(/^#/, '/')
				const newSchema = sortSchemaKeys(JSON.parse(JSON.stringify(schema)))

				if (pointer === '/') sortedSchema = newSchema
				else JsonPointer.set(sortedSchema, pointer, newSchema)
			}, rootSchema)

			// console.log(sortedSchema)

			for (const path of paths)
				writeJSON(path, sortedSchema, {
					prettierOptions,
					replacer
				})

			writeJSON(path, sortedSchema, {
				prettierOptions,
				replacer
			}).then(() => Log.info(messages.writeFinish))
		}
	} catch (error) {
		Log.error(error)

		for (const path of paths)
			writeJSON(path, rootSchema, { prettierOptions, replacer })
	}
}

AJV.removeSchema()