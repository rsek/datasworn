import { IdKey, PrefixSep } from '../IdElements/CONST.js'
import type TypeId from '../IdElements/TypeId.js'
import type TypeNode from '../TypeNode.js'
import { forEachIdRef } from '../Validators/Text.js'
import Validators from '../Validators/index.js'
import { IdParser, type Datasworn, type DataswornSource } from '../index.js'

export type SchemaValidator<TTarget> = (data: unknown) => data is TTarget
export type Logger = Record<
	'warn' | 'info' | 'debug' | 'error',
	(message?: unknown, ...optionalParams: unknown[]) => unknown
>
export type IdRefTracker = {
	valid: Set<string>
	unreachable: Set<string>
	invalid: Set<string>
}

/**
 * Merges, assigns IDs to, and validates multiple {@link DataswornSource.RulesPackage}s to create a complete {@link Datasworn.RulesPackage} object.
 *
 * Before creating an instance use {@link RulesPackageBuilder.init} to provide validation functions.
 * */
export class RulesPackageBuilder<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage,
	TTarget extends Datasworn.RulesPackage = Datasworn.RulesPackage,
> {
	id: string

	static readonly postSchemaValidators = Validators

	static get schemaValidator(): SchemaValidator<Datasworn.RulesPackage> {
		return this.#schemaValidator
	}
	static get sourceSchemaValidator(): SchemaValidator<DataswornSource.RulesPackage> {
		return this.#sourceSchemaValidator
	}

	get packageType(): Datasworn.RulesPackage['type'] | undefined {
		if (this.files.size)
			for (const [_filePath, file] of this.files) return file.packageType
		return undefined
	}

	static #schemaValidator: SchemaValidator<Datasworn.RulesPackage>
	static #sourceSchemaValidator: SchemaValidator<DataswornSource.RulesPackage>

	static init({
		validator,
		sourceValidator,
	}: {
		validator: SchemaValidator<Datasworn.RulesPackage>
		sourceValidator: SchemaValidator<DataswornSource.RulesPackage>
	}) {
		this.#schemaValidator = validator
		this.#sourceSchemaValidator = sourceValidator
		return this
	}

	static get isInitialized() {
		return (
			typeof this.schemaValidator === 'function' &&
			typeof this.sourceSchemaValidator === 'function'
		)
	}

	readonly logger: Logger

	readonly files = new Map<string, RulesPackagePart<TSource>>()
	readonly index = new Map<string, unknown>()

	#result: TTarget = {} as TTarget

	#isMergeComplete = false
	#isValidated = false

	#countTypes() {
		const ct = {} as Record<string, number>

		for (const [k, _] of this.index) {
			const [prefix] = k.split(':')
			ct[prefix] ||= 0
			ct[prefix]++
		}

		return ct
	}

	countType(typeId: TypeId.Any) {
		let ct = 0

		for (const [k] of this.index) if (k.includes(typeId + PrefixSep)) ct++

		return ct
	}

	counter = {} as Record<string, number>

	mergeFiles(force = false) {
		if (!force && this.#isMergeComplete) return this

		const sortedEntries = Array.from(this.files)
			// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
			.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

		for (const [_, part] of sortedEntries) this.#merge(this.#result, part.data)

		this.#isMergeComplete = true
		this.#isValidated = false

		return this
	}

	toJSON() {
		return this.#result
	}

	#build(force = false) {
		this.mergeFiles(force)
		this.#isValidated = false



		return this.#result
	}

	static validateIdRef(
		id: string,
		idTracker: IdRefTracker,
		tree = IdParser.tree
	) {
		if (idTracker.valid.has(id)) return true
		if (idTracker.unreachable.has(id) || idTracker.invalid.has(id)) return false

		let parsedId: IdParser

		try {
			parsedId = IdParser.parse(id as any)
		} catch (e) {
			idTracker.invalid.add(id)
			return false
		}

		const idHasMatches = parsedId.getMatches(tree, () => true).size > 0

		if (idHasMatches) {
			idTracker.valid.add(id)
			return true
		}
		idTracker.unreachable.add(id)
		return false
	}

	validateIdRefs(idTracker: IdRefTracker, tree = IdParser.tree) {
		forEachIdRef(this.toJSON(), (id) => {
			RulesPackageBuilder.validateIdRef(id, idTracker, tree)
		})
		return idTracker
	}

	idRefs = new Set<string>()

	/** Performs JSON schema validation on the built data. */
	validate(force = false) {
		if (!force && this.#isValidated) return this

		RulesPackageBuilder.schemaValidator(this.#result)

		for (const [id, typeNode] of this.index) {
			if (typeNode == null) continue
			if (!RulesPackageBuilder.#isObject(typeNode)) continue
			if (!('type' in typeNode)) continue
			if (typeNode.type == null || typeof typeNode.type !== 'string') continue
			const typeValidation =
				(RulesPackageBuilder.postSchemaValidators as Record<string, Function>)[typeNode.type]
			if (typeof typeValidation !== 'function') continue
			try {
				typeValidation(typeNode)
			} catch (e) {
				throw new Error(
					`<${id}> ${String(e)}\n\n${JSON.stringify(typeNode, undefined, '\t')}`
				)
			}
		}

		this.#isValidated = true

		return this
	}

	build(force = false) {
		try {
			// refuse to build if one of the files isn't valid
			if (this.errors.size > 0) {
				const msg = Array.from(this.errors)
					.map(
						([file, error]) =>
							`"${file}" failed DataswornSource schema validation: ${error}`
					)
					.join('\n')
				throw new Error(msg)
			}

			this.#build(force)

			this.validate(force)

			// console.table(this.#countTypes())

			return this
		} catch (e) {
			throw new Error(`Couldn't build "${this.id}". ${String(e)}`)
		}
	}

	/** Top-level RulesPackage properties to omit from key sorting. */
	static readonly topLevelKeysBlackList = [
		'rules',
	] as const satisfies (keyof Datasworn.RulesPackage)[]

	/** Separator character used for JSON pointers. */
	static readonly pointerSep = '/' as const

	/** Hash character that prepends generated JSON pointers. */
	static readonly hashChar = '#' as const

	/**
	 *
	 * @param id The `_id` of the RulesPackage to be constructed.
	 * @param validator A function that validates the completed RulesPackage against the Datasworn JSON schema.
	 * @param sourceValidator A function that validates the individual package file contents against the DataswornSource JSON schema.
	 * @param logger The destination for logging build messages.
	 */
	constructor(id: string, logger: Logger) {
		if (!RulesPackageBuilder.isInitialized)
			throw new Error(
				'RulesPackageBuilder constructor is missing validator functions. Set them with the RulesPackageBuilder.init static method before creating an instance.'
			)
		this.id = id
		this.logger = logger
	}

	errors = new Map<string, unknown>()

	#addFile(file: RulesPackagePartData<TSource> | RulesPackagePart<TSource>) {
		const fileToAdd =
			file instanceof RulesPackagePart
				? file
				: new RulesPackagePart(file, this.logger)

		if (this.packageType != null && this.packageType !== fileToAdd.packageType)
			throw new Error(
				`Expected a source file with the type "${this.packageType}", but got "${fileToAdd.packageType}"`
			)

		if (!fileToAdd.isValidated)
			try {
				fileToAdd.init()
			} catch (e) {
				this.errors.set(fileToAdd.name, e)
			}

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
				throw new Error(
					`Failed to add "${file.name}" to ${this.packageType} "${this.id}"! ${String(e)}`
				)
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
			if (RulesPackageBuilder.#isObject(target) && IdKey in target) {
				const isRulesPackage = ['ruleset', 'expansion'].includes(
					(target as DataswornSource.RulesPackage).type
				)
				// if ((target._id as string).startsWith('asset.ability'))
				// 	console.log(target._id)

				if (!isRulesPackage) this.index.set(target._id as string, target)
			}
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
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage,
> {
	name: string
	data: TSource
}

class RulesPackagePart<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage,
> implements RulesPackagePartData<TSource>
{
	readonly logger: Logger

	static get sourceValidator() {
		return RulesPackageBuilder.sourceSchemaValidator
	}

	name: string

	index = new Map<string, TypeNode.Primary>()

	#data: TSource

	public get packageType() {
		return this.data.type
	}

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

	validateSource(): boolean {
		const result = RulesPackagePart.sourceValidator(this.data)
		this.#isValidated = true
		return result
	}

	constructor({ data, name }: RulesPackagePartData<TSource>, logger: Logger) {
		this.name = name
		this.logger = logger
		this.#data = data
	}

	init() {
		const isValid = this.validateSource()

		if (!isValid)
			throw new Error(
				`File "${this.name}" doesn't match DataswornSource schema`
			)

		void IdParser.assignIdsInRulesPackage(this.data, this.index)

		return isValid
	}
}
