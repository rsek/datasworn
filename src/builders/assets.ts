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
	attachments(data, key, parent) {
		if (data.attachments == null) return undefined

		const attachments = cloneDeep(data.attachments) as Datasworn.AssetAttachment

		if (attachments.max == null) attachments.max = null

		return attachments
	},
	options: function (
		this: SourcedNode,
		data: DataswornSource.Asset,
		key: string | number,
		parent: SourcedNode
	): Record<string, Datasworn.AssetOptionField> | undefined {
		if (data.options == null) return undefined
		return mapValues(data.options, (fieldData, fieldKey) => {
			const field = cloneDeep(fieldData) as Datasworn.AssetOptionField
			// field._id = `${this._id}/options/${fieldKey}`
			return field
		})
	},
	controls: function (
		this: SourcedNode,
		data: DataswornSource.Asset,
		key: string | number,
		parent: SourcedNode
	): Record<string, Datasworn.AssetConditionMeterControlField> | undefined {
		if (data.controls == null) return undefined
		return mapValues(data.controls, (fieldData, fieldKey) => {
			const field = cloneDeep(
				fieldData
			) as Datasworn.AssetConditionMeterControlField

			// field._id = `${this._id}/controls/${fieldKey}`

			// if (field.field_type === 'condition_meter' && field.controls != null)
			// 	for (const k in field.controls)
			// if (Object.prototype.hasOwnProperty.call(field.controls, k))
			// 	field.controls[k]._id = `${field._id}/controls/${k}`

			return field
		})
	},
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
	},
	options: function (
		this: SourcedNode,
		data: DataswornSource.AssetAbility,
		key: string | number,
		parent: SourcedNode
	): Record<string, Datasworn.AssetAbilityOptionField> | undefined {
		if (data.options == null) return undefined
		return mapValues(data.options, (fieldData, fieldKey) => {
			const field = cloneDeep(fieldData) as Datasworn.AssetAbilityOptionField
			// field._id = `${this._id}/options/${fieldKey}`
			return field
		})
	},
	controls: function (
		this: SourcedNode,
		data: DataswornSource.AssetAbility,
		key: string | number,
		parent: SourcedNode
	): Record<string, Datasworn.AssetAbilityControlField> | undefined {
		if (data.controls == null) return undefined
		return mapValues(data.controls, (fieldData, fieldKey) => {
			const field = cloneDeep(fieldData) as Datasworn.AssetAbilityControlField
			// field._id = `${this._id}/controls/${fieldKey}`
			return field
		})
	},

	enhance_asset: function (
		this: SourcedNode,
		data: DataswornSource.AssetAbility,
		key: string | number,
		parent: SourcedNode
	): Datasworn.AssetEnhancement | undefined {
		if (data.enhance_asset == null) return undefined

		return data.enhance_asset as Datasworn.AssetEnhancement
	},

	enhance_moves: function (
		this: SourcedNode,
		data: DataswornSource.AssetAbility,
		key: string | number,
		parent: SourcedNode
	): Datasworn.MoveEnhancement[] | undefined {
		if (data.enhance_moves == null) return undefined

		return data.enhance_moves as Datasworn.MoveEnhancement[]
	}
}

export const AssetCollection = collectionTransformer<
	DataswornSource.AssetCollection,
	Datasworn.AssetCollection,
	null
>('assets', Asset, {})
