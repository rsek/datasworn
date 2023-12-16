import { type RulesPackage } from '../Datasworn.js'
import type * as Path from './Path.js'
import { arrayIs } from './arrayIs.js'
import { type TypeForId } from '../Id/Utils.js'
import * as Id from '../Id/index.js'
import CONST from '../Id/IdElements/CONST.js'

type MatchTest<T = unknown> = (
	value: T,
	thisKey: PropertyKey,
	matchedWith: PropertyKey
) => boolean

/**
 * @internal
 */
class ObjectGlobPath<
	TTuple extends Array<PropertyKey> = Array<PropertyKey>
> extends Array<TTuple[number]> {
	constructor(...items: TTuple) {
		super(...(items.map(ObjectGlobPath.replaceGlobString as any) as any))
	}

	/** Does this path contain any wildcard or globstar elements? */
	get wildcard() {
		return this.some(ObjectGlobPath.isGlobElement)
	}

	toJSON() {
		return this.map(ObjectGlobPath.replaceGlobSymbol as any)
	}

	clone() {
		return new ObjectGlobPath(...this)
	}

	partitionStaticPath(): [ObjectGlobPath, ObjectGlobPath] {
		if (!this.wildcard) return [this.clone(), new ObjectGlobPath()]

		const firstGlobIndex = this.findIndex(ObjectGlobPath.isGlobElement)

		return [
			new ObjectGlobPath(...this.slice(0, firstGlobIndex)),
			new ObjectGlobPath(...this.slice(firstGlobIndex))
		]
	}

	nearestStaticPath() {
		if (!this.wildcard) return this
		const pathElements = new ObjectGlobPath<PropertyKey[]>()

		for (const element of this) {
			if (
				element === ObjectGlobPath.WILDCARD ||
				element === ObjectGlobPath.GLOBSTAR
			)
				break
			else pathElements.push(element)
		}

		return pathElements
	}

	step(steps = 1) {
		if (steps < 0) throw new Error("steps parameter can't be less than 0")
		return new ObjectGlobPath(...this.slice(1))
	}

	getParent() {
		return new ObjectGlobPath(...this.slice(0, this.length - 1))
	}

	getMatches<T>(
		from: object,
		matchTest?: MatchTest,
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
			...ObjectGlobPath.getMatches(from, this, { includeArrays, matchTest })
		)

		return matches as T[]
	}

	walk<T>(from: object, forEach?: ObjectGlobPath.WalkIteratee): T {
		if (this.wildcard)
			throw new Error(
				`Path contains wildcard/globstar elements. Use ${this.constructor.name}#${this.getMatches.name} instead.`
			)
		return ObjectGlobPath.walk(from as any, this as any, forEach) as T
	}

	is<T extends ObjectGlobPath>(path: T): path is T & this {
		if (path instanceof ObjectGlobPath) return false

		return this.every((valueA, i) => {
			const valueB = path[i]
			if (Array.isArray(valueA) && Array.isArray(valueB))
				return arrayIs(valueA, valueB)
			return Object.is(valueA, valueB)
		})
	}

	static isGlobElement(element: unknown) {
		return (
			element === ObjectGlobPath.WILDCARD || element === ObjectGlobPath.GLOBSTAR
		)
	}

	first() {
		return this[0]
	}

	last() {
		return this[this.length - 1]
	}

	head() {
		return this.slice(1)
	}

	tail() {
		return this.slice(0, -1)
	}

	static fromId<T extends Id.AnyId>(id: T) {
		return new Id.IdParser(id).toPath()
	}

	static getMatches(
		from: object,
		keys: PropertyKey[],
		{
			matchTest,
			includeArrays = false
		}: {
			matchTest?: MatchTest
			includeArrays: boolean
		} = { includeArrays: false }
	) {
		const nextKey = keys[0]
		const nextPath = keys.slice(1)

		// console.log('next:', nextKey, nextPath)

		if (nextPath.length === 0)
			return this.getKeyMatches(from, nextKey, { includeArrays, matchTest })

		const matches = this.getKeyMatches(from, nextKey, {
			includeArrays
		})

		const results: unknown[] = []

		for (const match of matches) {
			results.push(
				...this.getMatches(match as object, nextPath, {
					matchTest,
					includeArrays
				})
			)
		}

		return results
	}

	static getKeyMatches(
		from: object,
		matchKey: PropertyKey,
		{
			forEachMatch,
			matchTest,
			includeArrays = false
		}: {
			forEachMatch?: ObjectGlobPath.WalkIteratee
			matchTest?: MatchTest
			includeArrays: boolean
		} = {
			includeArrays: false
		}
	): unknown[] {
		if (!this.isPropertyKey(matchKey))
			throw new Error(
				`Expected a number, string, or symbol key, but got ${typeof matchKey}`
			)

		const results: unknown[] = []
		const hasMatchTest = typeof matchTest === 'function'

		switch (matchKey) {
			case ObjectGlobPath.WILDCARD:
				for (const realKey in from) {
					if (!Object.hasOwn(from, realKey)) continue
					const element = from[realKey as keyof typeof from]
					if (!hasMatchTest || matchTest(element, realKey, matchKey))
						results.push(element)
				}
				break
			case ObjectGlobPath.GLOBSTAR:
				for (const realKey in from) {
					// console.log(realKey)
					if (!Object.hasOwn(from, realKey)) continue
					const element = from[realKey as keyof typeof from]
					if (!hasMatchTest || matchTest(element, realKey, matchKey))
						results.push(element)
					if (this.isWalkable(element, includeArrays)) {
						results.push(
							...this.getKeyMatches(element, matchKey, {
								matchTest,
								includeArrays
							})
						)
					}
				}
				break
			default: {
				if (!(matchKey in from))
					throw new Error(
						`Unable to find key ${
							typeof matchKey === 'symbol'
								? (matchKey as any).toString()
								: JSON.stringify(matchKey)
						}`
					)
				results.push(from[matchKey as keyof typeof from])
			}
		}

		return results
	}

	/** Is this value an object with recursable keys? */
	static isWalkable(value: unknown, includeArrays = false) {
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
	 * @throws If a key is an invalid type, or if a key can't be found.
	 */
	static walk<T extends Id.AnyId>(
		from: Record<string, RulesPackage>,
		path: ObjectGlobPath<Path.PathForId<T>>,
		forEach?: ObjectGlobPath.WalkIteratee
	): TypeForId<T>
	static walk(
		from: object,
		path: ObjectGlobPath,
		forEach?: ObjectGlobPath.WalkIteratee
	): unknown {
		if (path.length === 0) return from

		if (typeof forEach === 'function') forEach(from, path)

		const [currentKey, ...nextPath] = path

		if (!this.isPropertyKey(currentKey))
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
		} else nextObject = from[currentKey as keyof typeof from]

		if (path.length === 0) return nextObject
		else return ObjectGlobPath.walk(nextObject, nextPath as any)
	}

	static getObjectPaths(
		object: object,
		includeArrays = false,
		currentPath: ObjectGlobPath = new ObjectGlobPath()
	) {
		const results: Array<ObjectGlobPath> = []
		for (const k in object) {
			if (!Object.hasOwn(object, k)) continue

			const nextObject = object[k as keyof typeof object]

			if (typeof nextObject !== 'object') continue
			if (Object.is(nextObject, null)) continue
			if (!includeArrays && Array.isArray(nextObject)) continue

			const nextPath = new ObjectGlobPath(...currentPath, k)
			results.push(
				nextPath,
				...this.getObjectPaths(nextObject, includeArrays, nextPath)
			)
		}

		return results
	}

	/** Replace a wildcard/globstar string with a Symbol */
	static replaceGlobString<T extends PropertyKey>(
		item: T
	): T extends typeof CONST.WildcardString
		? (typeof ObjectGlobPath)['WILDCARD']
		: T extends typeof CONST.GlobstarString
		  ? (typeof ObjectGlobPath)['GLOBSTAR']
		  : T {
		switch (true) {
			case Id.IdElements.TypeGuard.Wildcard(item):
				return ObjectGlobPath.WILDCARD as any
			case Id.IdElements.TypeGuard.Globstar(item):
				return ObjectGlobPath.GLOBSTAR as any
			default:
				return item as any
		}
	}

	/** Replace a wildcard or globstar Symbol with a string representation. */
	static replaceGlobSymbol<T extends PropertyKey>(
		item: T
	): T extends (typeof ObjectGlobPath)['WILDCARD']
		? typeof CONST.WildcardString
		: T extends (typeof ObjectGlobPath)['GLOBSTAR']
		  ? typeof CONST.GlobstarString
		  : T {
		switch (item) {
			case ObjectGlobPath.WILDCARD:
			case ObjectGlobPath.GLOBSTAR:
				return (item as any).description()
			default:
				return item as any
		}
	}
}

namespace ObjectGlobPath {
	/** Represents a glob wildcard path element, usually expressed as `*` */
	export const WILDCARD = Symbol(CONST.WildcardString)
	/** Represents a globstar (recursive wildcard) path element, usually expressed as `**` */
	export const GLOBSTAR = Symbol(CONST.GlobstarString)

	export type WalkIteratee = (value: unknown, path: PropertyKey[]) => void
}

export default ObjectGlobPath
