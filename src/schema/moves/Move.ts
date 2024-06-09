import * as Utils from '../Utils.js'
import { MoveActionRoll, MoveNoRoll } from './ActionRoll.js'
import { MoveProgressRoll, MoveSpecialTrack } from './ProgressRoll.js'
import { moveDiscriminator } from './utils.js'

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
