import { stubFalse } from 'lodash-es'
import CONST from './IdElements/CONST.js'
import type TypeNode from './TypeNode.js'
import {
	dataSwornKeyOrder,
	sortDataswornKeys,
	sortObjectKeys
} from './Utils/Sort.js'
import { validateIdsInStrings } from './Validators/validateText.js'
import { IdParser, type Datasworn, type DataswornSource } from './index.js'

export type SchemaValidator<TTarget> = (data: unknown) => data is TTarget
export type Logger = Record<
	'warn' | 'info' | 'debug' | 'error',
	(message?: any, ...optionalParams: any[]) => any
>

/** Merges and validates JSON data from multiple DataswornSource files. */
export class RulesPackageBuilder<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage,
	TTarget extends Datasworn.RulesPackage = Datasworn.RulesPackage
> {
	id: string

	readonly schemaValidator: SchemaValidator<TTarget>
	readonly sourceSchemaValidator: SchemaValidator<TSource>
	readonly logger: Logger

	readonly files = new Map<string, RulesPackagePart<TSource>>()
	readonly index = new Map<string, unknown>()

	#mergedSource: TTarget = {} as TTarget

	#isSorted = false
	#isMergeComplete = false
	#isValidated = false

	get mergedSource() {
		return this.#mergedSource
	}

	#countTypes() {
		const types = {} as Record<string, number>

		for (const [id, _] of this.index) {
			const [fullTypeId, ..._path] = id.split(CONST.PrefixSep)
			types[fullTypeId] ||= 0
			types[fullTypeId]++
		}
		// display using console.table or similar?

		return types
	}

	mergeFiles(force = false) {
		if (!force && this.#isMergeComplete) return this

		const sortedEntries = Array.from(this.files)
			// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
			.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

		for (const [_, part] of sortedEntries)
			this.#merge(this.#mergedSource, part.data)

		this.#isMergeComplete = true
		this.#isValidated = false
		this.#isSorted = false

		return this
	}

	toJSON() {
		return this.mergedSource
	}

	#build(force = false) {
		this.mergeFiles(force)
		this.#sortKeys(force)
		this.#isValidated = false
		return this.mergedSource
	}

	validate(force = false) {
		if (!force && this.#isValidated) return this

		this.schemaValidator(this.mergedSource)
		this.#isValidated = true

		return this
	}

	validateIdPointers(index: Map<string, unknown> | Set<string>) {
		return validateIdsInStrings(this.mergedSource, index)
	}

	build(force = false) {
		try {
			this.#build(force)

			this.validate(force)

			return this
		} catch (e) {
			throw new Error(`Couldn't build <${this.id}>. ${String(e)}`)
		}
	}

	#sortKeys(force = false) {
		if (this.#isSorted && !force) return this

		this.#mergedSource = sortDataswornKeys(this.#mergedSource)
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

	constructor(
		id: string,
		validator: SchemaValidator<TTarget>,
		sourceValidator: SchemaValidator<TSource>,
		logger: Logger
	) {
		this.id = id
		this.schemaValidator = validator
		this.sourceSchemaValidator = sourceValidator
		this.logger = logger
	}

	#addFile(file: RulesPackagePartData<TSource> | RulesPackagePart<TSource>) {
		const fileToAdd =
			file instanceof RulesPackagePart
				? file
				: new RulesPackagePart(file, this.sourceSchemaValidator, this.logger)
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

	// TODO -- put merge behavior on RulesPackagePart instead
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
	readonly logger: Logger
	readonly validator: SchemaValidator<TSource>

	name: string

	index = new Map<string, TypeNode.AnyPrimary>()

	#data: TSource

	public get data(): TSource {
		return this.#data
	}

	public set data(value) {
		this.#data = value
		this.#isValidated = false
	}

	#isValidated = false

	get isValidated() {
		return this.#isValidated
	}

	validate() {
		const result = this.validator(this.data)
		this.#isValidated = true
		return result
	}

	constructor(
		{ data, name }: RulesPackagePartData<TSource>,
		validator: SchemaValidator<TSource>,
		logger: Logger
	) {
		this.name = name
		this.logger = logger
		this.validator = validator
		this.#data = data

		this.init()
	}

	init() {
		try {
			this.validate()
		} catch (e) {
			throw new Error(
				`${this.name} doesn't match DataswornSource\n${String(e)}`
			)
		}

		void IdParser.assignIdsInRulesPackage(this.data, this.index)
	}
}
