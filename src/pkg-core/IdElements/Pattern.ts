import CONST from './CONST.js'

/**
 * Regular expressions used to validate Datasworn ID elements.
 */
namespace Pattern {
	const DictKeyBase = /[a-z][a-z_]*/
	export const DictKeyElement = DictKeyBase
	export const DictKey = new RegExp(`^${DictKeyBase.source}$`)
	const RulesPackageBase = new RegExp(
		`[a-z][a-z0-9_]{${CONST.PACKAGE_ID_LENGTH_MIN},}`
	)
	export const RulesPackageElement = RulesPackageBase
	export const RulesPackageId = new RegExp(`^${RulesPackageBase.source}$`)

	export const IndexElement = /\d+/

	const RecursiveDictKeysBase = new RegExp(
		`${DictKeyBase.source}(?:\\${CONST.PathSep}${DictKeyBase.source}){${CONST.RECURSIVE_PATH_ELEMENTS_MIN - 1},${CONST.RECURSIVE_PATH_ELEMENTS_MAX - 1}}`
	)

	export const RecursiveDictKeysElement = RecursiveDictKeysBase
}

export default Pattern
