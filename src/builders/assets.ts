import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

import {
	sourcedTransformer,
	collectionTransformer,
	type Transformer,
	transform
} from './transformer.js'
import { cloneDeep, mapValues } from 'lodash-es'
import { Move } from './moves.js'
import { trackID } from './id-tracker.js'
import { type SourcedNode } from '../schema/generic/SourcedNode.js'
import type * as Generic from '../schema/Generic.js'

export const Asset = sourcedTransformer<
	DataswornSource.Asset,
	Datasworn.Asset,
	Datasworn.AssetCollection
>({
	abilities: function (
		this: SourcedNode,
		data: DataswornSource.Asset,
		key: string | number,
		parent: SourcedNode
	): [Datasworn.AssetAbility, Datasworn.AssetAbility, Datasworn.AssetAbility] {
		return data.abilities.map((ability, index) =>
			transform(ability, index, this, AssetAbility)
		) as [
			Datasworn.AssetAbility,
			Datasworn.AssetAbility,
			Datasworn.AssetAbility
		]
	}
})

export const AssetAbility: Transformer<
	DataswornSource.AssetAbility,
	Datasworn.AssetAbility,
	Datasworn.Asset
> = {
	_id: function (
		data: DataswornSource.AssetAbility,
		key: string | number,
		parent: SourcedNode
	): string {
		return trackID(`${parent._id}/abilities/${key}`)
	},
	moves: function (
		this: SourcedNode,
		data: DataswornSource.AssetAbility,
		key: string | number,
		parent: SourcedNode
	): Record<string, Datasworn.Move> | undefined {
		if (data.moves == null) return
		return mapValues(data.moves, (moveData, moveKey) =>
			transform(moveData, moveKey, { _id: `${this._id}/moves` }, Move)
		)
	}
}

export const AssetCollection = collectionTransformer<
	DataswornSource.AssetCollection,
	Datasworn.AssetCollection,
	null
>('assets', Asset, {})
