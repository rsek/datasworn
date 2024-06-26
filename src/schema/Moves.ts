import { Type, type Static } from '@sinclair/typebox'
import { Id } from './common/index.js'
import * as Generic from './Generic.js'
import {
	MoveActionRoll,
	MoveActionRollEnhancement,
	MoveNoRoll,
	MoveNoRollEnhancement,
	MoveProgressRoll,
	MoveProgressRollEnhancement,
	MoveSpecialTrack,
	MoveSpecialTrackEnhancement
} from './moves/index.js'
import * as Utils from './Utils.js'
import { moveDiscriminator } from './moves/utils.js'

// discriminated union of all moves
export const Move = Utils.DiscriminatedUnion(
	{
		action_roll: MoveActionRoll,
		no_roll: MoveNoRoll,
		progress_roll: MoveProgressRoll,
		special_track: MoveSpecialTrack
	},
	moveDiscriminator,
	{
		$id: 'Move',
		title: 'Move'
	}
)

export type Move =
	| MoveActionRoll
	| MoveNoRoll
	| MoveProgressRoll
	| MoveSpecialTrack

export const MoveEnhancement = Utils.DiscriminatedUnion(
	{
		action_roll: MoveActionRollEnhancement,
		no_roll: MoveNoRollEnhancement,
		progress_roll: MoveProgressRollEnhancement,
		special_track: MoveSpecialTrackEnhancement
	},
	moveDiscriminator,
	{
		$id: 'MoveEnhancement'
	}
)
export type TMoveEnhancement = typeof MoveEnhancement
export type MoveEnhancement =
	| MoveNoRollEnhancement
	| MoveActionRollEnhancement
	| MoveProgressRollEnhancement
	| MoveSpecialTrackEnhancement

export const MoveCategory = Generic.Collection(
	Type.Ref(Id.MoveCategoryId),
	'move_category',
	Type.Ref(Move),
	{},
	{ $id: 'MoveCategory' }
)
export type MoveCategory = Static<typeof MoveCategory>
export type TMoveCategory = typeof MoveCategory

export * from './moves/index.js'
