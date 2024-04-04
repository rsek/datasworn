import { type KeywordDefinition } from 'ajv'
import { Keywords } from '../augmentations.js'

export const KEYWORDS: Record<string, Omit<KeywordDefinition, 'keyword'>> = {
	releaseStage: {
		metaSchema: Keywords.releaseStage
	},
	i18n: {
		type: 'string',
		metaSchema: Keywords.i18n
	},
	remarks: {
		metaSchema: Keywords.remarks
	}
}