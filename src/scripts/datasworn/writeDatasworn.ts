import * as pkgs from '../pkg/pkgConfig.js'
import Log from '../utils/Log.js'
import AJV from '../validation/ajv.js'
import { buildRulesPackage } from './buildRulesPackage.js'
import { loadSchema, loadSourceSchema } from '../schema/loadSchema.js'
import type { Datasworn, DataswornSource } from '../../pkg-core/index.js'
import type { Validator } from '../../pkg-core/RulesPackageBuilder.js'

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

const schemaValidator = <Validator<Datasworn.RulesPackage>>(
	_validate.bind(undefined, 'Datasworn')
)

const sourceSchemaValidator = <Validator<DataswornSource.RulesPackage>>(
	_validate.bind(undefined, 'DataswornSource')
)

const profiler = Log.startTimer()

Log.info('📖 Reading schema...')

// flush any old schemata
AJV.removeSchema()

await loadSourceSchema()
await loadSchema()

Log.info('⚙️  Building rules packages...')

const toBuild: Promise<void>[] = []

for (const k in pkgs)
	toBuild.push(
		buildRulesPackage(
			pkgs[k as keyof typeof pkgs],
			schemaValidator,
			sourceSchemaValidator,
			Log
		)
	)

await Promise.all(toBuild)

profiler.done({
	message: `Finished building ${toBuild.length} rules package(s) in ${Date.now() - profiler.start.valueOf()}ms`
})
