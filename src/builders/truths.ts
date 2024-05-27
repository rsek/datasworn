import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'
import { trackID } from './id-tracker.js'
import {
	sourcedTransformer,
	transform,
	type Transformer
} from './transformer.js'
import { type SourcedNode } from '../schema/generic/SourcedNode.js'


export const Truth = sourcedTransformer<
	DataswornSource.Truth,
	Datasworn.Truth,
	null
>({})
