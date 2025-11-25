import { Type, type TRef, type TSchema } from '@sinclair/typebox'
import { DictKey } from '../common/Id.js'
import { $schema, DefsKey } from '../../scripts/const.js'
import type { JSONSchema7 } from 'json-schema'
import { Documentation } from '../common/Text.js'
import { JsonTypeDef, Typescript } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'

const validSchemaTypes = [
	'boolean',
	'integer',
	'number',
	'string',
	'null'
] satisfies JSONSchema7['type']

export function isValidTagSchema(schema: TSchema) {
	if (validSchemaTypes.includes(schema?.type)) return true
	// some IDs are union schemas, these are fine
	if (schema.$id?.endsWith('Id') || schema.$id?.endsWith('IdWildcard'))
		return true
	if ('enum' in schema) return true
	if ('const' in schema) return true
	if ('anyOf' in schema)
		return (schema.anyOf as TSchema[]).every(isValidTagSchema)

	return false
}

const TagSchemaInteger = Type.Object(
	{ type: Type.Const('integer') },
	{ title: 'TagSchemaInteger', additionalProperties: true }
)

const TagSchemaFloat = Type.Object(
	{
		type: Type.Const('number')
	},
	{ title: 'TagSchemaFloat', additionalProperties: true }
)

const TagSchemaStringEnum = Type.Object(
	{
		enum: Type.Array(Type.Ref(DictKey))
	},
	{ title: 'TagSchemaStringEnum', additionalProperties: true }
)

const TagSchemaIntegerEnum = Type.Object(
	{
		enum: Type.Array(Type.Integer())
	},
	{
		title: 'TagSchemaIntegerEnum',
		additionalProperties: true
	}
)

const TagSchemaBoolean = Type.Object(
	{
		type: Type.Const('boolean')
	},
	{
		description: 'Schema for a true or false value.',
		title: 'TagSchemaBoolean',
		additionalProperties: true
	}
)

const TagSchemaDataswornRef = Type.Object(
	{
		$ref: Type.Any()
		// this a placeholder value.
		// an enum is computed from all datasworn schemata at build time.
	},
	{ title: 'TagSchemaDataswornRef', additionalProperties: true }
)


// future additions - nested objects?

const schemaKeyBlacklist = [
	'$id',
	'$defs',
	'$schema',
	'definitions',
	'dependencies',
	'if',
	'then',
	'else',
	'allOf',
	'anyOf',
	'oneOf',
	'not',
	'additionalItems',
	'additionalProperties'
] as const satisfies (keyof JSONSchema7)[]

// set here to use as a forward reference
const TagSchemaId = 'TagSchema' as const

const TagSchemaObject = Type.Object(
	{
		type: Type.Const('object'),
		properties: Type.Record(DictKey, Type.Ref(TagSchemaId))
		//
	},
	{ title: 'TagSchemaObject', additionalProperties: true }
)

const TagSchemaArray = Type.Object(
	{
		type: Type.Const('array'),
		items: Type.Ref(TagSchemaId)
		//
	},
	{ title: 'TagSchemaArray', additionalProperties: true }
)


export const TagSchema = Type.Intersect(
	[
		Type.Union([
			TagSchemaDataswornRef as TSchema,
			// enumerations
			TagSchemaStringEnum,
			TagSchemaIntegerEnum,
			// primitives
			TagSchemaBoolean,
			TagSchemaInteger,
			TagSchemaFloat,
			// basic string schema intentionally omitted -- strings must be one of datasworn's subtypes or an enum.
			TagSchemaObject,
			TagSchemaArray
		]),
		Type.Ref($schema)
		// Type.Not(
		// 	Type.Record(
		// 		Type.Enum(Object.fromEntries(schemaKeyBlacklist.map((v) => [v, v]))),
		// 		Type.Any()
		// 	)
		// )
	],
	{
		$id: TagSchemaId,
		// TODO: JTD schema for JSON schema of JSON schema? :sob:
		[JsonTypeDef]: { schema: JtdType.Any() as any },
		// TODO: add json schema type stub lib as dependency; point at this type
		[Typescript]: (identifier: string, _schema: TSchema) =>
			`export type ${identifier} = Record<string, unknown>`,
		description:
			'JSON schema used to validate the tag data, with a mandatory description. Only a subset of all possible JSON schema are allowed, including references to some Datasworn types.',
		releaseStage: 'experimental',
		examples: [
			Type.Boolean({
				description: 'An example tag with a simple true/false value.'
			}),
			Type.Array(Type.Ref('OracleRollableIdWildcard'), {
				description:
					'An example tag with an array of oracle rollable ID wildcards.'
			})
		]
	}
)