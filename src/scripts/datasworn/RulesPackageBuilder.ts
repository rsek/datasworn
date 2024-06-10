import path from 'path'
import type TypeNode from '../../pkg-core/TypeNode.js'
import {
	IdParser,
	type Datasworn,
	type DataswornSource
} from '../../pkg-core/index.js'
import Log from '../utils/Log.js'
import type AJV from '../validation/ajv.js'
import { dataSwornKeyOrder, sortDataswornKeys, sortObjectKeys } from './sort.js'
import { cwd } from 'process'
import { pascalCase } from '../../schema/utils/string.js'
import { formatPath } from '../../utils.js'

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

	readonly files = new Map<string, RulesPackageFile<TSource>>()
	readonly fileIds = new Map<string, Set<string>>()

	merged: TTarget = {} as TTarget

	mergeFiles() {
		const sortedEntries = Array.from(this.files)
			// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
			.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

		for (const [_, file] of sortedEntries)
			RulesPackageBuilder.merge(this.merged, file.data)

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
			// 	message: `🧩 Assembled "${this.id}" in ${Date.now() - bProfiler.start.valueOf()}ms`
			// })

			// const vProfiler = Log.startTimer()
			RulesPackageBuilder.validate(result)
			// vProfiler.done({
			// 	message: `✅ Validated "${this.id}" in ${Date.now() - vProfiler.start.valueOf()}ms`
			// })

			return result
		} catch (e) {
			throw new Error(`Couldn't build <${this.id}>. ${String(e)}`)
		}
	}

	sortKeys() {
		this.merged = sortDataswornKeys(this.merged)
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

	constructor(id: string, ...files: RulesPackageFile<TSource>[])
	constructor(id: string, ...files: RulesPackageFileData<TSource>[])
	constructor(
		id: string,
		...files: (RulesPackageFileData<TSource> | RulesPackageFile<TSource>)[]
	) {
		this.id = id
		this.addFiles(...files)
	}

	id: string

	#addFile(file: RulesPackageFileData<TSource> | RulesPackageFile<TSource>) {
		const fileToAdd =
			file instanceof RulesPackageFile ? file : new RulesPackageFile(file)
		this.files.set(fileToAdd.fileName, fileToAdd)
		return this
	}

	addFiles(
		...files: (RulesPackageFileData<TSource> | RulesPackageFile<TSource>)[]
	) {
		for (const file of files)
			try {
				void this.#addFile(file)
			} catch (e) {
				throw new Error(`Failed to add "${file.fileName}"! ${String(e)}`)
			}

		return this
	}

	static #isObject(value: unknown): value is object {
		return value != null && typeof value === 'object' && !Array.isArray(value)
	}

	static merge(target: unknown, ...sources: unknown[]): unknown {
		if (!sources.length) return target
		const source = sources.shift()

		if (this.#isObject(target) && this.#isObject(source)) {
			for (const k in source) {
				const key = k as keyof typeof source
				if (this.#isObject(source[key])) {
					if (!target[key]) Object.assign(target, { [key]: {} })
					this.merge(target[key], source[key])
				} else {
					Object.assign(target, { [key]: source[key] })
				}
			}
		}

		return this.merge(target, ...sources)
	}

	// TODO: move the ID duplication check here?

	createIndex() {
		const index = new Map()

		for (const [_, file] of this.files)
			for (const [k, v] of file.index) index.set(k, v)

		return index
	}
}

interface RulesPackageFileData<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage
> {
	fileName: string
	data: TSource
}

class RulesPackageFile<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage
> implements RulesPackageFileData<TSource>
{
	static get logger() {
		return RulesPackageBuilder.logger
	}

	static get ajv() {
		return RulesPackageBuilder.ajv
	}

	fileName: string

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

	constructor({ data, fileName }: RulesPackageFileData<TSource>) {
		this.fileName = fileName

		try {
			RulesPackageFile.validateSource(data)
		} catch (e) {
			throw new Error(
				`${path.relative(cwd(), fileName)} doesn't match DataswornSource\n${String(e)}`
			)
		}

		this.#data = data

		this.init()
	}

	init() {
		// ensure IdParser logs to the same place
		// @ts-expect-error
		IdParser.logger = RulesPackageFile.logger

		RulesPackageBuilder.logger.debug(`RulesPackageFile#init > ${this.fileName}`)

		void IdParser.assignIdsInRulesPackage(this.data, this.index)
	}
}

class ExpansionBuilder extends RulesPackageBuilder<DataswornSource.Expansion> {}

class RulesetBuilder extends RulesPackageBuilder<DataswornSource.Ruleset> {}
