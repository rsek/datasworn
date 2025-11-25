import {
	Type,
	type Static,
	type TRef,
	type TRefUnsafe,
	type TString,
	type TUnion
} from '@sinclair/typebox'

import ids from '../../builders/IdBuilder.js'
import Pattern from '../../pkg-core/IdElements/Pattern.js'
import { JsonTypeDef } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'

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

export const RulesPackageId = Type.Union(
	[Type.Ref(RulesetId), Type.Ref(ExpansionId)],
	{
		$id: 'RulesPackageId',
		[JsonTypeDef]: { schema: JtdType.String() }
	}
)

export const DictKey = Type.String({
	$id: 'DictKey',
	pattern: Pattern.DictKey.source,
	description: 'A `snake_case` key used in a Datasworn dictionary object.',
	remarks:
		"If you need to generate a key from a user-provided label, it's recommended to use a 'slugify' function/library, e.g. https://www.npmjs.com/package/slugify for NodeJS."
})
export type DictKey = Static<typeof DictKey>

const Id = {
	RulesetId,
	ExpansionId,
	RulesPackageId,
	DictKey,
	...ids
} as const

export default Id

export type TAnyId =
	| TRef<string>
	| TRefUnsafe<TString>
	| TRefUnsafe<TString | TUnion<TRef<string>[]>>
	| TUnion<TRef<string>[]>
