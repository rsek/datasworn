import { sourcedTransformer, transform } from './transformer.js'
import { mapValues } from 'lodash-es'
import { OracleCollection } from './oracles.js'
import { AssetCollection } from './assets.js'
import { MoveCategory } from './moves.js'
import { DelveSite, DelveSiteDomain, DelveSiteTheme } from './delve-site.js'
import { Rarity } from './rarities.js'
import { Truth } from './truths.js'
import { NpcCollection } from './npcs.js'
import { AtlasCollection } from './atlas.js'
import { VERSION } from '../scripts/const.js'
import type * as Datasworn from '../types/Datasworn.js'
import type * as DataswornSource from '../types/DataswornSource.js'

export const RulesPackage = sourcedTransformer<
	DataswornSource.RulesPackage,
	Datasworn.RulesPackage,
	null
>({
	datasworn_version: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return data?.datasworn_version ?? VERSION
	},
	rules: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return data.rules
	},
	oracles: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.oracles, (v, k) =>
			transform(v, k, data, OracleCollection)
		)
	},
	assets: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.assets, (v, k) =>
			transform(v, k, data, AssetCollection)
		)
	},
	moves: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.moves, (v, k) => transform(v, k, data, MoveCategory))
	},
	npcs: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.npcs, (v, k) => transform(v, k, data, NpcCollection))
	},
	truths: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.truths, (v, k) =>
			transform(v, k, { _id: `${data._id}/truths` }, Truth)
		)
	},

	atlas: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.atlas, (v, k) =>
			transform(v, k, data, AtlasCollection)
		)
	},
	rarities: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.rarities, (v, k) =>
			transform(v, k, { _id: `${data._id}/rarities` }, Rarity)
		)
	},
	delve_sites: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.delve_sites, (v, k) =>
			transform(v, k, { _id: `${data._id}/delve_sites` }, DelveSite)
		)
	},
	site_themes: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.site_themes, (v, k) =>
			transform(v, k, { _id: `${data._id}/site_themes` }, DelveSiteTheme)
		)
	},
	site_domains: function (
		this: DataswornSource.RulesPackage,
		data: DataswornSource.RulesPackage,
		key: string | number,
		parent: null
	) {
		return mapValues(data.site_domains, (v, k) =>
			transform(v, k, { _id: `${data._id}/site_domains` }, DelveSiteDomain)
		)
	}
})
