import { Type, type Static, type TUnsafe, TProperties } from '@sinclair/typebox'
import { type Id, Metadata } from './common/index.js'
import * as Generic from './Generic.js'

import { type TAssetCollection } from './Assets.js'
import { type TAtlas } from './Atlas.js'
import {
	type TDelveSiteDomain,
	type TDelveSiteTheme,
	type TDelveSite
} from './DelveSites.js'
import { type MoveCategory } from './Moves.js'
import { type TNpcCollection } from './Npcs.js'
import { type TOracleTablesCollection } from './oracles/OracleCollection.js'
import { type TRarity } from './Rarities.js'
import { type TRules } from './Rules.js'
import { type TTruth } from './Truths.js'
import * as Utils from './Utils.js'
import * as Rules from './Rules.js'
import { SourceInfo } from './common/Metadata.js'
import { mapValues } from 'lodash-es'
import * as CONST from '../../scripts/const.js'

const datasworn_version = Utils.Computed(
	Type.Ref(Metadata.SemanticVersion, {
		description: 'The version of the Datasworn format used by this data.'
	})
)

const RulesPackageMetaProps = {
	datasworn_version,
	...mapValues(Type.Required(Type.Omit(SourceInfo, ['page'])).properties, (v) =>
		Utils.SourceOptional(v)
	)
}

export const Ruleset = Type.Object(
	{
		// ruleset ID isn't optional in source, so we don't flag it with IdentifiedNode
		id: Type.Ref<typeof Id.RulesetId>('RulesetId'),
		package_type: Type.Literal('ruleset'),
		...RulesPackageMetaProps,
		rules: Utils.SourceOptional(Type.Ref<TRules>('Rules')),
		oracles: Utils.SourceOptional(
			Generic.Dictionary(
				Type.Ref<TOracleTablesCollection>('OracleTablesCollection'),
				{
					default: undefined,
					description:
						'A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.'
				}
			)
		),
		moves: Utils.SourceOptional(
			Generic.Dictionary(Type.Ref<TUnsafe<MoveCategory>>('MoveCategory'), {
				default: undefined,
				description:
					'A dictionary object containing move categories, which contain moves.'
			})
		),
		assets: Utils.SourceOptional(
			Generic.Dictionary(Type.Ref<TAssetCollection>('AssetCollection'), {
				default: undefined,
				description:
					'A dictionary object containing asset collections, which contain assets.'
			})
		),
		atlas: Type.Optional(
			Generic.Dictionary(Type.Ref<TAtlas>('Atlas'), {
				default: undefined,
				description:
					'A dictionary object containing atlas collections, which contain atlas entries.'
			})
		),
		npcs: Type.Optional(
			Generic.Dictionary(Type.Ref<TNpcCollection>('NpcCollection'), {
				default: undefined,
				description:
					'A dictionary object containing NPC collections, which contain NPCs.'
			})
		),
		truths: Type.Optional(
			Generic.Dictionary(Type.Ref<TTruth>('Truth'), {
				default: undefined,
				description: 'A dictionary object of truth categories.'
			})
		),
		rarities: Type.Optional(
			Generic.Dictionary(Type.Ref<TRarity>('Rarity'), {
				default: undefined,
				description:
					'A dictionary object containing rarities, like those presented in Ironsworn: Delve.'
			})
		),
		delve_sites: Type.Optional(
			Generic.Dictionary(Type.Ref<TDelveSite>('DelveSite'), {
				default: undefined,
				description:
					'A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve'
			})
		),
		site_themes: Type.Optional(
			Generic.Dictionary(Type.Ref<TDelveSiteTheme>('DelveSiteTheme'), {
				default: undefined,
				description: 'A dictionary object containing delve site themes.'
			})
		),
		site_domains: Type.Optional(
			Generic.Dictionary(Type.Ref<TDelveSiteDomain>('DelveSiteDomain'), {
				default: undefined,
				description: 'A dictionary object containing delve site domains.'
			})
		)
	},
	{
		$id: 'Ruleset',
		description:
			'A standalone Datasworn package that describes its own ruleset.'
	}
)
export type Ruleset = Static<typeof Ruleset>

export const Expansion = Utils.Assign(
	[
		Type.Omit(Type.Partial(Ruleset), [
			'id',
			'package_type',
			'rules',
			'datasworn_version'
		]),
		Type.Object({
			id: Type.Ref<typeof Id.ExpansionId>('ExpansionId'),
			package_type: Type.Literal('expansion'),
			...RulesPackageMetaProps,
			ruleset: Type.Ref<typeof Id.RulesetId>('RulesetId'),
			rules: Type.Optional(Type.Ref(Rules.RulesExpansion))
		})
	],
	{
		description:
			'A Datasworn package that relies on an external package to provide its ruleset.',
		$id: 'Expansion'
	}
)
export type Expansion = Static<typeof Expansion>

export const RulesPackage = Utils.DiscriminatedUnion(
	[Ruleset, Expansion],
	'package_type',
	{
		description:
			'Describes game rules compatible with the Ironsworn tabletop role-playing game by Shawn Tomkin.',
		title: CONST.rootSchemaName,
		$id: CONST.rootSchemaName
	}
)
export type RulesPackage = Static<typeof RulesPackage>
