/** Get all object paths that point to another object. */
export function getObjectPaths(
	object: object,
	includeArrays = false,
	currentPath: Array<PropertyKey> = []
) {
	const results: Array<Array<PropertyKey>> = []
	for (const k in object) {
		if (!Object.hasOwn(object, k)) continue

		const nextObject = object[k as keyof typeof object]

		if (typeof nextObject !== 'object') continue
		if (Object.is(nextObject, null)) continue
		if (!includeArrays && Array.isArray(nextObject)) continue

		const nextPath = [...currentPath, k]
		results.push(
			nextPath,
			...getObjectPaths(nextObject, includeArrays, nextPath)
		)
	}

	return results
}
