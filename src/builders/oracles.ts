import { trackID } from './id-tracker.js'
import {
	transform,
	sourcedTransformer,
	type Transformer,
	recursiveCollectionTransformer
} from './transformer.js'
import { type SourcedNode } from '../schema/generic/SourcedNode.js'

import { cloneDeep, merge } from 'lodash-es'
import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

export const OracleTableRow: Transformer<
	DataswornSource.OracleTableRow,
	Datasworn.OracleTableRow,
	Datasworn.OracleRollable
> = {
	rolls(data, key, parent) {
		return data.rolls as Datasworn.OracleRoll[]
	}
	// id(
	// 	data: DataswornSource.OracleTableRow,
	// 	key: string | number,
	// 	parent: SourcedNode
	// ) {
	// 	// if the row has a valid range, use that instead of the index
	// 	if (data.max != null && data.min != null) key = `${data.min}-${data.max}`
	// 	const id = `${parent.id}/${key}`

	// 	return trackID(id)
	// }
}

export const OracleTable = sourcedTransformer<
	DataswornSource.OracleRollable,
	Datasworn.OracleRollable,
	Datasworn.OracleCollection
>({
	rows: function (
		this: SourcedNode,
		data: DataswornSource.OracleRollable,
		key: string | number,
		parent: SourcedNode
	): Datasworn.OracleTableRowDetails | Datasworn.OracleTableRowSimple[] {
		return data.rows.map((row, i) => {
			return transform(row, i, this, OracleTableRow)
		})
	}
})

export const OracleCollection = recursiveCollectionTransformer<
	DataswornSource.OracleCollection,
	Datasworn.OracleCollection,
	null,
	typeof OracleTable
>('oracles', OracleTable, {})
