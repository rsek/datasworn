import { type Static, Type } from '@sinclair/typebox'

import * as Localize from '../common/Localize.js'

export const StatRule = Type.Object(
	{
		label: Type.Ref(Localize.Label, {
			description: 'A label for this stat.',
			examples: ['edge']
		}),
		description: Type.Ref(Localize.MarkdownString, {
			description: 'A description of this stat.',
			examples: ['Quickness, agility, and prowess when fighting at a distance.']
		})
	},
	{
		$id: 'StatRule',
		description: 'Describes a standard player character stat.'
	}
)
export type StatRule = Static<typeof StatRule>
