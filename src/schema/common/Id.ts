import {
	Type,
	type Static,
	type TRef,
	type TString,
	type TUnion
} from '@sinclair/typebox'

import ids from '../../builders/IdBuilder.js'
import Pattern from '../../pkg-core/IdElements/Pattern.js'

export const RulesetId = Type.String({
	$id: 'RulesetId',
	examples: ['classic', 'starforged'],
	pattern: Pattern.RulesPackageId.source,
	description:
		'The ID of standalone Datasworn package that describes its own ruleset.'
})
export type RulesetId = Static<typeof RulesetId>

export const ExpansionId = Type.String({
	$id: 'ExpansionId',
	examples: ['delve', 'sundered_isles'],
	pattern: Pattern.RulesPackageId.source,
	description:
		'The ID of a Datasworn package that relies on an external package to provide its ruleset.'
})
export type ExpansionId = Static<typeof ExpansionId>

export const DictKey = Type.String({
	$id: 'DictKey',
	pattern: Pattern.DictKey.source,
	description: 'A `snake_case` key used in a Datasworn dictionary object.',
	remarks:
		"If you need to generate a key from a user-provided label, it's recommended to use a 'slugify' function/library, e.g. https://www.npmjs.com/package/slugify for NodeJS."
})
export type DictKey = Static<typeof DictKey>

export const AnyMoveIdWildcard = Type.Union(
	[Type.Ref(ids.MoveIdWildcard), Type.Ref(ids.AssetAbilityMoveIdWildcard)],
	{
		$id: 'AnyMoveIdWildcard'
	}
)
export type AnyMoveIdWildcard = string

const Ids = {
	RulesetId,
	ExpansionId,
	DictKey,
	AnyMoveIdWildcard,
	...ids
} as const

export default Ids

export type TAnyId = TRef<TString | TUnion<(TString | TRef<TString>)[]>>
