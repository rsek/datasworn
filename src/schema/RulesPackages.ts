import { Type, type Static, type TUnsafe } from '@sinclair/typebox'
import * as Generic from './Generic.js'

import type Id from './common/Id.js'
import * as Text from './common/Text.js'

import { mapValues } from 'lodash-es'
import { VERSION, rootSchemaName } from '../scripts/const.js'
import type { TAssetCollection } from './Assets.js'
import type { TAtlasCollection } from './Atlas.js'
import type {
	TDelveSite,
	TDelveSiteDomain,
	TDelveSiteTheme
} from './DelveSites.js'
import type { TNpcCollection } from './Npcs.js'
import type { TRarity } from './Rarities.js'
import * as Rules from './Rules.js'
import type { TRules } from './Rules.js'
import type { TTruth } from './Truths.js'
import * as Utils from './Utils.js'
import { SourceInfo } from './common/Metadata.js'
import type { MoveCategory } from './moves/MoveCategory.js'
import type { TOracleTablesCollection } from './oracles/OracleCollection.js'
import { Assign } from './utils/FlatIntersect.js'

export const Version = Type.Literal(VERSION, {
	description: 'The version of the Datasworn format used by this data.',
	pattern:
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
			.source
})

const RulesPackageBase = Type.Object({
	_id: Type.Ref('RulesPackageId'),
	type: Type.String(),
	// name: Utils.SourceOptional(Type.Ref(Text.Label)),
	datasworn_version: Version,
	description: Type.Optional(Type.Ref(Text.MarkdownString)),
	...mapValues(Type.Required(Type.Omit(SourceInfo, ['page'])).properties, (v) =>
		Utils.setSourceOptional(v)
	),
	oracles: Utils.setSourceOptional(
		Generic.Dictionary(
			Type.Ref('OracleTablesCollection'),
			{
				description:
					'A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.'
			}
		)
	),
	moves: Utils.setSourceOptional(
		Generic.Dictionary(Type.Ref('MoveCategory'), {
			description:
				'A dictionary object containing move categories, which contain moves.'
		})
	),
	assets: Utils.setSourceOptional(
		Generic.Dictionary(Type.Ref('AssetCollection'), {
			description:
				'A dictionary object containing asset collections, which contain assets.'
		})
	),
	atlas: Type.Optional(
		Generic.Dictionary(Type.Ref('AtlasCollection'), {
			description:
				'A dictionary object containing atlas collections, which contain atlas entries.'
		})
	),
	npcs: Type.Optional(
		Generic.Dictionary(Type.Ref('NpcCollection'), {
			description:
				'A dictionary object containing NPC collections, which contain NPCs.'
		})
	),
	truths: Type.Optional(
		Generic.Dictionary(Type.Ref('Truth'), {
			description: 'A dictionary object of truth categories.'
		})
	),
	rarities: Type.Optional(
		Generic.Dictionary(Type.Ref('Rarity'), {
			description:
				'A dictionary object containing rarities, like those presented in Ironsworn: Delve.'
		})
	),
	delve_sites: Type.Optional(
		Generic.Dictionary(Type.Ref('DelveSite'), {
			description:
				'A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve'
		})
	),
	site_themes: Type.Optional(
		Generic.Dictionary(Type.Ref('DelveSiteTheme'), {
			description: 'A dictionary object containing delve site themes.'
		})
	),
	site_domains: Type.Optional(
		Generic.Dictionary(Type.Ref('DelveSiteDomain'), {
			description: 'A dictionary object containing delve site domains.'
		})
	)
})

export const Ruleset = Assign(
	RulesPackageBase,
	Type.Object({
		_id: Type.Ref('RulesetId'),
		type: Type.Literal('ruleset'),
		rules: Utils.setSourceOptional(Type.Ref(Rules.Rules))
	}),
	{
		$id: 'Ruleset',
		additionalProperties: true,
		description:
			'A standalone Datasworn package that describes its own ruleset.'
	}
)

export type Ruleset = Static<typeof Ruleset>

export const Expansion = Assign(
	Type.Omit(RulesPackageBase, ['rules']),
	Type.Object({
		_id: Type.Ref('ExpansionId'),
		type: Type.Literal('expansion'),
		ruleset: Type.Ref('RulesetId'),
		rules: Type.Optional(Type.Ref(Rules.RulesExpansion))
	}),
	{
		additionalProperties: true,

		description:
			'A Datasworn package that relies on an external package to provide its ruleset.',
		$id: 'Expansion'
	}
)
export type Expansion = Static<typeof Expansion>

export const RulesPackage = Utils.DiscriminatedUnion(
	{
		ruleset: Ruleset,
		expansion: Expansion
	},
	'type',
	{
		description:
			'Describes game rules compatible with the Ironsworn tabletop role-playing game by Shawn Tomkin.',
		title: rootSchemaName,
		$id: rootSchemaName
	}
)

export type RulesPackage = Static<typeof RulesPackage>
