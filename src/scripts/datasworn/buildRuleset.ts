import { TypeGuard } from '@sinclair/typebox'
import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import { type Draft07 } from 'json-schema-library'
import { forEach } from 'lodash-es'
import path from 'path'
import { IdParser } from '../../pkg-core/IdParser.js'
import { RulesExpansion } from '../../schema/Rules.js'
import { type DataPackageConfig } from '../../schema/tools/build/index.js'
import { pascalCase } from '../../schema/utils/string.js'
import type * as Datasworn from '../../types/Datasworn.js'
import { formatPath } from '../../utils.js'
import { ROOT_OUTPUT } from '../const.js'
import Log from '../utils/Log.js'
import type AJV from '../validation/ajv.js'
import { cleanRuleset } from './cleanRuleset.js'
import { mergeRulesetData } from './mergeRulesetParts.js'
import { loadRulesetFile } from './readRulesetFile.js'
import { writeRuleset } from './writeRuleset.js'

const metadataKeys: string[] = []

forEach(RulesExpansion.properties, (v, k) => {
	if (!TypeGuard.IsRecord(v)) metadataKeys.push(k)
})

/** Builds all YAML files for a given package configuration */
export async function buildRuleset(
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

	const builtFiles = new Map<
		string,
		Extract<Datasworn.RulesPackage, { type: typeof type }>
	>()

	await Promise.all(
		sourceFiles.map(async (filePath) => {
			try {
				const sourceData = await loadRulesetFile(filePath, ajv)

				const builtData = IdParser.assignIdsInRulesPackage(sourceData)

				builtFiles.set(filePath, builtData)
			} catch (error) {
				Log.error(`Failed to build from ${formatPath(filePath)}:`, error)
			}
		})
	)

	const ruleset = cleanRuleset(mergeRulesetData(builtFiles), jsl)

	const toWrite: Array<Promise<any>> = [
		writeRuleset(path.join(destDir, `${ruleset._id}.json`), ruleset)
	]

	if (oldJsonFiles?.length > 0)
		Log.info(
			`🧹 Deleting ${oldJsonFiles?.length} old JSON files from ${formatPath(
				destDir
			)}`
		)

	await cleanup

	await Promise.all(toWrite)

	Log.info(
		`✅ Finished writing ${pascalCase(type)} "${id}" to ${formatPath(destDir)}`
	)
}
