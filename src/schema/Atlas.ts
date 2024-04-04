import { Type, type Static } from '@sinclair/typebox'
import { Id } from './common/index.js'
import * as Generic from './Generic.js'
import { Cyclopedia } from './generic/Mixin.js'

export const AtlasEntry = Generic.RecursiveCollectable(
	Type.Ref(Id.AtlasEntryId),
	'atlas_entry',
	Cyclopedia,
	{
		$id: 'AtlasEntry',
		title: 'Atlas entry',
		description:
			'An atlas entry, like the Ironlands region entries found in classic Ironsworn.'
	}
)

export type TAtlasEntry = typeof AtlasEntry
export type AtlasEntry = Static<typeof AtlasEntry>

const AtlasBase = Generic.Collection(
	Type.Ref(Id.AtlasCollectionId),
	'atlas',
	Type.Ref(AtlasEntry),
	{}
)

export const AtlasCollection = Generic.RecursiveCollection(AtlasBase, {
	$id: 'AtlasCollection'
})

export type TAtlasCollection = typeof AtlasCollection
export type AtlasCollection = Static<typeof AtlasCollection>
