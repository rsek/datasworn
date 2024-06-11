import CONST from '../../pkg-core/IdElements/CONST.js'
import type TypeNode from '../../pkg-core/TypeNode.js'
import {
	IdParser,
	type Datasworn,
	type DataswornSource
} from '../../pkg-core/index.js'
import type Log from '../utils/Log.js'
import type AJV from '../validation/ajv.js'
import { dataSwornKeyOrder, sortDataswornKeys, sortObjectKeys } from './sort.js'

/** Merges and validates JSON data from multiple DataswornSource files. */
export class RulesPackageBuilder<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage,
	TTarget extends Datasworn.RulesPackage = Datasworn.RulesPackage
> {
	static setup(logger: typeof console | typeof Log, ajv: typeof AJV) {
		this.logger = logger
		this.ajv = ajv
	}

	static logger: typeof console | typeof Log
	static ajv: typeof AJV

	// reference to function that validates objects against schema.
	static validator_source: <T extends DataswornSource.RulesPackage>(
		sourceData: unknown
	) => sourceData is T

	static validator: <T extends Datasworn.RulesPackage>(
		data: unknown
	) => data is T

	readonly files = new Map<string, RulesPackagePart<TSource>>()
	readonly fileIds = new Map<string, Set<string>>()
	readonly index = new Map<string, TypeNode.Any>()

	#merged: TTarget = {} as TTarget

	#isSorted = false
	#isMergeComplete = false

	get merged() {
		return this.#merged
	}

	#countTypes() {
		const types = {} as Record<string, number>

		for (const [id, _] of this.index) {
			const [fullTypeId, ..._path] = id.split(CONST.PrefixSep)
			types[fullTypeId] ||= 0
			types[fullTypeId]++
		}

		return types
	}

	mergeFiles() {
		const sortedEntries = Array.from(this.files)
			// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
			.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

		for (const [_, part] of sortedEntries) {
			this.#merge(this.#merged, part.data)
			// for (const [k, v] of part.index) this.index.set(k, v)
		}

		this.#isMergeComplete = true

		return this
	}

	#build() {
		return this.mergeFiles().sortKeys().merged
	}

	static validate(data: unknown): data is Datasworn.RulesPackage {
		const isValid = this.ajv.validate('Datasworn', data)

		if (!isValid) {
			const shortErrors = this.ajv.errors?.map(
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

	build() {
		try {
			// const bProfiler = Log.startTimer()
			const result = this.#build()
			// bProfiler.done({
			// 	message: `🧩 Assembled "${this.id}" in ${Date.now() - bProfiler.start.valueOf()}ms`,
			// })

			// const vProfiler = Log.startTimer()
			RulesPackageBuilder.validate(result)
			// vProfiler.done({
			// 	message: `✅ Validated "${this.id}" in ${Date.now() - vProfiler.start.valueOf()}ms`
			// })

			// RulesPackageBuilder.logger.info(
			// 	JSON.stringify(this.#countTypes(), undefined, '\t')
			// )

			return result
		} catch (e) {
			throw new Error(`Couldn't build <${this.id}>. ${String(e)}`)
		}
	}

	sortKeys(force = false) {
		if (!this.#isSorted || force) this.#merged = sortDataswornKeys(this.#merged)
		this.#isSorted = true
		return this
	}

	static sortDataswornKeys<T extends object>(
		object: T,
		sortOrder = dataSwornKeyOrder
	) {
		return sortObjectKeys(object, sortOrder)
	}

	// could unwrap all values to json pointers, then set them in order? hm.

	/** Top-level RulesPackage properties to omit from key sorting. */
	static readonly topLevelKeysBlackList = [
		'rules'
	] as const satisfies (keyof Datasworn.RulesPackage)[]

	/** Separator character used for JSON pointers. */
	static readonly pointerSep = '/' as const

	/** Hash character that prepends generated JSON pointers. */
	static readonly hashChar = '#' as const

	constructor(id: string, ...files: RulesPackagePart<TSource>[])
	constructor(id: string, ...files: RulesPackagePartData<TSource>[])
	constructor(
		id: string,
		...files: (RulesPackagePartData<TSource> | RulesPackagePart<TSource>)[]
	) {
		this.id = id
		this.addFiles(...files)
	}

	id: string

	#addFile(file: RulesPackagePartData<TSource> | RulesPackagePart<TSource>) {
		const fileToAdd =
			file instanceof RulesPackagePart ? file : new RulesPackagePart(file)
		this.files.set(fileToAdd.name, fileToAdd)
		return this
	}

	addFiles(
		...files: (RulesPackagePartData<TSource> | RulesPackagePart<TSource>)[]
	) {
		for (const file of files)
			try {
				void this.#addFile(file)
			} catch (e) {
				throw new Error(`Failed to add "${file.name}"! ${String(e)}`)
			}

		return this
	}

	static #isObject(value: unknown): value is object {
		return value != null && typeof value === 'object' && !Array.isArray(value)
	}

	#merge(target: unknown, ...sources: unknown[]): unknown {
		if (!sources.length) {
			// nothing left to add, so index it
			if (RulesPackageBuilder.#isObject(target) && '_id' in target)
				this.index.set(target._id as string, target)
			return target
		}
		const source = sources.shift()

		if (
			RulesPackageBuilder.#isObject(target) &&
			RulesPackageBuilder.#isObject(source)
		) {
			for (const k in source) {
				const key = k as keyof typeof source
				if (RulesPackageBuilder.#isObject(source[key])) {
					if (typeof target[key] === 'undefined')
						Object.assign(target, { [key]: {} })
					this.#merge(target[key], source[key])
				} else {
					Object.assign(target, { [key]: source[key] })
				}
			}
		}

		return this.#merge(target, ...sources)
	}

	// TODO: reimplement ID duplication check
}

interface RulesPackagePartData<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage
> {
	name: string
	data: TSource
}

class RulesPackagePart<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage
> implements RulesPackagePartData<TSource>
{
	static get logger() {
		return RulesPackageBuilder.logger
	}

	static get ajv() {
		return RulesPackageBuilder.ajv
	}

	name: string

	index = new Map<string, TypeNode.AnyPrimary>()

	#data: TSource

	public get data(): TSource {
		return this.#data
	}

	public set data(value) {
		this.#data = value
	}

	static validateSource(data: unknown): data is DataswornSource.RulesPackage {
		const isValid = this.ajv.validate('DataswornSource', data)

		if (!isValid) {
			const shortErrors = this.ajv.errors?.map(
				({ instancePath, parentSchema, message }) => ({
					parentSchema: parentSchema?.$id ?? parentSchema?.title,
					instancePath,
					message
				})
			)
			throw Error(JSON.stringify(shortErrors, undefined, '\t'))
		}

		return true
	}

	constructor({ data, name }: RulesPackagePartData<TSource>) {
		this.name = name

		try {
			RulesPackagePart.validateSource(data)
		} catch (e) {
			throw new Error(`${name} doesn't match DataswornSource\n${String(e)}`)
		}

		this.#data = data

		this.init()
	}

	init() {
		// ensure IdParser logs to the same place
		// @ts-expect-error
		IdParser.logger = RulesPackagePart.logger

		void IdParser.assignIdsInRulesPackage(this.data, this.index)
	}
}

class ExpansionBuilder extends RulesPackageBuilder<DataswornSource.Expansion> {}

class RulesetBuilder extends RulesPackageBuilder<DataswornSource.Ruleset> {}
