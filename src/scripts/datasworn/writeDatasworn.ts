import * as pkgs from '../pkg/pkgConfig.js'
import Log from '../utils/Log.js'
import AJV from '../validation/ajv.js'
import { buildRulesPackage } from './buildRulesPackage.js'
import { loadSchema, loadSourceSchema } from '../schema/loadSchema.js'

const profiler = Log.startTimer()

Log.info('📖 Reading schema...')

// flush any old schemata
AJV.removeSchema()

await loadSourceSchema()
const { JSL } = await loadSchema()

Log.info('⚙️  Building sourcebooks...')

await Promise.all(
	Object.values(pkgs).map(async (pkg) =>
		buildRulesPackage(pkg, AJV, JSL).catch((e) =>
			Log.error(`Failed to build package "${pkg.id}":`, e)
		)
	)
)

profiler.done({
	message: `Finished in ${Date.now() - profiler.start.valueOf()}ms`
})
