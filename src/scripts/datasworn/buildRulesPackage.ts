import { TypeGuard } from '@sinclair/typebox'
import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import { type Draft07 } from 'json-schema-library'
import { forEach } from 'lodash-es'
import path from 'path'
import { RulesExpansion } from '../../schema/Rules.js'
import { type DataPackageConfig } from '../../schema/tools/build/index.js'
import { formatPath } from '../../utils.js'
import { ROOT_OUTPUT } from '../const.js'
import Log from '../utils/Log.js'
import type AJV from '../validation/ajv.js'
import { RulesPackageBuilder } from './RulesPackageBuilder.js'
import { readSourceData, writeJSON } from '../utils/readWrite.js'

const metadataKeys: string[] = []

forEach(RulesExpansion.properties, (v, k) => {
	if (!TypeGuard.IsRecord(v)) metadataKeys.push(k)
})

/** Builds all YAML files for a given package configuration */
export async function buildRulesPackage(
	{ id, paths, type, pkg }: DataPackageConfig,
	ajv: typeof AJV,
	jsl: Draft07
) {
	Log.info(`⚙️  Building rules package: ${id}`)

	const destDir = path.join(ROOT_OUTPUT, id)

	const sourceFilesGlob = `${paths.source}/**/*.yaml`
	const oldErrorFilesGlob = `${paths.source}/**/*.error.json`

	const oldJsonFilesGlob = `${destDir}/*.json`

	const [sourceFiles, oldJsonFiles, oldErrorFiles] = await Promise.all([
		fastGlob(sourceFilesGlob),
		fastGlob(oldJsonFilesGlob),
		fastGlob(oldErrorFilesGlob)
	])

	Log.info(
		`🔍 Found ${
			sourceFiles?.length ?? 0
		} YAML files for "${id}" in ${formatPath(paths.source)}`
	)

	if (sourceFiles?.length === 0)
		throw new Error(
			`Could not find any YAML files with the glob ${sourceFilesGlob}`
		)

	// flush old files from outdir
	const cleanup = Promise.all(
		[...oldJsonFiles, ...oldErrorFiles].map(async (filePath) => {
			await fs.unlink(filePath)
		})
	)

	RulesPackageBuilder.setup(Log, ajv)

	const builder = new RulesPackageBuilder(id)

	await Promise.all(
		sourceFiles.map(async (fileName) => {
			Log.info(`📖 Reading ${formatPath(fileName)}`)
			try {
				const data = await readSourceData(fileName)
				builder.addFiles({
					fileName,
					data
				})
			} catch (error) {
				Log.error(error)
			}
		})
	)

	const data = builder.build()

	const outPath = path.join(destDir, `${data._id}.json`)

	if (oldJsonFiles?.length > 0) {
		Log.info(
			`🧹 Deleting ${oldJsonFiles?.length} old JSON files in ${formatPath(
				destDir
			)}`
		)
		await cleanup
	}

	await fs.ensureFile(outPath)

	Log.info(`✏️  Writing to ${formatPath(outPath)}`)

	try {
		await writeJSON(outPath, data)
	} catch (e) {
		Log.error(`Failed to write ${formatPath(outPath)}:`, e)
	}
}
