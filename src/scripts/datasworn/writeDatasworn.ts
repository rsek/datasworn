import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import path from 'path'
import { cwd } from 'process'
import type { Datasworn, DataswornSource } from '../../pkg-core/index.js'
import { type RulesPackageConfig } from '../../schema/tools/build/index.js'
import { formatPath } from '../../utils.js'
import { ROOT_OUTPUT } from '../const.js'
import { loadSchema, loadSourceSchema } from '../schema/loadSchema.js'
import Log from '../utils/Log.js'
import { readSourceData, writeJSON } from '../utils/readWrite.js'
import AJV from '../validation/ajv.js'
import {
	RulesPackageBuilder,
	type SchemaValidator
} from '../../pkg-core/Builders/RulesPackageBuilder.js'
import * as PkgConfig from '../pkg/pkgConfig.js'

const schemaValidator = <SchemaValidator<Datasworn.RulesPackage>>(
	_validate.bind(undefined, 'Datasworn')
)

const sourceSchemaValidator = <SchemaValidator<DataswornSource.RulesPackage>>(
	_validate.bind(undefined, 'DataswornSource')
)

await buildRulesPackages(PkgConfig)

export async function buildRulesPackages(pkgs: Record<string, RulesPackageConfig>) {
	const profiler = Log.startTimer()

	Log.info('📖 Reading schema...')

	// prepare schemata for AJV validation
	AJV.removeSchema()

	await loadSourceSchema()
	await loadSchema()

	Log.info('⚙️  Building rules packages...')

	const toBuild: Promise<RulesPackageBuilder>[] = []

	// indexes all package contents by their ID, so we can validate package links after they're built
	const index = new Map<string, unknown>()

	// collects paths for files that need cleanup
	const filesToDelete: string[] = []

	for (const k in pkgs) {
		const pkg = pkgs[k]
		const { type, id } = pkg

		Log.info(`⚙️  Building ${type}: ${id}`)

		toBuild.push(assemblePkgFiles(pkg, filesToDelete, index))
	}
	const builtPkgs = await Promise.all(toBuild)

	const errors = []

	const toWrite: Promise<any>[] = []

	// now that we have all IDs available, we can validate the built packages
	for (const pkg of builtPkgs)
		try {
			pkg.validateIdPointers(index)
			const destDir = path.join(ROOT_OUTPUT, pkg.id)
			toWrite.push(_writePkgFiles(destDir, pkg.toJSON(), filesToDelete))
		} catch (e) {
			errors.push(e)
		}

	if (errors.length > 0) for (const e of errors) Log.error(e)

	await Promise.all(toWrite)

	profiler.done({
		message: `Finished building ${toBuild.length} rules package(s) in ${Date.now() - profiler.start.valueOf()}ms`
	})
}

/** Loads files for a given Datasworn package configuration and assembles them with RulesPackageBuilder. */
async function assemblePkgFiles(
	{ id, paths }: RulesPackageConfig,
	filesToDelete: string[],
	index: Map<string, unknown>
) {
	const destDir = path.join(ROOT_OUTPUT, id)

	const [sourceFiles, oldJsonFiles, oldErrorFiles] = await Promise.all([
		getSourceFiles(paths.source),
		getOldJsonFiles(destDir),
		getOldErrorFiles(paths.source)
	])

	filesToDelete.push(...oldJsonFiles)

	// flush old error files; hold off on flushing old built files for now, as the build can fail

	// const errorCleanup = oldErrorFiles.map(async (filePath) =>
	// 	fs.unlink(filePath)
	// )

	Log.info(
		`🔍 Found ${
			sourceFiles.length
		} source files for "${id}" in ${formatPath(paths.source)}`
	)

	const builder = new RulesPackageBuilder(
		id,
		schemaValidator,
		sourceSchemaValidator,
		Log
	)

	// begin loading and adding files
	await Promise.all(
		sourceFiles.map(async (filePath) => {
			Log.debug(`📖 Reading ${formatPath(filePath)}`)
			try {

        let data = await readSourceData(filePath)

				// yaml parsing creates anchors as references to the same object, but we need to edit them as unique instances.
				if (filePath.endsWith('.yaml') || filePath.endsWith('.yml'))
					// lazy way to deep clone dereferenced values
					data = JSON.parse(JSON.stringify(data))

				builder.addFiles({
					name: path.relative(cwd(), filePath),
					data
				})
			} catch (error) {
				Log.error(error)
			}
		})
	)

	builder.build()
	for (const entry of builder.index) index.set(...entry)

	return builder
}

async function _writePkgFiles(
	destDir: string,
	data: Datasworn.RulesPackage,
	filesToDelete: string[]
) {
	const outPath = path.join(destDir, `${data._id}.json`)

	// const toDelete = filesToDelete.filter((path) => path !== outPath)

	// if (toDelete.length > 0)
	// 	await Promise.all(toDelete.map(async (f) => fs.unlink(f)))

	await fs.ensureFile(outPath)

	Log.info(`✏️  Writing to ${formatPath(outPath)}`)

	try {
		await writeJSON(outPath, data)
	} catch (e) {
		Log.error(`Failed to write ${formatPath(outPath)}:`, e)
	}
}

async function getSourceFiles(path: string) {
	const glob = `${path}/**/*.(yaml|yml|json)`
	const files = await fastGlob(glob)
	if (files?.length === 0)
		throw new Error(`Could not find any source files with the glob "${glob}"`)

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

function _validate<T>(schemaId: string, data: unknown): data is T {
	const isValid = AJV.validate(schemaId, data)

	if (!isValid) {
		const shortErrors = AJV.errors?.map(
			({ instancePath, parentSchema, message }) => ({
				parentSchema: parentSchema?.$id ?? parentSchema?.title,
				instancePath,
				message
			})
		)
		throw Error(
			`Failed schema validation. ${JSON.stringify(shortErrors, undefined, '\t')}`
		)
	}

	return true
}
