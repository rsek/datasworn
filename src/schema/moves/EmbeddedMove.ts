import { mapValues } from 'lodash-es'
import { Mapping } from '../Symbols.js'
import { pascalCase } from '../utils/string.js'
import { EmbeddedPrimaryNode } from '../utils/EmbeddedNode.js'
import { DiscriminatedUnion } from '../Utils.js'
import type { Static } from '@sinclair/typebox'
import { Move } from './Move.js'

const moveMapping = mapValues(Move[Mapping], (schema, k) =>
	EmbeddedPrimaryNode(schema, [], { $id: `Embedded${pascalCase(k)}Move` })
)

export const {
	action_roll: EmbeddedActionRollMove,
	no_roll: EmbeddedNoRollMove,
	progress_roll: EmbeddedProgressRollMove,
	special_track: EmbeddedSpecialTrackMove
} = moveMapping

export const EmbeddedMove = DiscriminatedUnion(moveMapping, 'roll_type', {
	$id: 'EmbeddedMove'
})

export type EmbeddedMove = Static<typeof EmbeddedMove>
