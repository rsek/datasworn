import { sourcedTransformer } from './transformer.js'
import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

export const Rarity = sourcedTransformer<
	DataswornSource.Rarity,
	Datasworn.Rarity,
	null
>({})
