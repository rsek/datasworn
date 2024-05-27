import type * as In from '../types/DataswornSource.js'
import type * as Out from '../types/Datasworn.js'
import { collectionTransformer, sourcedTransformer } from './transformer.js'
import { type SourcedNode } from '../schema/generic/SourcedNode.js'

import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

export const Move = sourcedTransformer<DataswornSource.Move, Datasworn.Move>({

})

export const MoveCategory = collectionTransformer<
	DataswornSource.MoveCategory,
	Datasworn.MoveCategory
>('moves', Move, {})
