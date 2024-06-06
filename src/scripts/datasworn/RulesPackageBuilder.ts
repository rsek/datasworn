import type DataswornNode from '../../pkg-core/DataswornNode.js'
import {
	IdParser,
	type Datasworn,
	type DataswornSource
} from '../../pkg-core/index.js'
import Log from '../utils/Log.js'
import { dataSwornKeyOrder, sortDataswornKeys, sortObjectKeys } from './sort.js'

export class RulesPackageBuilder<
	TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage,
	TTarget extends Datasworn.RulesPackage = Datasworn.RulesPackage
> {
	static logger = Log

	// reference to function that validates objects against schema.
	static validator_source: <T extends DataswornSource.RulesPackage>(
		sourceData: unknown
	) => sourceData is T

	static validator: <T extends Datasworn.RulesPackage>(
		data: unknown
	) => data is T

	// basic method: take JSON objects + package config, merge/sort/clean them
	// basic i/o for the files should *not* be done here -- the idea is to have something reusable

	readonly files = new Map<string, RulesPackageFile<TSource>>()
	readonly fileIds = new Map<string, Set<string>>()

	merged: TTarget = {} as TTarget

	// static mergeFiles<T extends DataswornSource.RulesPackage>(
	// 	data: Map<string, T>
	// ) {
	// 	const ruleset = {} as T

	// 	const sortedEntries = Array.from(data.entries())
	// 		// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
	// 		.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

	// 	for (const [_, file] of sortedEntries) this.merge(ruleset, file)

	// 	return sortDataswornKeys(ruleset) as Extract<Datasworn.RulesPackage, T>
	// }

	mergeFiles() {
		const sortedEntries = Array.from(this.files)
			// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
			.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

		const mergeUnsorted = {} as TTarget

		for (const [_, file] of sortedEntries)
			RulesPackageBuilder.merge(mergeUnsorted, file.data)

		this.merged = mergeUnsorted
		return this
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

	constructor(...files: RulesPackageFile<TSource>[])
	constructor(...files: RulesPackageFileData<TSource>[])
	constructor(
		...files: (RulesPackageFileData<TSource> | RulesPackageFile<TSource>)[]
	) {
		this.addFiles(...files)
	}

	#addFile(file: RulesPackageFileData<TSource> | RulesPackageFile<TSource>) {
		const fileToAdd =
			file instanceof RulesPackageFile ? file : new RulesPackageFile(file)
		this.files.set(fileToAdd.fileName, fileToAdd)
		return this
	}

	addFiles(
		...files: (RulesPackageFileData<TSource> | RulesPackageFile<TSource>)[]
	) {
		for (const file of files) void this.#addFile(file)

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
	fileName: string

	index = new Map<string, DataswornNode.Any>()

	data: TSource

	constructor({ data, fileName }: RulesPackageFileData<TSource>) {
		this.data = data
		this.fileName = fileName

		this.init()
	}

	init() {
		this.assignIds()
		// todo -- should probably apply source validation?
	}

	protected assignIds() {
		IdParser.assignIdsInRulesPackage(this.data, this.index)
	}
}

class ExpansionBuilder extends RulesPackageBuilder<DataswornSource.Expansion> {}

class RulesetBuilder extends RulesPackageBuilder<DataswornSource.Ruleset> {}
