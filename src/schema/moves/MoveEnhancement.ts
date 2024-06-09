import * as Utils from '../Utils.js'
import {
	MoveActionRollEnhancement,
	MoveNoRollEnhancement
} from './ActionRoll.js'
import {
	MoveProgressRollEnhancement,
	MoveSpecialTrackEnhancement
} from './ProgressRoll.js'
import { moveDiscriminator } from './utils.js'

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
