import {
	Wildcard as WildcardString,
	Globstar as GlobstarString
} from './const.js'
import ElementGuard from './ElementGuard.js'
import { walk, type WalkIteratee } from './walk.js'
import {
	type AnyId,
	CollectionsKey,
	ContentsKey,
	type PathForId,
	type TypeForId
} from './types.js'
import { IdParser } from './IdParser.js'
import { type RulesPackage } from '../types/Datasworn.js'
import { arrayIs } from './arrayIs.js'

type MatchTest<T = unknown> = (
	value: T,
	thisKey: PropertyKey,
	matchedWith: PropertyKey
) => boolean

// TODO: consider splitting Path and GlobPath?

class ObjectGlobber<
	TTuple extends Array<PropertyKey> = Array<PropertyKey>
> extends Array<TTuple[number]> {
	/** Represents a glob wildcard path element, usually expressed as `*` */
	static readonly WILDCARD = Symbol(WildcardString)
	/** Represents a globstar path element, usually expressed as `**` */
	static readonly GLOBSTAR = Symbol(GlobstarString)

	constructor(...items: TTuple) {
		super(...(items.map(ObjectGlobber.replaceGlobString as any) as any))
	}

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
			...ObjectGlobber.getMatches(from, this, { includeArrays, matchTest })
		)

		return matches as T[]
	}

	walk<T>(from: object, forEach?: WalkIteratee): T {
		if (this.wildcard)
			throw new Error(
				`Path contains wildcard/globstar elements. Use ${this.constructor.name}#${this.getMatches.name} instead.`
			)
		return ObjectGlobber.walk(from as any, this as any, forEach) as T
	}

	is<T extends ObjectGlobber>(path: T): path is T & typeof this {
		if (path instanceof ObjectGlobber) return false

		return this.every((valueA, i) => {
			const valueB = path[i]
			if (Array.isArray(valueA) && Array.isArray(valueB))
				return arrayIs(valueA, valueB)
			return Object.is(valueA, valueB)
		})
	}

	static isGlobElement(element: unknown) {
		return element === this.WILDCARD || element === this.GLOBSTAR
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

	static fromId<T extends AnyId>(id: T) {
		return new IdParser(id).toPath()
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
			forEachMatch?: WalkIteratee
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
			case this.WILDCARD:
				for (const realKey in from) {
					if (!Object.hasOwn(from, realKey)) continue
					const element = from[realKey as keyof typeof from]
					if (!hasMatchTest || matchTest(element, realKey, matchKey))
						results.push(element)
				}
				break
			case this.GLOBSTAR:
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

	/** Does this object have recursable keys */
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

	static walk<T extends AnyId>(
		from: Record<string, RulesPackage>,
		path: ObjectGlobber<PathForId<T>>,
		forEach?: WalkIteratee
	): TypeForId<T>
	static walk(
		from: object,
		path: ObjectGlobber,
		forEach?: WalkIteratee
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
		else return walk(nextObject, nextPath as any)
	}

	static getObjectPaths(
		object: object,
		includeArrays = false,
		currentPath: ObjectGlobber = new ObjectGlobber()
	) {
		const results: Array<ObjectGlobber> = []
		for (const k in object) {
			if (!Object.hasOwn(object, k)) continue

			const nextObject = object[k as keyof typeof object]

			if (typeof nextObject !== 'object') continue
			if (Object.is(nextObject, null)) continue
			if (!includeArrays && Array.isArray(nextObject)) continue

			const nextPath = new ObjectGlobber(...currentPath, k)
			results.push(
				nextPath,
				...this.getObjectPaths(nextObject, includeArrays, nextPath)
			)
		}

		return results
	}

	static replaceGlobString<T extends PropertyKey>(
		item: T
	): T extends typeof WildcardString
		? (typeof ObjectGlobber)['WILDCARD']
		: T extends typeof GlobstarString
		  ? (typeof ObjectGlobber)['GLOBSTAR']
		  : T {
		switch (true) {
			case ElementGuard.Wildcard(item):
				return this.WILDCARD as any
			case ElementGuard.Globstar(item):
				return this.GLOBSTAR as any
			default:
				return item as any
		}
	}

	static replaceGlobSymbol<T extends PropertyKey>(
		item: T
	): T extends (typeof ObjectGlobber)['WILDCARD']
		? typeof WildcardString
		: T extends (typeof ObjectGlobber)['GLOBSTAR']
		  ? typeof GlobstarString
		  : T {
		switch (item) {
			case this.WILDCARD:
			case this.GLOBSTAR:
				return (item as any).description()
			default:
				return item as any
		}
	}
}

export default ObjectGlobber
