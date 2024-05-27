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

export const DelveSiteTheme = sourcedTransformer<
	DataswornSource.DelveSiteTheme,
	Datasworn.DelveSiteTheme
>({})
export const DelveSiteDomain = sourcedTransformer<
	DataswornSource.DelveSiteDomain,
	Datasworn.DelveSiteDomain
>({})

export const DelveSite = sourcedTransformer<
	DataswornSource.DelveSite,
	Datasworn.DelveSite
>({})
