import { type KeywordDefinition } from 'ajv'
import { Keywords } from '../augmentations.js'

const rollableTableLike = {
	/* type annotation omitted because it won't place nice with anyOf */
	// type: 'array'

	items: {
		type: 'object',
		properties: {
			min: {
				anyOf: [{ type: 'integer' }, { type: 'null' }]
			},
			max: {
				anyOf: [{ type: 'integer' }, { type: 'null' }]
			}
		}
	}
}

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
	},
	rollable: {
		...rollableTableLike,
		metaSchema: Keywords.rollable
	}
}