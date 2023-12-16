/**
 * Regular expressions used to validate Datasworn ID elements.
 */
namespace Regex {
	export const DictKey = /^[a-z][a-z_]*$/
	export const RulesPackageId = /^[a-z][a-z0-9_]{3,}$/
}

export default Regex
