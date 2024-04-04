import {
	sourcedTransformer,
	type Transformer,
	transform
} from './transformer.js'
import { type SourcedNode } from '../schema/generic/SourcedNode.js'
import { trackID } from './id-tracker.js'
import { cloneDeep } from 'lodash-es'
import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

type FeatureOrDangerData = DataswornSource.OracleTableRowText

type FeatureOrDanger = Datasworn.OracleTableRowText

interface FeatureOrDangerMap
	extends Record<
		DelveSiteCardType,
		Record<DelveSiteCardRowType, FeatureOrDanger>
	> {
	theme: {
		feature: Datasworn.OracleTableRowText
		danger: Datasworn.OracleTableRowText
	}
	domain: {
		feature: Datasworn.OracleTableRowText
		danger: Datasworn.OracleTableRowText
	}
}

function featureOrDanger<TCard extends keyof FeatureOrDangerMap>(
	data: FeatureOrDangerData,
	rowType: keyof FeatureOrDangerMap[TCard],
	parentID: string
) {
	if (!(typeof data.min === 'number' && typeof data.max === 'number'))
		throw new Error(
			`Expected numeric low and high for delve card feature/danger row: ${JSON.stringify(
				data
			)}`
		)
	// const id = trackID(
	// 	`${parentID}/${rowType as string}s/${data.min}-${data.max}`
	// )
	const result = cloneDeep(data) as FeatureOrDangerMap[TCard][typeof rowType]
	// result._id = id
	return result
}

export const DelveSiteTheme = sourcedTransformer<
	DataswornSource.DelveSiteTheme,
	Datasworn.DelveSiteTheme
>({
	features: function (
		this: SourcedNode,
		data: DataswornSource.DelveSiteTheme,
		key: string | number,
		parent: SourcedNode
	) {
		return data.features.map((row) =>
			featureOrDanger(row, 'feature', this._id)
		) as Datasworn.DelveSiteTheme['features']
	},
	dangers: function (
		this: SourcedNode,
		data: DataswornSource.DelveSiteTheme,
		key: string | number,
		parent: SourcedNode
	) {
		return data.dangers.map((row) =>
			featureOrDanger(row, 'danger', this._id)
		) as Datasworn.DelveSiteTheme['dangers']
	}
})
export const DelveSiteDomain = sourcedTransformer<
	DataswornSource.DelveSiteDomain,
	Datasworn.DelveSiteDomain
>({
	features: function (
		this: SourcedNode,
		data: DataswornSource.DelveSiteDomain,
		key: string | number,
		parent: SourcedNode
	) {
		return data.features.map((row) =>
			featureOrDanger(row, 'feature', this._id)
		) as Datasworn.DelveSiteDomain['features']
	},
	dangers: function (
		this: SourcedNode,
		data: DataswornSource.DelveSiteDomain,
		key: string | number,
		parent: SourcedNode
	) {
		return data.dangers.map((row) =>
			featureOrDanger(row, 'danger', this._id)
		) as Datasworn.DelveSiteDomain['dangers']
	}
})

export const DelveSite = sourcedTransformer<
	DataswornSource.DelveSite,
	Datasworn.DelveSite
>({})
