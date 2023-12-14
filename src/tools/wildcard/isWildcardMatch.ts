import picomatch from 'picomatch'

/** Does the supplied ID match at least one of the supplied wildcard IDs? */
function matchesWildcard(
	id: string,
	...wildcards: (string | picomatch.Matcher)[]
) {
	const matchers = wildcards.map((item) =>
		typeof item === 'string' ? picomatch(item) : item
	)
	return matchers.some((matcher) => matcher(id))
}

/** @return All IDs that match the supplied wildcards. */
function matchWildcardIds(
	ids: string[],
	...wildcards: (string | picomatch.Matcher)[]
) {
	// TODO: ensure they're valid wildcards

	const matchers = wildcards.map((item) =>
		typeof item === 'string' ? picomatch(item) : item
	)

	return ids.filter((id) => matchesWildcard(id, ...matchers))
}

/** @return All objects with IDs that match the supplied wildcards. */
function matchWildcardObjects<T extends { id: string }>(
	objects: T[],
	...wildcards: (string | picomatch.Matcher)[]
) {
	const matchers = wildcards.map((item) =>
		typeof item === 'string' ? picomatch(item) : item
	)

	return objects.filter(({ id }) => matchesWildcard(id, ...matchers))
}
