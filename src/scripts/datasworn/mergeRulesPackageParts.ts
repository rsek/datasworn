import { merge } from 'lodash-es'
import type * as Datasworn from '../../types/Datasworn.js'
import { sortDataswornKeys } from './sort.js'

export function mergeRulesPackageParts<T extends Datasworn.RulesPackage>(
	data: Map<string, T>
) {
	const ruleset = {} as T

	const entries = Array.from(data.entries())
		// sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
		.sort(([a], [b]) => a.localeCompare(b, 'en-US'))

	for (const [_, data] of entries) merge(ruleset, data)

	return sortDataswornKeys(ruleset)
}
