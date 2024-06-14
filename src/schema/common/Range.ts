import { Type, type Static } from '@sinclair/typebox'
import { FlatIntersect } from '../utils/FlatIntersect.js'
import { JsonTypeDef } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'
import { omit } from 'lodash-es'

// const IntegerRange = Type.Object({
// 	min: Type.Integer(),
// 	max: Type.Integer()
// })
// export type IntegerRange = Static<typeof IntegerRange>

const minOptions = {
	description: 'Low end of the dice range.',
	[JsonTypeDef]: {
		schema: JtdType.Int16()
	}
}
const maxOptions = {
	description: 'High end of the dice range.',
	[JsonTypeDef]: {
		schema: JtdType.Int16()
	}
}

const diceRangeOptions = {
	description:
		'Represents a range of dice roll results, bounded by `min` and `max` (inclusive).'
}

export const DiceRange = Type.Object(
	{
		min: Type.Integer(minOptions),
		max: Type.Integer(maxOptions)
	},
	{
		$id: 'DiceRange',
		...diceRangeOptions
	}
)
export type DiceRange = Static<typeof DiceRange>

export function StaticDiceRange(min: number, max: number) {
	return Type.Object(
		{
			min: Type.Const(min, omit(minOptions, ['description'])),
			max: Type.Const(max, omit(maxOptions, ['description']))
		},
		{
			title: 'DiceRangeStatic',
			...omit(diceRangeOptions, ['description'])
		}
	)
}