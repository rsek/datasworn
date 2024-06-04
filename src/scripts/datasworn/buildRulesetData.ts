import { assignIds } from '../../schema/generateId.js'
import type * as DataswornSource from '../../types/DataswornSource.js'

/** Builds from the contents of a single YAML or JSON file */
export async function buildRulesetData(
	sourceData: DataswornSource.RulesPackage
) {
	assignIds(sourceData)

	return sourceData
}
