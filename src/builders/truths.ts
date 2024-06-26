import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'
import { trackID } from './id-tracker.js'
import {
	sourcedTransformer,
	transform,
	type Transformer
} from './transformer.js'
import { type SourcedNode } from '../schema/generic/SourcedNode.js'

export const TruthOption: Transformer<
	DataswornSource.TruthOption,
	Datasworn.TruthOption,
	Datasworn.Truth
> = {
	// _id: function (
	// 	data: DataswornSource.TruthOption,
	// 	key: string | number,
	// 	parent: SourcedNode
	// ): string {
	// 	return trackID(`${parent._id}/${key}`)
	// }
}

export const Truth = sourcedTransformer<
	DataswornSource.Truth,
	Datasworn.Truth,
	null
>({
	options: function (
		this: SourcedNode,
		data: DataswornSource.Truth,
		key: string | number,
		parent: SourcedNode
	): Datasworn.TruthOption[] {
		return data.options.map((option, i) =>
			transform(option, i, this, TruthOption)
		)
	}
})
