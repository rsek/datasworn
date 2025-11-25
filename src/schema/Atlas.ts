import { Type, type Static } from '@sinclair/typebox'
import * as Generic from './Generic.js'
import { Cyclopedia } from './generic/Mixin.js'

export const AtlasEntry = Generic.CollectableNode(Cyclopedia, 'atlas_entry', {
	description:
		'An atlas entry, like the Ironlands region entries found in classic Ironsworn.'
})

export type TAtlasEntry = typeof AtlasEntry
export type AtlasEntry = Static<typeof AtlasEntry>

export const AtlasCollection = Generic.CollectionNode(
	Type.Object({}),
	'atlas_collection'
)

export type TAtlasCollection = typeof AtlasCollection
/** Infer static type to avoid deep instantiation */
export type AtlasCollection = (typeof AtlasCollection)['static']
