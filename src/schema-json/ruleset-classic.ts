import { type JSONSchemaType as Schema } from 'ajv'
import _ from 'lodash'
import { refSchema } from './common'
import type * as Types from '@base-types'

export const ConditionMeterAlias: Schema<Types.RulesetClassic.ConditionMeterAlias> =
	{
		type: 'string',
		description:
			'Tags used to group  non-player condition meters (for e.g. companions and vehicles) that are referenced by moves and other assets.',
		enum: ['companion_health', 'attached_asset_meter']
	}

export const ProgressType: Schema<Types.RulesetClassic.ProgressType> = {
	type: 'string',
	description:
		'Standard progress track types found in Ironsworn or Ironsworn: Delve',
	enum: [
		'combat_progress',
		'vow_progress',
		'scene_challenge_progress',
		'journey_progress',
		'delve_progress',
		'bonds_progress'
	]
}

export const SuggestionsBase: Schema<Types.Metadata.SuggestionsBase> = {
	description: 'Related items that can be presented as useful shortcuts.',
	type: 'object',
	additionalProperties: false,
	properties: {
		assets: {
			title: 'Suggested assets',
			type: 'array',
			items: refSchema<Types.Assets.AssetID>('AssetID'),
			nullable: true
		},
		moves: {
			title: 'Suggested moves',
			type: 'array',
			items: refSchema<Types.Moves.MoveID>('MoveID'),
			nullable: true
		},
		oracles: {
			title: 'Suggested oracle tables',
			type: 'array',
			items: refSchema<Types.Oracles.OracleTableID>('OracleTableID'),
			nullable: true
		}
	}
}

export const Suggestions = _.merge({}, SuggestionsBase, {
	properties: {
		regions: {
			title: 'Suggested regions',
			type: 'array',
			items: refSchema<Types.Regions.RegionEntry>('RegionEntryID')
		},
		encounters: {
			title: 'Suggested encounters',
			type: 'array',
			items:
				refSchema<Types.Encounters.EncounterClassicID>('EncounterClassicID')
		},
		site_themes: {
			title: 'Suggested delve site themes',
			type: 'array',
			items: refSchema<Types.DelveSites.DelveSiteThemeID>('DelveSiteThemeID')
		},
		site_domains: {
			title: 'Suggested delve site domains',
			type: 'array',
			items: refSchema<Types.DelveSites.DelveSiteDomainID>('DelveSiteDomainID')
		}
	}
})

export const WorldTruthID: Schema<Types.Truths.TruthID> = {
	type: 'string',
	pattern: /^[a-z0-9][a-z0-9_]+\/world_truths\/[a-z][a-z_]*[a-z]$/.source,
	examples: ['ironsworn/world_truths/iron']
}
export const WorldTruth: Schema<Types.Truths.WorldTruth> = {
	type: 'object',
	required: ['_id', 'name', 'source'],
	properties: {
		_id: refSchema<Types.Truths.TruthID>('WorldTruthID'),
		name: refSchema<Types.Localize.Label>('Label'),
		icon: refSchema<Types.Metadata.Icon>('Icon'),
		suggestions: refSchema<Types.Metadata.SuggestionsBase>('Suggestions'),
		source: refSchema<Types.Metadata.Source>('Source'),
		choices: {
			type: 'array',
			minItems: 3,
			maxItems: 3,
			items: refSchema<Types.Truths.WorldTruthOption>('WorldTruthOption')
		}
	}
}

export const WorldTruthOptionID: Schema<Types.Truths.TruthID> = {
	type: 'string',
	pattern: /^[a-z0-9][a-z0-9_]+\/world_truths\/[a-z][a-z_]*[a-z]\/[0-2]$/
		.source,
	examples: ['ironsworn/world_truths/iron/0']
}
export const WorldTruthOption: Schema<Types.Truths.WorldTruthOption> = {
	type: 'object',
	required: ['_id', 'description', 'quest_starter'],
	properties: {
		_id: refSchema<Types.Truths.TruthID>('WorldTruthOptionID'),
		description:
			refSchema<Types.Localize.MarkdownParagraphs>('MarkdownParagraphs'),
		quest_starter:
			refSchema<Types.Localize.MarkdownParagraph>('MarkdownParagraph')
	}
}