import path from 'node:path'
import type { RulesPackageConfig } from '../../schema/tools/build/index.js'
import {
	PKG_SCOPE_OFFICIAL,
	PKG_SCOPE_COMMUNITY,
	ROOT_SOURCE_DATA,
} from '../const.js'

export const IronswornClassic: RulesPackageConfig = {
	type: 'ruleset',
	paths: {
		source: path.join(ROOT_SOURCE_DATA, 'classic'),
	},
	id: 'classic',
	pkg: {
		name: 'ironsworn-classic',
		private: false,
		scope: PKG_SCOPE_OFFICIAL,
		keywords: ['ironsworn', 'datasworn', 'TTRPG'],
		authors: [
			{
				name: 'rsek',
				email: 'r.sekouri@gmail.com',
				url: 'https://github.com/rsek',
			},
		],
		description: 'Datasworn JSON data for the Ironsworn RPG.',
	},
}

export const IronswornClassicDelve: RulesPackageConfig = {
	type: 'expansion',
	paths: {
		source: path.join(ROOT_SOURCE_DATA, 'delve'),
	},
	id: 'delve',
	pkg: {
		name: 'ironsworn-classic-delve',
		private: false,
		scope: PKG_SCOPE_OFFICIAL,
		description: 'Datasworn JSON data for the Ironsworn: Delve expansion.',
		keywords: ['ironsworn', 'datasworn', 'TTRPG', 'delve', 'ironsworn-delve'],
		authors: [
			{
				name: 'rsek',
				email: 'r.sekouri@gmail.com',
				url: 'https://github.com/rsek',
			},
		],
	},
}

export const Starforged: RulesPackageConfig = {
	id: 'starforged',
	type: 'ruleset',
	paths: {
		source: path.join(ROOT_SOURCE_DATA, 'starforged'),
		assets: [
			path.join(ROOT_SOURCE_DATA, 'starforged', 'images'),
			path.join(ROOT_SOURCE_DATA, 'starforged', 'icons'),
		],
	},
	pkg: {
		name: 'starforged',
		private: false,
		scope: PKG_SCOPE_OFFICIAL,
		description: 'Datasworn JSON data for Ironsworn: Starforged.',
		keywords: ['ironsworn', 'datasworn', 'starforged', 'TTRPG'],
		authors: [
			{
				name: 'rsek',
				email: 'r.sekouri@gmail.com',
				url: 'https://github.com/rsek',
			},
		],
	},
}

export const SunderedIsles: RulesPackageConfig = {
	type: 'expansion',
	paths: {
		source: path.join(ROOT_SOURCE_DATA, 'sundered_isles'),
	},
	id: 'sundered_isles',
	pkg: {
		name: 'sundered-isles',
		private: true,
		scope: PKG_SCOPE_OFFICIAL,
		description:
			'Datasworn JSON data for the Starforged: Sundered Isles expansion.',
		keywords: [
			'ironsworn',
			'datasworn',
			'TTRPG',
			'starforged',
			'sundered-isles',
		],
		authors: [
			{
				name: 'rsek',
				email: 'r.sekouri@gmail.com',
				url: 'https://github.com/rsek',
			},
		],
	},
}

// Community content packages

export const Starsmith: RulesPackageConfig = {
	type: 'expansion',
	paths: {
		source: path.join(ROOT_SOURCE_DATA, 'starsmith'),
	},
	id: 'starsmith',
	pkg: {
		name: 'starsmith',
		private: true, // Don't publish to NPM yet
		scope: PKG_SCOPE_COMMUNITY,
		description:
			'Datasworn JSON data for Starsmith Expanded Oracles by Eric Bright.',
		keywords: [
			'ironsworn',
			'datasworn',
			'TTRPG',
			'starforged',
			'starsmith',
		],
		authors: [
			{
				name: 'Eric Bright',
				email: 'noreply@playeveryrole.com',
				url: 'https://playeveryrole.com/',
			},
		],
	},
}
