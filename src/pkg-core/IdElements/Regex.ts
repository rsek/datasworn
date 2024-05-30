import CONST from './CONST.js'

/**
 * Regular expressions used to validate Datasworn ID elements.
 */
namespace Regex {
	const DictKeyBase = /[a-z][a-z_]*/
	export const DictKeyElement = new RegExp(`(${DictKeyBase.source})`)
	export const DictKey = new RegExp(`^${DictKeyBase.source}$`)
	const RulesPackageBase = new RegExp(
		`[a-z][a-z0-9_]{${CONST.PACKAGE_ID_LENGTH_MIN},}`
	)
	export const RulesPackageElement = new RegExp(`(${RulesPackageBase.source})`)
	export const RulesPackageId = new RegExp(`^${RulesPackageBase.source}$`)

	const RecursiveDictKeyBase = new RegExp(
		`${DictKeyBase.source}(?:\\${CONST.Sep}${DictKeyBase.source}){${CONST.RECURSIVE_PATH_ELEMENTS_MIN - 1},${CONST.RECURSIVE_PATH_ELEMENTS_MAX - 1}}`
	)

	export const RecursiveDictKeyElement = new RegExp(
		`(${RecursiveDictKeyBase.source})`
	)
}

export default Regex
