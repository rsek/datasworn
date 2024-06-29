import { Type, type Static, type TUnsafe } from '@sinclair/typebox'
import * as Generic from './Generic.js'
import { Localize, type Id } from './common/index.js'

import { mapValues } from 'lodash-es'
import * as CONST from '../scripts/const.js'
import { type TAssetCollection } from './Assets.js'
import { type TAtlasCollection } from './Atlas.js'
import {
	type TDelveSite,
	type TDelveSiteDomain,
	type TDelveSiteTheme
} from './DelveSites.js'
import { type TNpcCollection } from './Npcs.js'
import { type TRarity } from './Rarities.js'
import * as Rules from './Rules.js'
import { type TRules } from './Rules.js'
import { type TTruth } from './Truths.js'
import * as Utils from './Utils.js'
import { SourceInfo } from './common/Metadata.js'
import { type MoveCategory } from './moves/MoveCategory.js'
import { type TOracleTablesCollection } from './oracles/OracleCollection.js'
import { Assign } from './utils/FlatIntersect.js'

export const Version = Type.Literal(CONST.VERSION, {
	description: 'The version of the Datasworn format used by this data.',
	pattern:
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
			.source
})

const RulesPackageBase = Type.Object({
	_id: Type.Ref<typeof Id.RulesPackageId>('RulesPackageId'),
	type: Type.String(),
	// name: Utils.SourceOptional(Type.Ref(Localize.Label)),
	datasworn_version: Version,
	description: Type.Optional(Type.Ref(Localize.MarkdownString)),
	...mapValues(Type.Required(Type.Omit(SourceInfo, ['page'])).properties, (v) =>
		Utils.setSourceOptional(v)
	),
	oracles: Utils.setSourceOptional(
		Generic.Dictionary(
			Type.Ref<TOracleTablesCollection>('OracleTablesCollection'),
			{
				default: {},
				description:
					'A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.'
			}
		)
	),
	moves: Utils.setSourceOptional(
		Generic.Dictionary(Type.Ref<TUnsafe<MoveCategory>>('MoveCategory'), {
			default: {},
			description:
				'A dictionary object containing move categories, which contain moves.'
		})
	),
	assets: Utils.setSourceOptional(
		Generic.Dictionary(Type.Ref<TAssetCollection>('AssetCollection'), {
			default: {},
			description:
				'A dictionary object containing asset collections, which contain assets.'
		})
	),
	atlas: Type.Optional(
		Generic.Dictionary(Type.Ref<TAtlasCollection>('AtlasCollection'), {
			default: {},
			description:
				'A dictionary object containing atlas collections, which contain atlas entries.'
		})
	),
	npcs: Type.Optional(
		Generic.Dictionary(Type.Ref<TNpcCollection>('NpcCollection'), {
			default: {},
			description:
				'A dictionary object containing NPC collections, which contain NPCs.'
		})
	),
	truths: Type.Optional(
		Generic.Dictionary(Type.Ref<TTruth>('Truth'), {
			default: {},
			description: 'A dictionary object of truth categories.'
		})
	),
	rarities: Type.Optional(
		Generic.Dictionary(Type.Ref<TRarity>('Rarity'), {
			default: {},
			description:
				'A dictionary object containing rarities, like those presented in Ironsworn: Delve.'
		})
	),
	delve_sites: Type.Optional(
		Generic.Dictionary(Type.Ref<TDelveSite>('DelveSite'), {
			default: {},
			description:
				'A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve'
		})
	),
	site_themes: Type.Optional(
		Generic.Dictionary(Type.Ref<TDelveSiteTheme>('DelveSiteTheme'), {
			default: {},
			description: 'A dictionary object containing delve site themes.'
		})
	),
	site_domains: Type.Optional(
		Generic.Dictionary(Type.Ref<TDelveSiteDomain>('DelveSiteDomain'), {
			default: {},
			description: 'A dictionary object containing delve site domains.'
		})
	)
})

export const Ruleset = Assign(
	RulesPackageBase,
	Type.Object({
		_id: Type.Ref<typeof Id.RulesetId>('RulesetId'),
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
		_id: Type.Ref<typeof Id.ExpansionId>('ExpansionId'),
		type: Type.Literal('expansion'),
		ruleset: Type.Ref<typeof Id.RulesetId>('RulesetId'),
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
		title: CONST.rootSchemaName,
		$id: CONST.rootSchemaName
	}
)

export type RulesPackage = Static<typeof RulesPackage>
