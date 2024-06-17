import fs from 'fs-extra'

import path from 'path'
import { DataswornSchema, DataswornSourceSchema } from '../../schema/Root.js'
import {
	CORE_COMMON,
	DIR_HISTORY_CURRENT,
	DefsKey,
	ROOT_TYPES_OUT
} from '../const.js'
import { writeCode } from '../utils/readWrite.js'
import { extractDefs } from './schemaToTsDeclaration.js'

const rootSchemas = {
	Datasworn: DataswornSchema,
	DataswornSource: DataswornSourceSchema
} satisfies Record<string, unknown>

await fs.emptyDir(ROOT_TYPES_OUT)

const writeJobs: Promise<void>[] = []

for (const identifier in rootSchemas) {
	const value = rootSchemas[identifier as keyof typeof rootSchemas]

	const paths = [
		path.join(ROOT_TYPES_OUT, identifier + '.d.ts'),
		path.join(CORE_COMMON, identifier + '.ts'),
		path.join(DIR_HISTORY_CURRENT, identifier + '.d.ts')
	]

	const fileContents = Object.values(extractDefs(value[DefsKey])).join('\n\n')

	for (const path of paths) writeJobs.push(writeCode(path, fileContents))
}

await Promise.all(writeJobs)
