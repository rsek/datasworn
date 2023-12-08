import fs from 'fs-extra'
import * as JTD from 'jtd'
import Log from '../utils/Log.js'
import { refTracker, toJtdRoot } from './utils.js'

import { DataswornRoot } from '../../schema/index.js'
import { isEmpty } from 'lodash-es'
import { buildTypeDefs } from './buildTypeDefs.js'
import { JTD_JSON_PATH } from './const.js'
import { log } from 'console'

const root: JTD.Schema = toJtdRoot(DataswornRoot)

for (const name of refTracker)
	if (!(name in root?.definitions ?? {}))
		Log.error(`Missing definition for ${name}`)

const json = JSON.stringify(
	root,
	(k, v) => {
		if (isEmpty(v) && k !== 'properties') return undefined
		return v
	},
	'\t'
)
const filePath = JTD_JSON_PATH

fs.writeFile(filePath, json).then(() => {
	if (!JTD.isValidSchema(JSON.parse(json)))
		Log.error(`Wrote to ${filePath}, but it\'s not a valid JSON Typedef schema`)
})

await buildTypeDefs()
