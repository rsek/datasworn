import type * as Datasworn from './Datasworn.js'
import type * as Strings from './StringId.js'

/** A keyed object containing multiple Datasworn RulesPackages */

export type Tree =
	| Record<Strings.RulesPackageId, Datasworn.RulesPackage>
	| Map<Strings.RulesPackageId, Datasworn.RulesPackage>
