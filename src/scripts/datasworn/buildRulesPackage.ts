import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import path from 'path'
import { type DataPackageConfig } from '../../schema/tools/build/index.js'
import { formatPath } from '../../utils.js'
import { ROOT_OUTPUT } from '../const.js'
import {
	RulesPackageBuilder,
	type Logger,
	type Validator
} from '../../pkg-core/RulesPackageBuilder.js'
import { readSourceData, writeJSON } from '../utils/readWrite.js'
import { cwd } from 'process'
import type { Datasworn, DataswornSource } from '../../pkg-core/index.js'

/** Builds all YAML files for a given package configuration */
export async function buildRulesPackage(
	{ id, paths, type, pkg }: DataPackageConfig,
	schemaValidator: Validator<Datasworn.RulesPackage>,
	sourceSchemaValidator: Validator<DataswornSource.RulesPackage>,
	logger: Logger
) {
	logger.info(`⚙️  Building ${type}: ${id}`)

	const destDir = path.join(ROOT_OUTPUT, id)

	const [sourceFiles, oldJsonFiles, oldErrorFiles] = await Promise.all([
		getSourceFiles(paths.source),
		getOldJsonFiles(destDir),
		getOldErrorFiles(paths.source)
	])

	// flush old error files; hold off on flushing old built files for now, as the build can fail

	const errorCleanup = oldErrorFiles.map(async (filePath) => {
		await fs.unlink(filePath)
	})

	logger.info(
		`🔍 Found ${
			sourceFiles.length
		} source files for "${id}" in ${formatPath(paths.source)}`
	)

	const builder = new RulesPackageBuilder(
		id,
		schemaValidator,
		sourceSchemaValidator,
		logger
	)

	// begin loading and adding files
	await Promise.all(
		sourceFiles.map(async (filePath) => {
			logger.debug(`📖 Reading ${formatPath(filePath)}`)
			try {
				const data = await readSourceData(filePath)
				builder.addFiles({
					name: path.relative(cwd(), filePath),
					data
				})
			} catch (error) {
				logger.error(error)
			}
		})
	)

	const data = builder.build()

	// now that it's been succesfully built + validated, clean up old files.

	if (oldJsonFiles.length > 0) {
		logger.info(
			`🧹 Deleting ${oldJsonFiles?.length} old JSON file(s) in ${formatPath(
				destDir
			)}`
		)
		await Promise.all(
			oldJsonFiles.map(async (filePath) => {
				await fs.unlink(filePath)
			})
		)
	}

	await Promise.all(errorCleanup)

	const outPath = path.join(destDir, `${data._id}.json`)

	await fs.ensureFile(outPath)

	logger.info(`✏️  Writing to ${formatPath(outPath)}`)

	try {
		await writeJSON(outPath, data)
	} catch (e) {
		logger.error(`Failed to write ${formatPath(outPath)}:`, e)
	}
}

async function getSourceFiles(path: string) {
	const glob = `${path}/**/*.(yaml|yml|json)`
	const files = await fastGlob(glob)
	if (files?.length === 0)
		throw new Error(`Could not find any source files with the glob ${glob}`)

	return files
}

async function getOldJsonFiles(path: string) {
	const glob = `${path}/*.json`
	return fastGlob(glob)
}

async function getOldErrorFiles(path: string) {
	const glob = `${path}/**/*.error.json`
	return fastGlob(glob)
}
