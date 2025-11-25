import * as JTD from 'jtd'
import Log from '../utils/Log.js'
import { refTracker, toJtdRoot } from './utils.js'

import { isEmpty } from 'lodash-es'
import { DataswornSchema } from '../../schema/index.js'
import { cmdOptions, getTypeDefBuildCommand } from './buildTypeDefs.js'
import { JTD_JSON_PATH } from './const.js'
import { emptyDir, writeJSON } from '../utils/readWrite.js'
import { shellPromise } from '../../shellify.js'

const jtdRoot = toJtdRoot(DataswornSchema) as JTD.Schema

for (const name of refTracker)
	if (!(name in (jtdRoot.definitions ?? {})))
		throw new Error(`Missing definition for ${name}`)

const filePath = JTD_JSON_PATH

const json = await writeJSON(filePath, jtdRoot, {
	replacer: (k, v) => {
		if (isEmpty(v) && k !== 'properties') return undefined
		return v
	}
})

if (!JTD.isValidSchema(JSON.parse(json)))
	throw new Error(
		`Wrote JTD schema to ${filePath}, but it\'s not a valid JSON Typedef schema. No type code was generated.`
	)

// flush old files before generating types
const deleteOps: Promise<unknown>[] = []

for (const k in cmdOptions) {
	if (!k.endsWith('Out')) continue
	deleteOps.push(emptyDir(cmdOptions[k as keyof typeof cmdOptions] as string))
}

await Promise.all(deleteOps)

// run JTD type generation
await shellPromise(getTypeDefBuildCommand(), {
	env: {
		...process.env,
		RUST_BACKTRACE: 'full'
	}
})
