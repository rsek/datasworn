import {
	Type,
	type ObjectOptions,
	type Static,
	type TNull,
	type TRef,
	type TObject,
	type TLiteral
} from '@sinclair/typebox'
import { ExtractLiteralFromEnum } from '../utils/ExtractLiteralFromEnum.js'
import { Id, Localize } from '../common/index.js'
import {
	type TTrigger,
	type TTriggerEnhancement,
	type Trigger
} from './Trigger.js'
import {
	MoveRollType,
	type MoveOutcomes,
	type TMoveOutcomes
} from './common.js'
import * as Generic from '../Generic.js'
import * as Utils from '../utils/Assign.js'
import type { ObjectProperties } from '../utils/ObjectProperties.js'
import { EmbeddedOracleRollable } from '../oracles/EmbeddedOracleRollable.js'

/** The property key used to discriminate move subtypes */
export const moveDiscriminator = 'roll_type'

const MoveBase = Type.Object({
	replaces: Type.Optional(
		Type.Ref(Id.MoveId, {
			description:
				'Indicates that this move replaces the identified move. References to the replaced move can be considered equivalent to this move.'
		})
	),
	text: Type.Ref(Localize.MarkdownString, {
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
	Trigger extends TRef<TTrigger>,
	Outcomes extends TRef<TMoveOutcomes> | TNull
>(rollType: RollType, trigger: Trigger, outcomes: Outcomes, options = {}) {
	const base = Utils.Assign([
		MoveBase,
		Type.Object({
			[moveDiscriminator]: ExtractLiteralFromEnum(MoveRollType, rollType),
			trigger: {
				title: 'Trigger',
				description: 'Trigger conditions for this move.',
				...trigger
			} as Trigger,
			outcomes: { title: 'MoveOutcomes', ...outcomes } as Outcomes
		})
	]) as TObject<
		ObjectProperties<typeof MoveBase> & {
			[moveDiscriminator]: TLiteral<RollType>
			trigger: Trigger
			outcomes: Outcomes
		}
	>
	return Generic.Collectable(Type.Ref(Id.MoveId), 'move', base, options)
}
export type TMove<
	RollType extends MoveRollType,
	MoveTrigger extends TRef<TTrigger>,
	Outcomes extends TRef<TMoveOutcomes> | TNull
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
	}
>

export function MoveEnhancement<
	RollType extends MoveRollType,
	Trigger extends TRef<TTriggerEnhancement>
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