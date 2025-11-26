import {
	Type,
	type ObjectOptions,
	type Static,
	type TBoolean,
	type TLiteral,
	type TNull,
	type TRef,
	type TRefUnsafe
} from '@sinclair/typebox'
import * as Text from '../common/Text.js'
import { ExtractLiteralFromEnum } from '../utils/ExtractLiteralFromEnum.js'

import type { SetRequired } from 'type-fest'
import * as Generic from '../Generic.js'
import Id from '../common/Id.js'
import { EmbeddedOracleRollable } from '../oracles/EmbeddedOracleRollable.js'
import { FlatIntersect } from '../utils/FlatIntersect.js'
import type { TTrigger, TTriggerEnhancement, Trigger } from './Trigger.js'
import {
	MoveRollType,
	type MoveOutcomes,
	type TMoveOutcomes
} from './common.js'

/** The property key used to discriminate move subtypes */
export const moveDiscriminator = 'roll_type'

const MoveBase = Type.Object({
	replaces: Type.Optional(
		Type.Array(Type.Ref(Id.MoveIdWildcard), {
			description:
				'Indicates that this move replaces the identified moves. References to the replaced moves can be considered equivalent to this move.'
		})
	),
	text: Type.Ref(Text.MarkdownString, {
		description: 'The complete rules text of the move.'
	}),
	oracles: Type.Optional(
		Generic.Dictionary(
			Type.Ref(EmbeddedOracleRollable, { title: 'MoveOracleRollable' }),
			{ title: 'MoveOracles' }
		)
	)
})

export function Move<
	RollType extends MoveRollType,
	Trigger extends TRefUnsafe<TTrigger> | TRef<string>,
	Outcomes extends TRefUnsafe<TMoveOutcomes> | TRef<string> | TNull
>(
	rollType: RollType,
	trigger: Trigger,
	outcomes: Outcomes,
	options: SetRequired<ObjectOptions, '$id'>
) {
	let allow_momentum_burn: TLiteral<boolean> | TBoolean

	const description = 'Is burning momentum allowed for this move?'

	switch (rollType) {
		case 'action_roll':
			allow_momentum_burn = Type.Boolean({
				default: true,
				description
			})
			break
		default:
			allow_momentum_burn = Type.Literal(false, { default: false, description })
			break
	}

	const base = FlatIntersect([
		MoveBase,
		Type.Object({
			trigger: {
				title: 'Trigger',
				description: 'Trigger conditions for this move.',
				...trigger
			} as Trigger,
			allow_momentum_burn,
			outcomes: { title: 'MoveOutcomes', ...outcomes } as Outcomes
		})
	])

	return Generic.CollectableSubtypeNode(
		base,
		'move',
		moveDiscriminator,
		rollType,
		options
	)
}
export type TMove<
	RollType extends MoveRollType,
	MoveTrigger extends TRefUnsafe<TTrigger>,
	Outcomes extends TRefUnsafe<TMoveOutcomes> | TNull
> = ReturnType<typeof Move<RollType, MoveTrigger, Outcomes>>

export type Move<
	RollType extends MoveRollType,
	MoveTrigger extends Trigger,
	Outcomes extends MoveOutcomes | null
> = Generic.Collectable<
	Static<typeof MoveBase> & {
		[moveDiscriminator]: RollType
		trigger: MoveTrigger
		outcomes: Outcomes
		allow_momentum_burn: TLiteral<boolean> | TBoolean
	}
>

export function MoveEnhancement<
	RollType extends MoveRollType,
	Trigger extends TRefUnsafe<TTriggerEnhancement>
>(rollType: RollType, trigger: Trigger, options: ObjectOptions = {}) {
	const base = Type.Object({
		[moveDiscriminator]: ExtractLiteralFromEnum(MoveRollType, rollType, {
			description: `A move must have this \`${moveDiscriminator}\` to receive this enhancement. This is in addition to any other restrictions made by other properties.`
		}),
		trigger: Type.Optional(trigger)
	})

	return Generic.EnhanceMany(base, Type.Ref('AnyMoveIdWildcard'), {
		description:
			'An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.',
		...options
	})
}
export type MoveEnhancement<T extends MoveRollType, E> = Generic.EnhanceMany<{
	[moveDiscriminator]: T
	trigger?: E
}>
