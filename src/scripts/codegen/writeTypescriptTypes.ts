import fs from 'fs-extra'

import path from 'path'
import { DataswornSchema, DataswornSourceSchema } from '../../schema/Root.js'
import { ROOT_TYPES_OUT, DefsKey } from '../const.js'
import { extractDefs } from './schemaToTsDeclaration.js'
import { writeCode } from '../utils/readWrite.js'

const rootSchemas = {
	Datasworn: DataswornSchema,
	DataswornSource: DataswornSourceSchema
}

await fs.emptyDir(ROOT_TYPES_OUT)

for await (const [identifier, value] of Object.entries(rootSchemas)) {
	const filePath = path.join(ROOT_TYPES_OUT, identifier + '.d.ts')
	const filePath2 = path.join(process.cwd(), 'src/pkg-core', identifier + '.ts')

	const fileContents = Object.values(extractDefs(value[DefsKey])).join('\n\n')

	await writeCode(filePath, fileContents)
	await writeCode(filePath2, fileContents)
}
