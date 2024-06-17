import { type Static } from '@sinclair/typebox'
import { OracleRollable } from './OracleRollable.js'
import { DiscriminatedUnion } from '../Utils.js'
import { EmbeddedPrimaryNode } from '../utils/EmbeddedNode.js'
import { Mapping } from '../Symbols.js'
import { mapValues } from 'lodash-es'
import { pascalCase } from '../utils/string.js'

const oracleRollableMapping = mapValues(OracleRollable[Mapping], (schema, k) =>
	EmbeddedPrimaryNode(schema, [], { $id: `EmbeddedOracle${pascalCase(k)}` })
)

export const {
	column_text: EmbeddedOracleColumnText,
	column_text2: EmbeddedOracleColumnText2,
	column_text3: EmbeddedOracleColumnText3,
	table_text: EmbeddedOracleTableText,
	table_text2: EmbeddedOracleTableText2,
	table_text3: EmbeddedOracleTableText3
} = oracleRollableMapping

export const EmbeddedOracleRollable = DiscriminatedUnion(
	oracleRollableMapping,
	'oracle_type',
	{ $id: 'EmbeddedOracleRollable' }
)

export type EmbeddedOracleRollable = Static<typeof EmbeddedOracleRollable>

// TODO: Ids for this.
