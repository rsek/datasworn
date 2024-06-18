import { type RulesPackage } from './Datasworn.js'
import { arrayIs } from './Utils/Array.js'
import type { ExtractTypeId } from './Utils/Id.js'
import { CONST, TypeGuard } from './IdElements/index.js'
import type * as Id from './StringId.js'
import type TypeNode from './TypeNode.js'

/**
 * Traverses objects using a simple glob expression. Currently, the glob features are limited to '*' and '**' wildcards; it doesn't handle expansion of braces, pipes, and so on.
 * @internal
 */
class ObjectGlobber<
	TTuple extends Array<PropertyKey> = Array<PropertyKey>
> extends Array<TTuple[number]> {
	constructor(...items: TTuple) {
		super(...(items.map(ObjectGlobber.replaceGlobString as any) as any))
	}

	/** Keys that are part of the real object path, but not part of the ID */
	static readonly implicitKeys = [CONST.ContentsKey, CONST.CollectionsKey]

	/** Does this path contain any wildcard or globstar elements? */
	get wildcard() {
		return this.some(ObjectGlobber.isGlobElement)
	}

	toJSON() {
		return this.map(ObjectGlobber.replaceGlobSymbol as any)
	}

	clone() {
		return new ObjectGlobber(...this)
	}

	partitionStaticPath(): [ObjectGlobber, ObjectGlobber] {
		if (!this.wildcard) return [this.clone(), new ObjectGlobber()]

		const firstGlobIndex = this.findIndex(ObjectGlobber.isGlobElement)

		return [
			new ObjectGlobber(...this.slice(0, firstGlobIndex)),
			new ObjectGlobber(...this.slice(firstGlobIndex))
		]
	}

	nearestStaticPath() {
		if (!this.wildcard) return this
		const pathElements = new ObjectGlobber<PropertyKey[]>()

		for (const element of this) {
			if (
				element === ObjectGlobber.WILDCARD ||
				element === ObjectGlobber.GLOBSTAR
			)
				break
			else pathElements.push(element)
		}

		return pathElements
	}

	step(steps = 1) {
		if (steps < 0) throw new Error("steps parameter can't be less than 0")
		return new ObjectGlobber(...this.slice(1))
	}

	getParent() {
		return new ObjectGlobber(...this.slice(0, this.length - 1))
	}

	getMatches<T>(
		from: object,
		matchTest?: ObjectGlobber.MatchTest,
		matches: unknown[] = [],
		includeArrays = false
	): T[] {
		if (!this.wildcard) {
			const match = this.walk(from)
			if (
				(typeof matchTest === 'function' &&
					matchTest(match, this.last(), this.last())) ||
				!matchTest
			)
				matches.push(match)
			// else matches.push(match)
			return matches as T[]
		}

		matches.push(
			...ObjectGlobber.getMatches(from, this, { includeArrays, matchTest })
		)

		return matches as T[]
	}

	walk<T>(from: object, forEach?: ObjectGlobber.WalkIteratee): T {
		if (this.wildcard)
			throw new Error(
				`Path contains wildcard/globstar elements. Use ${this.constructor.name}#${this.getMatches.name} instead.`
			)
		return ObjectGlobber.walk(from as any, this as any, forEach) as T
	}

	is<T extends ObjectGlobber>(path: T): path is T & this {
		if (path instanceof ObjectGlobber) return false

		return this.every((valueA, i) => {
			const valueB = path[i]
			if (Array.isArray(valueA) && Array.isArray(valueB))
				return arrayIs(valueA, valueB)
			return Object.is(valueA, valueB)
		})
	}

	static isGlobElement(element: unknown) {
		return (
			element === ObjectGlobber.WILDCARD || element === ObjectGlobber.GLOBSTAR
		)
	}

	/** Return the first array element. */
	first() {
		return this[0]
	}

	/** Return the last array element. */
	last() {
		return this[this.length - 1]
	}

	/** Return the array items without the last element. */
	head() {
		return this.slice(0, -1)
	}

	/** Return the array items without the first element. */
	tail() {
		return this.slice(1)
	}

	static getMatches(
		from: object,
		keys: PropertyKey[],
		{
			matchTest,
			includeArrays = false
		}: {
			matchTest?: ObjectGlobber.MatchTest
			includeArrays: boolean
		} = { includeArrays: false }
	) {
		const nextKey = keys[0]
		const nextPath = keys.slice(1)

		// console.log('next:', nextKey, nextPath)

		if (nextPath.length === 0)
			return ObjectGlobber.getKeyMatches(from, nextKey, {
				includeArrays,
				matchTest
			})

		const matches = ObjectGlobber.getKeyMatches(from, nextKey, {
			includeArrays
		})

		const results: unknown[] = []

		for (const match of matches) {
			results.push(
				...ObjectGlobber.getMatches(match as object, nextPath, {
					matchTest,
					includeArrays
				})
			)
		}

		return results
	}

	static getKeyMatches(
		from: object,
		matchedKey: PropertyKey,
		{
			forEachMatch,
			matchTest,
			includeArrays = false
		}: {
			forEachMatch?: ObjectGlobber.WalkIteratee
			matchTest?: ObjectGlobber.MatchTest
			includeArrays: boolean
		} = {
			includeArrays: false
		}
	): unknown[] {
		if (!ObjectGlobber.isPropertyKey(matchedKey))
			throw new Error(
				`Expected a number, string, or symbol key, but got ${typeof matchedKey}`
			)

		const results: unknown[] = []

		const hasMatchTest = typeof matchTest === 'function'

		function iterateWildcardMatch(
			key: PropertyKey,
			value: unknown,
			results: unknown[]
		) {
			if (!hasMatchTest || matchTest(value, key, matchedKey))
				results.push(value)
		}
		function iterateGlobstarMatch(
			key: PropertyKey,
			value: unknown,
			results: unknown[]
		) {
			iterateWildcardMatch(key, value, results)
			if (ObjectGlobber.isWalkable(value, includeArrays)) {
				results.push(
					...ObjectGlobber.getKeyMatches(value, matchedKey, {
						matchTest,
						includeArrays
					})
				)
			}
		}

		switch (matchedKey) {
			case ObjectGlobber.WILDCARD.description:
			case ObjectGlobber.WILDCARD:
				if (from instanceof Map) {
					for (const [key, value] of from)
						iterateWildcardMatch(key, value, results)
				} else
					for (const key in from) {
						if (!Object.hasOwn(from, key)) continue
						const value = from[key as keyof typeof from]
						iterateWildcardMatch(key, value, results)
					}
				break
			case ObjectGlobber.GLOBSTAR.description:
			case ObjectGlobber.GLOBSTAR:
				if (from instanceof Map) {
					for (const [key, value] of from)
						iterateGlobstarMatch(key, value, results)
				} else
					for (const key in from) {
						// console.log(realKey)
						if (!Object.hasOwn(from, key)) continue
						const value = from[key as keyof typeof from]
						iterateGlobstarMatch(key, value, results)
					}
				break
			default: {
				let value: unknown
				if (from instanceof Map) value = from.get(matchedKey)
				else value = from[matchedKey]

				if (
					typeof value === 'undefined' &&
					!ObjectGlobber.implicitKeys.includes(matchedKey as string)
				)
					throw new Error(
						`Unable to find key ${
							typeof matchedKey === 'symbol'
								? (matchedKey as any).toString()
								: JSON.stringify(matchedKey)
						}`
					)

				results.push(value)
				break
			}
		}

		return results
	}

	/** Is this value an object with recursable keys? */
	static isWalkable(value: unknown, includeArrays = false): value is object {
		if (!includeArrays && Array.isArray(value)) return false

		return typeof value === 'object' && !Object.is(value, null)
	}

	/** Is the value valid as an object property key? */
	static isPropertyKey(key: unknown): key is PropertyKey {
		return (
			typeof key === 'string' ||
			typeof key === 'number' ||
			typeof key === 'symbol'
		)
	}

	/**
	 * Navigates an object hierarchy by recursively following a series of property keys.
	 * @param from The object to walk.
	 * @param path An array of object property to follow.
	 * @param forEach An optional function to run on every walked value.
	 * @throws If a key is an invalid type, if a key can't be found, or if it reaches an undefined value.
	 */
	static walk<T extends Id.AnyId>(
		from: Record<string, RulesPackage>,
		path: ObjectGlobber,
		forEach?: ObjectGlobber.WalkIteratee
	): TypeNode.ByType<ExtractTypeId<T>>
	static walk(
		from: object,
		path: ObjectGlobber,
		forEach?: ObjectGlobber.WalkIteratee
	): unknown {
		if (path.length === 0) return from

		if (typeof forEach === 'function') forEach(from, path)

		const [currentKey, ...nextPath] = path

		if (!ObjectGlobber.isPropertyKey(currentKey))
			throw new Error(
				`Expected a number, string, or symbol key, but got ${typeof currentKey}`
			)
		if (typeof from !== 'object')
			throw new Error(`Expected an object but got ${typeof from}`)
		if (from == null)
			throw new Error(
				`Expected an object but got ${JSON.stringify(from as any)}`
			)

		let nextObject

		if (Array.isArray(from)) {
			const currentIndex = Number(currentKey)
			if (!Number.isInteger(currentIndex))
				throw new Error(`Expected an array index but got ${currentIndex}`)
			nextObject = from[currentIndex]
		} else if (from instanceof Map) {
			nextObject = from.get(currentKey)
		} else nextObject = from[currentKey as keyof typeof from]

		if (typeof nextObject === 'undefined')
			throw new Error(`Got undefined value in property "${String(currentKey)}"`)

		if (path.length === 0) return nextObject
		else return ObjectGlobber.walk(nextObject, nextPath as any)
	}

	/** Return all object paths in a given object. Paths that contain only a primitive value (boolean, number, string) are omitted. */
	static getObjectPaths(
		object: object,
		includeArrays = false,
		currentPath: ObjectGlobber = new ObjectGlobber()
	) {
		const results: Array<ObjectGlobber> = []

		if (object instanceof Map)
			results.push(
				...ObjectGlobber.#getMapPaths(object, includeArrays, currentPath)
			)
		else
			results.push(
				...ObjectGlobber.#getPlainObjectPaths(
					object,
					includeArrays,
					currentPath
				)
			)

		return results
	}

	static #getPlainObjectPaths(
		object: object,
		includeArrays = false,
		currentPath: ObjectGlobber = new ObjectGlobber()
	) {
		const results: Array<ObjectGlobber> = []

		for (const k in object) {
			const nextObject = object[k]
			if (typeof nextObject !== 'object') continue
			if (Object.is(nextObject, null)) continue
			if (!includeArrays && Array.isArray(nextObject)) continue

			const nextPath = new ObjectGlobber(...currentPath, k)

			results.push(
				nextPath,
				...ObjectGlobber.getObjectPaths(nextObject, includeArrays, nextPath)
			)
		}

		return results
	}

	static #getMapPaths(
		object: Map<any, any>,
		includeArrays = false,
		currentPath: ObjectGlobber = new ObjectGlobber()
	) {
		const results: Array<ObjectGlobber> = []

		for (const [k, nextObject] of object) {
			if (typeof nextObject !== 'object') continue
			if (Object.is(nextObject, null)) continue
			if (!includeArrays && Array.isArray(nextObject)) continue

			const nextPath = new ObjectGlobber(...currentPath, k)

			results.push(
				nextPath,
				...ObjectGlobber.getObjectPaths(nextObject, includeArrays, nextPath)
			)
		}

		return results
	}

	/** Replace a wildcard/globstar string with a Symbol */
	static replaceGlobString<T extends PropertyKey>(
		item: T
	): T extends typeof CONST.WildcardString
		? (typeof ObjectGlobber)['WILDCARD']
		: T extends typeof CONST.GlobstarString
			? (typeof ObjectGlobber)['GLOBSTAR']
			: T {
		switch (true) {
			case TypeGuard.Wildcard(item):
				return ObjectGlobber.WILDCARD as any
			case TypeGuard.Globstar(item):
				return ObjectGlobber.GLOBSTAR as any
			default:
				return item as any
		}
	}

	/** Replace a wildcard or globstar Symbol with a string representation. */
	static replaceGlobSymbol<T extends PropertyKey>(
		item: T
	): T extends (typeof ObjectGlobber)['WILDCARD']
		? typeof CONST.WildcardString
		: T extends (typeof ObjectGlobber)['GLOBSTAR']
			? typeof CONST.GlobstarString
			: T {
		switch (item) {
			case ObjectGlobber.WILDCARD:
			case ObjectGlobber.GLOBSTAR:
				return (item as any).description()
			default:
				return item as any
		}
	}
}

namespace ObjectGlobber {
	/** Represents a glob wildcard path element, usually expressed as `*` */
	export const WILDCARD = Symbol(CONST.WildcardString)
	/** Represents a globstar (recursive wildcard) path element, usually expressed as `**` */
	export const GLOBSTAR = Symbol(CONST.GlobstarString)

	export type WalkIteratee = (value: unknown, path: PropertyKey[]) => void

	export type MatchTest<T = unknown> = (
		value: T,
		thisKey: PropertyKey,
		matchedWith: PropertyKey
	) => boolean
}

export default ObjectGlobber
