import { RulesPackage as DataswornBuilder } from '../../builders/datasworn.js'
import { transform } from '../../builders/transformer.js'
import type * as Generic from '../../schema/Generic.js'
import type * as DataswornSource from '../../types/DataswornSource.js'
import type * as Datasworn from '../../types/Datasworn.js'
import { assignIds } from '../../schema/generateId.js'

/** Builds from the contents of a single YAML or JSON file */
export async function buildRulesetData(
	sourceData: DataswornSource.RulesPackage
) {
	// const builtData = transform<
	// 	DataswornSource.RulesPackage,
	// 	Datasworn.RulesPackage,
	// 	unknown
	// >(
	// 	sourceData,
	// 	sourceData._id,
	// 	sourceData as DataswornSource.RulesPackage & Generic.SourcedNode,
	// 	DataswornBuilder as any
	// )

	// return builtData

	assignIds(sourceData)

	return sourceData
}
