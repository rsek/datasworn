import { type Static, Type, type TSchema } from '@sinclair/typebox'
import * as CONST from '../scripts/const.js'

import { Expansion, Ruleset, RulesPackage, Version } from './RulesPackages.js'
import { RootObject, SourceRootObject } from './root/Root.js'
import Defs from './Defs.js'

import {
	Asset,
	DelveSite,
	DelveSiteDomain,
	DelveSiteTheme,
	Metadata,
	Npc,
	OracleRollable,
	Rarity,
	Move
} from './index.js'
import * as Utils from './Utils.js'
import { RulesetId } from './common/Id.js'

const RootObjectMixin = Type.Object(
	{
		datasworn_version: Version,
		ruleset: Type.Ref(RulesetId)
	},
	{ additionalProperties: true }
)

const StandaloneNode = Type.Intersect([
	Utils.DiscriminatedUnion(
		{
			asset: Asset,
			npc: Npc,
			move: Move,
			oracle_rollable: OracleRollable,
			// delve types
			delve_site: DelveSite,
			delve_site_theme: DelveSiteTheme,
			delve_site_domain: DelveSiteDomain,
			rarity: Rarity
		},
		'type'
	),
	RootObjectMixin
])

// this isn't friendly to JTD, but currently the source schema isn't processed for JTD anyways
const SourceRoot = Type.Union([Type.Ref(RulesPackage), StandaloneNode], {
	$id: 'SourceRoot',
	description:
		'The root object for a Datasworn source file, whose schema is discriminated by the `type` property. Unlike the JSON schema for distribution, this may be a standalone object (Asset, Npc, Move, OracleRollable, DelveSite, DelveSiteTheme, DelveSiteDomain, or Rarity), but it still must specify its `ruleset` and `datasworn_version`.'
})

export const DataswornSchema = RootObject(Type.Ref(RulesPackage), {
	$schema: CONST.$schema,
	$id: CONST.SCHEMA_ID,
	title: `Datasworn v${CONST.VERSION}`,
	description:
		'Describes game rules compatible with the Ironsworn tabletop role-playing game by Shawn Tomkin.',
	[CONST.DefsKey]: Defs
})

export const DataswornSourceSchema = SourceRootObject(Type.Ref(SourceRoot), {
	$schema: CONST.$schema,
	$id: CONST.SOURCE_SCHEMA_ID,
	title: `DataswornSource v${CONST.VERSION}`,
	description:
		'Source data schema for Datasworn, which describes game rules compatible with the Ironsworn tabletop roleplaying game by Shawn Tomkin.\n\nThe source data omits IDs, and makes properties that provide a default value optional; these values are inserted during validation/processing to produce the JSON for distribution.',
	// additionalProperties: true,
	[CONST.DefsKey]: { SourceRoot, ...Defs }
})

export type DataswornSchema = Static<typeof DataswornSchema>
export type DataswornSourceSchema = Static<typeof DataswornSourceSchema>
