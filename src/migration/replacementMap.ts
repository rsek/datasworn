import CONST from '../pkg-core/IdElements/CONST.js'
import { idReplacers } from '../pkg-core/Migrations/migrations.js'

const orderReplacers = (
	[{ source: patternA }, replacementA]: [RegExp, string | null],
	[{ source: patternB }, replacementB]: [RegExp, string | null]
): number => {
	const initialWildcard = '(\\*'
	const anyPipe = '|'
	const anyCapture = '$'

	if (replacementA === null && replacementA === replacementB) return 0
	if (replacementA === null) return -1
	if (replacementB === null) return 1

	switch (true) {
		// initial wildcard => high variability (could match any package)
		case patternA.startsWith(initialWildcard) &&
			!patternB.startsWith(initialWildcard):
		case replacementA.includes(anyCapture) &&
			!replacementB.includes(anyCapture):
		case patternA.includes(anyPipe) && !patternB.includes(anyPipe):
			return 1

		case !replacementA.includes(anyCapture) &&
			replacementB.includes(anyCapture):
		case !patternA.startsWith(initialWildcard) &&
			patternB.startsWith(initialWildcard):
		case !patternA.includes(anyPipe) && patternB.includes(anyPipe):
			return -1
		default: {
			// use number of captures as proxy for variability. more variable => lower on list
			const captureCountDifference =
				replacementB.split(anyCapture).length -
				replacementA.split(anyCapture).length
			if (captureCountDifference !== 0) return captureCountDifference
			// use number of path separators as a proxy for specificity. more specific => higher on list
			const slashCountDifference =
				patternA.split(CONST.PathKeySep).length -
				patternB.split(CONST.PathKeySep).length
			return slashCountDifference
		}
	}
}
export const replacementMap = new Map(
	Object.entries(idReplacers).flatMap(([k, v]) =>
		v.map((e) => [e.old, e.new] as [RegExp, string | null])
	)
	// .sort(orderReplacers)
)
