import { Type, type Static } from '@sinclair/typebox'
import { FlatIntersect } from '../utils/FlatIntersect.js'
import { JsonTypeDef } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'

// const IntegerRange = Type.Object({
// 	min: Type.Integer(),
// 	max: Type.Integer()
// })
// export type IntegerRange = Static<typeof IntegerRange>

export const DiceRange = Type.Object(
	{
		min: Type.Integer({
			description: 'Low end of the dice range.',
			[JsonTypeDef]: {
				schema: JtdType.Int16()
			}
		}),
		max: Type.Integer({
			description: 'High end of the dice range.',
			[JsonTypeDef]: {
				schema: JtdType.Int16()
			}
		})
	},
	{
		$id: 'DiceRange'
	}
)
export type DiceRange = Static<typeof DiceRange>
