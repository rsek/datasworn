import { type RulesPackage } from '../types/Datasworn.js'
import { type AnyId, type PathForId, type TypeForId } from './types.js'

export type WalkIteratee = (value: unknown, path: PropertyKey[]) => void

/**
 * Navigates an object hierarchy by recursively following a series of property keys.
 * @param from The object to walk.
 * @param path An array of object property to follow.
 * @param forEach An optional function to run on every walked value.
 * @throws If a key is an invalid type, or if a key can't be found.
 */
// @ts-expect-error idk what you want from me, typescript
export function walk<T extends AnyId>(
	from: Record<string, RulesPackage>,
	path: PathForId<T>,
	forEach?: WalkIteratee
): TypeForId<T>
export function walk(
	from: object,
	path: PropertyKey[],
	forEach?: WalkIteratee
): unknown {
	if (path.length === 0) return from

	if (typeof forEach === 'function') forEach(from, path)

	const [currentKey, ...nextPath] = path

	if (
		!(
			typeof currentKey === 'string' ||
			typeof currentKey === 'number' ||
			typeof currentKey === 'symbol'
		)
	)
		throw new Error(
			`Expected a number, string, or symbol key, but got ${typeof currentKey}`
		)
	if (typeof from !== 'object')
		throw new Error(`Expected an object but got ${typeof from}`)
	if (from == null)
		throw new Error(`Expected an object but got ${JSON.stringify(from as any)}`)

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

// todo: rewrite the wildcard getter with this.
// `**` might be expressed a path element that doesn't get removed from the array when passing it to the next thing.

// so if the next key is `**`, it recurses from the all adjacent nodes
