import fs from 'fs-extra'
import path from 'path'
import {
	LEGACY_ID_PATH,
	PKG_DIR_NODE,
	PKG_SCOPE_OFFICIAL,
	ROOT_SOURCE_DATA,
	SCHEMA_PATH,
	SOURCE_SCHEMA_PATH,
	SOURCE_TYPES_OUT,
	TYPES_OUT
} from '../../const.js'
import Log from '../../utils/Log.js'
import { Compiler } from '@swc/core'

new Compiler()

const corePkgSrcRoot = path.join('src/pkg-core')
const corePkgOutRoot = path.join(PKG_DIR_NODE, PKG_SCOPE_OFFICIAL, 'core')

const id = `${PKG_SCOPE_OFFICIAL}/core`
const jsonDir = path.join(corePkgOutRoot, 'json')

const corePkgDist = path.join(corePkgOutRoot, 'dist')

export const config = {
	id,
	corePkgOutRoot,
	jsonDir
} as const

/** Assembles the core package from built data, which contains types, schema, and documentation. */
export async function buildCorePackage({ id, jsonDir }: typeof config = config) {
	Log.info(`⚙️  Building ${id}...`)

	await fs.emptyDir(jsonDir)
	await fs.emptyDir(corePkgDist)
	await Promise.all([
		fs.copy(SCHEMA_PATH, path.join(jsonDir, 'datasworn.schema.json'), {
			overwrite: true
		}),
		fs.copy(
			SOURCE_SCHEMA_PATH,
			path.join(jsonDir, 'datasworn-source.schema.json'),
			{
				overwrite: true
			}
		),
		fs.copy(
			// TODO: script to build the legacy ID map?
			LEGACY_ID_PATH,
			path.join(jsonDir, path.basename(LEGACY_ID_PATH)),
			{
				overwrite: true
			}
		)
	])

	return Log.info(`✅ Finished building ${id}`)
}
