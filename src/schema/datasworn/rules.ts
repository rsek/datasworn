import { type Static, Type } from '@sinclair/typebox'
import { Localize, Abstract, Inputs, ID } from './common/index.js'

export const StatRule = Type.Object(
	{
		name: Type.Ref(Localize.Label),
		description: Type.Ref(Localize.MarkdownString)
	},
	{ $id: '#/$defs/StatRule' }
)
export type StatRule = Static<typeof StatRule>

export const ConditionMeterRule = Type.Composite(
	[
		Type.Object({
			name: Type.Ref(Localize.Label),
			description: Type.Ref(Localize.MarkdownString),
			shared: Type.Boolean()
		}),
		Type.Omit(Inputs.MeterBase, ['value'])
	],
	{ $id: '#/$defs/ConditionMeterRule' }
)
export type ConditionMeterRule = Static<typeof ConditionMeterRule>

export const ImpactRule = Type.Object(
	{
		name: Type.Ref(Localize.Label),
		description: Type.Ref(Localize.MarkdownString),
		shared: Type.Boolean(),
		prevents_recovery: Type.Array(Type.Ref(ID.DictKey)),
		permanent: Type.Boolean()
	},
	{ $id: '#/$defs/ImpactRule' }
)
export type Impact = Static<typeof ImpactRule>

export const ImpactCategory = Type.Object(
	{
		name: Type.Ref(Localize.Label),
		description: Type.Ref(Localize.MarkdownString),
		contents: Abstract.Dictionary(Type.Ref(ImpactRule))
	},

	{
		$id: '#/$defs/ImpactCategory'
	}
)
export type ImpactCategory = Static<typeof ImpactCategory>

export const SpecialTrackRule = Type.Object(
	{
		name: Type.Ref(Localize.Label),
		description: Type.Ref(Localize.MarkdownString),
		shared: Type.Boolean(),
		optional: Type.Boolean()
	},
	{ $id: '#/$defs/SpecialTrackRule' }
)
export type SpecialTrackRule = Static<typeof SpecialTrackRule>

export const Rules = Type.Object(
	{
		stats: Abstract.Dictionary(Type.Ref(StatRule)),
		condition_meters: Abstract.Dictionary(Type.Ref(ConditionMeterRule)),
		impacts: Abstract.Dictionary(Type.Ref(ImpactCategory)),
		special_tracks: Abstract.Dictionary(Type.Ref(SpecialTrackRule))
	},
	{ $id: '#/$defs/Rules' }
)
export type Rules = Static<typeof Rules>

const classic: Rules = {
	stats: {
		edge: {
			name: 'edge',
			description: 'Quickness, agility, and prowess in ranged combat.'
		},
		heart: {
			name: 'heart',
			description: 'Courage, willpower, empathy, sociability, and loyalty.'
		},
		iron: {
			name: 'iron',
			description:
				'Physical strength, endurance, aggressiveness, and prowess in close combat.'
		},
		shadow: {
			name: 'shadow',
			description: 'Sneakiness, deceptiveness, and cunning.'
		},
		wits: {
			name: 'wits',
			description: 'Expertise, knowledge, and observation.'
		}
	},
	condition_meters: {
		health: {
			name: 'health',
			description:
				'Health represents your current physical condition and stamina.',
			min: 0,
			max: 5,
			shared: false
		},
		spirit: {
			name: 'spirit',
			description: 'Spirit is your current mental state.',
			min: 0,
			max: 5,
			shared: false
		},
		supply: {
			name: 'supply',
			shared: true,
			description:
				'Supply is an abstract representation of your preparedness, including ammo, food, water, and general upkeep.',
			min: 0,
			max: 5
		}
	},
	impacts: {
		conditions: {
			name: 'conditions',
			description:
				'As with all debilities, conditions impact your max momentum and momentum reset. In addition, if you are wounded, shaken, or unprepared, you cannot increase the associated track.',
			contents: {
				wounded: {
					name: 'wounded',
					description:
						'You are severely injured and need treatment to recover.',
					shared: false,
					permanent: false,
					prevents_recovery: ['health']
				},
				shaken: {
					name: 'shaken',
					description:
						'You are despairing or distraught, and need comfort to recover.',
					shared: false,
					permanent: false,
					prevents_recovery: ['spirit']
				},
				unprepared: {
					name: 'unprepared',
					description:
						'You and your allies have exhausted their supplies, and must gather provisions in a community to recover.',
					shared: true,
					permanent: false,
					prevents_recovery: ['supply']
				},
				encumbered: {
					name: 'encumbered',
					description: 'You are carrying excessive or cumbersome weight.',
					shared: false,
					permanent: false,
					prevents_recovery: []
				}
			}
		},
		banes: {
			name: 'banes',
			description:
				'Banes are permanent. They forever impact your character through the momentum penalty and—more importantly—through the narrative impact of being maimed or corrupted.',
			contents: {
				maimed: {
					name: 'maimed',
					description:
						'You have suffered a wound which causes you ongoing physical challenges, such as the loss of an eye or hand. Or, you bear horrific scars which serve as a constant reminder of your failures.',
					shared: false,
					permanent: true,
					prevents_recovery: []
				},
				corrupted: {
					name: 'corrupted',
					description:
						'Your experiences have left you emotionally scarred. You are at the threshold of losing yourself to darkness.',
					shared: false,
					permanent: true,
					prevents_recovery: []
				}
			}
		},
		burdens: {
			name: 'burdens',
			description:
				'Burdens are a result of life-changing experiences that leave you bound to quests. Clearing a burden can only be accomplished by resolving the quest.',
			contents: {
				cursed: {
					name: 'cursed',
					description:
						'Cursed is marked when you [Face Death] and return with a soul-bound quest. This burden can only be cleared by completing the quest.',
					shared: false,
					permanent: false,
					prevents_recovery: []
				},
				tormented: {
					name: 'tormented',
					description:
						'Tormented is marked when you [Face Desolation] and undertake a quest to prevent a dire future.',
					shared: false,
					permanent: false,
					prevents_recovery: []
				}
			}
		}
	},
	special_tracks: {
		bonds: {
			name: 'bonds',
			description:
				'As you build relationships and complete quests in the service of others, you create bonds by making the Forge a Bond move',
			shared: false,
			optional: false
		}
	}
}
