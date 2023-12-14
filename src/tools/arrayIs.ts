export function arrayIs<T1 extends Array<any>, T2 extends Array<any>>(
	a: T1,
	b: T2
): a is T1 & T2 {
	if (a.length !== b.length) return false

	return a.every((valueA, i) => {
		const valueB = b[i]
		if (Array.isArray(valueA) && Array.isArray(valueB))
			return arrayIs(valueA, valueB)
		return Object.is(valueA, valueB)
	})
}
