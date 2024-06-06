import { TypeGuard } from '@sinclair/typebox'
import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import { type Draft07 } from 'json-schema-library'
import { forEach } from 'lodash-es'
import path from 'path'
import { RulesExpansion } from '../../schema/Rules.js'
import { type DataPackageConfig } from '../../schema/tools/build/index.js'
import { pascalCase } from '../../schema/utils/string.js'
import { formatPath } from '../../utils.js'
import { ROOT_OUTPUT } from '../const.js'
import Log from '../utils/Log.js'
import type AJV from '../validation/ajv.js'
import { RulesPackageBuilder } from './RulesPackageBuilder.js'
import { readRulesPackageFile } from './readRulesPackageFile.js'
import { writeRuleset } from './writeRulesPackage.js'

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
	Log.info(`⚙️  Building ruleset: ${id}`)

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

	const builder = new RulesPackageBuilder()

	await Promise.all(
		sourceFiles.map(async (fileName) => {
			try {
				builder.addFiles({
					fileName,
					data: await readRulesPackageFile(fileName, ajv)
				})
			} catch (error) {
				Log.error(`Failed to build from ${formatPath(fileName)}:`, error)
			}
		})
	)

	const jsonContent = builder.mergeFiles().sortKeys().merged

	const toWrite: Array<Promise<any>> = [
		writeRuleset(path.join(destDir, `${jsonContent._id}.json`), jsonContent)
	]

	if (oldJsonFiles?.length > 0)
		Log.info(
			`🧹 Deleting ${oldJsonFiles?.length} old JSON files in ${formatPath(
				destDir
			)}`
		)

	await cleanup

	await Promise.all(toWrite)

	Log.info(
		`✅ Finished writing ${pascalCase(type)} "${id}" to ${formatPath(destDir)}`
	)
}
