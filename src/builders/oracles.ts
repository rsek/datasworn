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

export const OracleTable = sourcedTransformer<
	DataswornSource.OracleRollable,
	Datasworn.OracleRollable,
	Datasworn.OracleCollection
>()

export const OracleCollection = recursiveCollectionTransformer<
	DataswornSource.OracleCollection,
	Datasworn.OracleCollection,
	null,
	typeof OracleTable
>('oracles', OracleTable, {})