type IdReplacementMap = Record<string, { old: RegExp; new: string }>

const moveIdPatterns = [
	// standard moves
	/(?<pkg>\*|[a-z][a-z0-9_]{3,})\/moves\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))/,
	// asset moves
	/(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>\*|[a-z][a-z_]*)\/(\*|[a-z][a-z_]*)\/abilities\/(\*|(?:0|[1-9][0-9]*))\/moves\/(?<key>\*|[a-z][a-z_]*)/
]

const key = /(?<key>[a-z][a-z_]*|\*)/
const recursiveCollectionPath =
	/(?<path>[a-z][a-z_]*(?:\/[a-z][a-z_]*){0,2}|\*{1,2})/

const pkg = /(?<pkg>[a-z][a-z0-9_]{3,}|\*)/
const recursivePath =
	/(?<path>[a-z][a-z_]*(?:\/(?:[a-z][a-z_]*|\*|\**)){0,2}|\*\*)/
const path = /(?<path>[a-z][a-z_]*|\*)/

const f: IdReplacementMap = {
	AssetMoveId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(?<index>\*|\d+)\/moves\/(?<key>\*|[a-z][a-z_]*)/,
		new: '$1/asset/$2.abilities/$3.moves/$4'
	},
	AssetAbilityId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(?<index>\*|\d+)/,
		new: '$1/asset/$2.abilities/$3'
	},

	NpcVariantId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/npcs\/(?<path>[a-z][a-z_]*\/[a-z][a-z_]*|\*{1,2})\/variants\/(?<key>[a-z][a-z_]*)/,
		new: '$1/npc/$2.variants/$3'
	},

	AssetCollectionId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/assets\/(?<path>[a-z_/*]+)/,
		new: '$1/asset_collection/$2'
	},
	AssetId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>[a-z_/*]+)/,
		new: '$1/asset/$2'
	},
	AtlasCollectionId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/atlas\/(?<path>[a-z_/*]+)/,
		new: '$1/atlas_collection/$2'
	},
	AtlasEntryId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/atlas\/(?<path>[a-z_/*]+)/,
		new: '$1/atlas_entry/$2'
	},
	DelveSiteDomainId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/site_domains\/(?<path>[a-z_/*]+)/,
		new: '$1/delve_site_domain/$2'
	},
	DelveSiteThemeId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/site_themes\/(?<path>[a-z_/*]+)/,
		new: '$1/delve_site_theme/$2'
	},
	DelveSiteId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/delve_sites\/(?<path>[a-z_/*]+)/,
		new: '$1/delve_site/$2'
	},
	MoveCategoryId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/moves\/(?<path>[a-z_/*]+)/,
		new: '$1/move_category/$2'
	},
	MoveId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/moves\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))/,
		new: '$1/move/$2'
	},

	NpcCollectionId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/npcs\/(?<path>[a-z_/*]+)/,
		new: '$1/npc_collection/$2'
	},
	NpcId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/npcs\/(?<path>[a-z_/*]+)/,
		new: '$1/npc/$2'
	},
	OracleCollectionId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/oracles\/(?<path>[a-z_/*]+)/,
		new: '$1/oracle_collection/$2'
	},
	OracleRollableId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/oracles\/(?<path>[a-z_/*]+)/,
		new: '$1/oracle_rollable/$2'
	},
	RarityId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/rarities\/(?<path>[a-z_/*]+)/,
		new: '$1/rarity/$2'
	},
	TruthId: {
		old: /(?<pkg>\*|[a-z][a-z0-9_]{3,})\/truths\/(?<path>[a-z_/*]+)/,
		new: '$1/truth/$2'
	} // TODO: truth table id pointer
}
