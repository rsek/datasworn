import path from 'path'
import fs from 'fs-extra'
import Log from '../../utils/Log.js'
import { type RulesPackageConfig } from '../../../schema/tools/build/index.js'
import {
	PKG_DIR_NODE,
	PKG_SCOPE_OFFICIAL,
	ROOT_OUTPUT,
	VERSION
} from '../../const.js'
import { updateJSON } from './updateJSON.js'

/** Assemble a NodeJS package from a {@link RulesPackageConfig} using data in {@link ROOT_OUTPUT} */
export async function buildContentPackage({
	id,
	pkg,
	paths
}: RulesPackageConfig) {
	const { name, scope, ...packageUpdate } = pkg

	/** async operations on package JSON files */
	const jsonOps: Promise<void>[] = []

	/** scoped package name for NPM */
	const pkgID = path.join(scope, name)

	/** Desination path for built package */
	const pkgRoot = path.join(PKG_DIR_NODE, pkgID)

	/** Path to the NPM package's package.json */
	const nodePackageJsonPath = path.join(pkgRoot, 'package.json')

	jsonOps.push(
		// update package.json from data in the RulesPackageConfig
		updateJSON<Record<string, unknown>>(
			nodePackageJsonPath,
			(packageDotJson) => {
				Object.assign(packageDotJson, packageUpdate)
				packageDotJson.version = VERSION

				const dependencies = packageDotJson?.dependencies as
					| Record<string, string>
					| undefined

				if (dependencies != null)
					for (const depId in dependencies)
						if (depId.startsWith(PKG_SCOPE_OFFICIAL))
							dependencies[depId] = VERSION

				return packageDotJson
			}
		)
	)

	/** Destination path for the JSON content */
	const pkgJsonDest = path.join(pkgRoot, 'json')
	/** Path to the prebuilt JSON content */
	const jsonSrc = path.join(ROOT_OUTPUT, id)

	jsonOps.push(
		// empty JSON destination directory
		fs.emptyDir(pkgJsonDest).then(() =>
			// copy prebuilt JSON to destination
			fs.copy(jsonSrc, pkgJsonDest)
		)
	)

	/** async operations on package image assets */
	const assetOps: Promise<void>[] = []

	for (const assetSrc of paths.assets ?? []) {
		const assetDest = path.join(pkgRoot, assetSrc.split('/').pop() as string)

		assetOps.push(
			fs.exists(assetSrc).then((exists) => {
				if (!exists) throw Error(`Missing asset dir: ${assetSrc}`)
				fs.emptyDir(assetDest).then(() => fs.copy(assetSrc, assetDest))
			})
		)
	}

	await Promise.all([...jsonOps, ...assetOps])

	return Log.info(`✅ Finished building ${pkgID}`)
}
