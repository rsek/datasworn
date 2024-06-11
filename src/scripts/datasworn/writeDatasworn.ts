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
await loadSchema()

Log.info('⚙️  Building rules packages...')

const toBuild: Promise<void>[] = []

for (const k in pkgs)
	toBuild.push(buildRulesPackage(pkgs[k as keyof typeof pkgs], AJV))

await Promise.all(toBuild)

profiler.done({
	message: `Finished building ${toBuild.length} rules package(s) in ${Date.now() - profiler.start.valueOf()}ms`
})
