import {
	type SchemaOptions,
	type TRef,
	type TSchema,
	Type,
	CloneType
} from '@sinclair/typebox'
import {
	forEach,
	isEmpty,
	isNull,
	keyBy,
	mapValues,
	omit,
	omitBy,
	set
} from 'lodash-es'
import { type SetRequired, type SnakeCase } from 'type-fest'
import {
	CollectableType,
	NonCollectableType,
	type Rules,
	type TagRule
} from '../Rules.js'
import * as Player from '../common/Player.js'
import { UnionEnum } from './UnionEnum.js'
import { pascalCase } from './string.js'

export function generateRulesetSchemas(rulesPackage: string, rules: Rules) {
	const ConditionMeterKey = UnionEnum(
		Object.keys(rules.condition_meters),
		omit(CloneType(Player.ConditionMeterKey), 'examples', 'type')
	)

	const StatKey = UnionEnum(
		Object.keys(rules.stats),
		omit(CloneType(Player.StatKey), 'examples', 'type')
	)

	return {
		ConditionMeterKey,
		StatKey,
		...generateTagSchemas(rulesPackage, rules.tags)
	}
}

function generateTagSchema(
	rulesPackage: string,
	tagKey: string,
	tagRule: TagRule
): SetRequired<TSchema, '$id' | 'description'> {
	const $id = pascalCase(rulesPackage) + pascalCase(tagKey) + 'Tag'
	const { description } = tagRule
	const options = { description, $id } as SetRequired<
		SchemaOptions,
		'$id' | 'description'
	>

	switch (tagRule.value_type) {
		case 'boolean':
		case 'integer': {
			const base = Type[pascalCase(tagRule.value_type)]()
			return tagRule.array
				? Type.Array(base, options)
				: ({ ...base, ...options } as any)
		}
		case 'enum': {
			const base = UnionEnum(tagRule.enum)
			return tagRule.array
				? Type.Array(base, options)
				: ({ ...base, ...options } as any)
		}
		case 'move':
		case 'asset':
		case 'oracle_rollable':
		case 'atlas_entry':
		case 'npc':
		case 'delve_site':
		case 'delve_site_theme':
		case 'delve_site_domain':
		case 'truth':
		case 'rarity':
			return tagRule.wildcard
				? Type.Array(Type.Ref(pascalCase(tagRule.value_type) + 'WildcardId'), {
						description
				  })
				: (Type.Ref(pascalCase(tagRule.value_type) + 'Id', options) as any)
	}
}

const anyType = [...CollectableType.enum, ...NonCollectableType.enum]

function generateTagSchemas(
	rulesPackage: SnakeCase<string>,
	tags: Record<SnakeCase<string>, TagRule>
) {
	const allowedTagProperties = Object.fromEntries(
		anyType.map((k: CollectableType | NonCollectableType) => [
			k,
			{} as Record<SnakeCase<string>, TRef>
		])
	)

	const tagSchemas: Record<string, TSchema> = {}

	forEach(tags, (tag, tagKey) => {
		const schema = generateTagSchema(rulesPackage, tagKey, tag)
		tagSchemas[schema.$id] = schema
		const pushTo = isNull(tag.applies_to) ? anyType : tag.applies_to

		pushTo.forEach((objectType) =>
			set(
				allowedTagProperties,
				[objectType, tagKey].join('.'),
				Type.Optional(Type.Ref(schema))
			)
		)
	})

	const allowedTagSchemas = omitBy(
		keyBy(
			mapValues(allowedTagProperties, (v, k) =>
				Type.Object(v, {
					$id: `${pascalCase(rulesPackage)}${pascalCase(k)}Tags`,
					additionalProperties: true
				})
			),
			(v) => v.$id
		),
		(v) => isEmpty(v.properties)
	)

	const tagNamespacesSchema = keyBy(
		mapValues(allowedTagSchemas, (v, k) =>
			Type.Object(
				{ [rulesPackage]: Type.Optional(Type.Ref(v)) },
				{
					additionalProperties: true,
					$id: k.replace(pascalCase(rulesPackage), '')
				}
			)
		),
		(v) => v.$id
	)

	console.log(tagNamespacesSchema)

	return {
		...tagNamespacesSchema,
		...tagSchemas,
		...allowedTagSchemas
	}
}

// TODO: generate dummy schemas so the overrides can be inserted later

console.log(
	generateTagSchemas('sundered_isles', {
		cursed_version_of: {
			description: 'This oracle is the cursed version of another oracle.',
			applies_to: ['oracle_rollable'],
			value_type: 'oracle_rollable',
			wildcard: true
		},
		cursed_by: {
			description: 'This oracle has a cursed version.',
			applies_to: ['oracle_rollable'],
			value_type: 'oracle_rollable',
			wildcard: false
		}
	})
)
