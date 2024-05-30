import * as Utils from '../Utils.js'

export const ObjectType = Utils.UnionEnumFromRecord({
	// RulesPackages
	ruleset: '',
	rules_expansion: '',
	// Collections
	oracle_collection: '',
	asset_collection: '',
	move_category: '',
	npc_collection: '',
	atlas: '',

	// collectables
	oracle_rollable: '',
	// ...subtypes
	move: ''
	// ...subtypes

	// delve_site_theme
	// delve_site_domain
	// rarity
})
