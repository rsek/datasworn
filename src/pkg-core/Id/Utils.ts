import type * as Datasworn from '../Datasworn.js'
import type * as Strings from './StringId.js'

// datasworn objects
export type DataswornTree =
	| Record<Strings.RulesPackageId, Datasworn.RulesPackage>
	| Map<Strings.RulesPackageId, Datasworn.RulesPackage>


