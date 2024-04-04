import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

import {
	recursiveCollectionTransformer,
	sourcedTransformer
} from './transformer.js'

export const AtlasEntry = sourcedTransformer<
	DataswornSource.AtlasEntry,
	Datasworn.AtlasEntry,
	Datasworn.AtlasCollection
>({})

export const AtlasCollection = recursiveCollectionTransformer<
	DataswornSource.AtlasCollection,
	Datasworn.AtlasCollection,
	null
>('atlas', AtlasEntry, {})
