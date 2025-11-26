import {
	Hint,
	Kind,
	KindGuard,
	type TAny,
	type TAnySchema,
	type TArray,
	type TBoolean,
	type TInteger,
	type TLiteral,
	type TNull,
	type TNumber,
	type TObject,
	type TOptional,
	type TRecord,
	type TRef,
	type TSchema,
	type TString,
	type TThis,
	Type,
	TypeGuard
} from '@sinclair/typebox'
import type * as JTD from 'jtd'

import JtdType, {
	type Metadata,
	type TFields,
	type TStruct,
} from './typedef.js'

import { type JTDSchemaType, SomeJTDSchemaType } from 'ajv/dist/core.js'
import {
	cloneDeep,
	isInteger,
	isNumber,
	isString,
	isUndefined,
	mapValues,
	merge,
	omit,
	omitBy,
	pick,
	pickBy,
	isEqual,
	set,
	isNull,
} from 'lodash-es'
import * as Generic from '../../schema/Generic.js'
import * as Utils from '../../schema/Utils.js'
import type { TRoot } from '../../schema/root/Root.js'
import Log from '../utils/Log.js'
import {
	Discriminator,
	JsonTypeDef,
	Mapping,
	Members,
} from '../../schema/Symbols.js'
import * as Assets from '../../schema/Assets.js'
import { DefsKey, rootSchemaName } from '../const.js'

/** Extract metadata from a JSON schema for use in a JTD schema's `metadata` property */
export function extractMetadata<T extends TAnySchema>(jsonSchema: T) {
	const metadataKeys = [
		// general
		'description',
		'examples',
		// string
		'pattern',
		'format',
		// numeric
		'exclusiveMaximum',
		'exclusiveMinimum',
		'maximum',
		'minimum',
		'multipleOf',
		// array
		'uniqueItems',
		'minItems',
		'maxItems',
	]

	let metadata = pick(cloneDeep(jsonSchema), ...metadataKeys) as Metadata

	if (jsonSchema[JsonTypeDef]?.metadata)
		metadata = merge(metadata, omit(jsonSchema[JsonTypeDef].metadata))

	// @ts-ignore
	if (jsonSchema[Utils.EnumDescription]) {
		// console.log(jsonSchema)
		// @ts-ignore
		metadata.enumDescription = jsonSchema[Utils.EnumDescription]
		// @ts-ignore
		metadata.description = jsonSchema[Utils.Description]
	}

	if (Object.keys(metadata)?.length === 0) return undefined

	return metadata
}

export function setIdRef<T extends { _id: string }, R extends string>(
	schema: JTDSchemaType<T>,
	ref: R
) {
	type NewRef = { [P in R]: string }
	type RefRecord = typeof schema extends JTDSchemaType<T, infer U>
		? U & NewRef
		: NewRef
	return set(schema, 'properties._id.ref', ref) as unknown as JTDSchemaType<
		T & { _id: R },
		RefRecord
	>
}

export function toJtdEnum<
	U extends string[] | number[],
	T extends Utils.TUnionEnum<U>,
>(schema: T) {
	if (schema.enum.every(isString)) return JtdType.Enum(schema.enum)
	if (schema.enum.every(isInteger)) return JtdType.Uint8()

	throw new Error(`Unable to infer schema for enum: ${JSON.stringify(schema)}`)
}

/** Identifiers of all JTD schemas that are referenced */
export const refTracker = new Set<string>()

export function toJtdRef(schema: TRef | TThis): JTD.SchemaFormRef {
	const ref = schema.$ref.replace(`#/${DefsKey}/`, '')

	refTracker.add(ref)

	return JtdType.Ref(ref)
}

/** Transforms a Typebox array schema into JTD elements */
export function toJtdElements<U extends TSchema, T extends TArray<U>>(
	schema: T
) {
	const { items } = schema
	return JtdType.Array(toJtdForm(items as unknown as TConvertible) as TSchema)
}

/** Transform a Typebox object schema into JTD properties */
export function toJtdProperties<T extends TObject>(schema: T) {
	const fields = omitBy(
		mapValues(schema.properties, (subschema) => {
			if (Utils.TNullable(subschema))
				return JtdType.Nullable(toJtdForm(subschema.anyOf[0] as any) as TSchema)

			const base = toJtdForm(subschema as any) as TSchema

			if (TypeGuard.IsOptional(subschema)) return Type.Optional(base)

			return base
		}),
		isUndefined
	) as TFields

	const result = JtdType.Struct(fields)

	return result
}

/** Transform a Typebox record schema into JTD values */
export function toJtdValues<T extends TRecord<TString, U>, U extends TSchema>(
	schema: T
) {
	const [propertyPattern, value] = Object.entries(schema.patternProperties)[0]
	const unwrap = toJtdForm(value as unknown as TConvertible) as TSchema

	if (!unwrap)
		throw new Error(
			`Couldn't unwrap Record value schema: ${JSON.stringify(schema)}`
		)

	return JtdType.Record(unwrap, { propertyPattern })

	// FIXME: This is probably only safe for Dictionary-style patternProperties
}

export function toJtdSingleEnum(schema: TLiteral<string>) {
	if (typeof schema.const === 'number')
		throw new Error(`Got a number literal from ${schema.$id}`)

	return JtdType.Enum([schema.const])
}

export function toJtdDiscriminator<
	M extends Utils.TDiscriminatorMap<Utils.TDiscriminableish>,
	D extends string,
>(schema: Utils.TDiscriminatedUnion<M, D>) {
	const discriminator = schema[Discriminator] as string

	// console.log(schema.$id)
	// console.log(schema[Mapping])

	const oldMapping = schema[Mapping] as Record<string, TObject>
	const jtdMapping: Record<string, TStruct<TFields>> = {}

	for (const k in oldMapping)
		if (Object.prototype.hasOwnProperty.call(oldMapping, k)) {
			const subschema = oldMapping[k] as TObject
			jtdMapping[k] = {
				...omit(toJtdProperties(subschema), `properties.${discriminator}`),
				metadata: extractMetadata(subschema as TAnySchema),
			} as unknown as TStruct<TFields>
		}

	// const mapping = Object.fromEntries(
	// 	mapValues(oldMapping, (subschema) => [
	// 		subschema.properties[discriminator].const,
	// 		{
	// 			...omit(toJtdProperties(subschema), `properties.${discriminator}`),
	// 			metadata: extractMetadata(subschema)
	// 		}
	// 	])
	// )

	// console.log(discriminator, jtdMapping)
	return JtdType.Union(jtdMapping, discriminator)
}

type TConvertible =
	| TLiteral<string>
	| TString
	| TBoolean
	| TInteger
	| TObject
	| TNumber
	| Utils.TUnionEnum
	| TArray


function toJtdForm(
	schema: TConvertible | Utils.TNullable<TConvertible> | TOptional<TConvertible>
): JTD.Schema
function toJtdForm(schema: TNull): null
function toJtdForm(schema: TSchema): JTD.Schema | null {
	const metadata = extractMetadata(schema)

	if (schema[JsonTypeDef]?.schema != null)
		return merge(cloneDeep(schema[JsonTypeDef].schema), {
			metadata
		})

	let result: JTD.Schema

	switch (true) {
		case schema[JsonTypeDef]?.skip:
		case KindGuard.IsNull(schema):
			return null
		case Utils.TUnionEnum(schema):
			result = toJtdEnum(schema)
			break
		case KindGuard.IsAny(schema):
			result = JtdType.Any()
			break
		case KindGuard.IsLiteralString(schema):
			result = toJtdSingleEnum(schema as TLiteral<string>)
			break
		case KindGuard.IsString(schema):
			result = JtdType.String()
			break
		case KindGuard.IsLiteralBoolean(schema):
		case KindGuard.IsBoolean(schema):
			result = JtdType.Boolean()
			break
		case KindGuard.IsLiteralNumber(schema):
		case KindGuard.IsInteger(schema):
			result = JtdType.Int16()
			break
		case KindGuard.IsNumber(schema):
			Log.warn(
				'Received a number schema. Consider making it an integer instead.',
				schema
			)
			result = JtdType.Float32()
			break
		case KindGuard.IsThis(schema):
		case KindGuard.IsRef(schema):
			result = toJtdRef(schema as TThis | TRef)
			break
		case KindGuard.IsRecord(schema):
		case Generic.DictionaryBrand in schema:
			result = toJtdValues(schema as TRecord) as JTD.Schema
			break
		case KindGuard.IsArray(schema):
			result = toJtdElements(schema as TArray) as JTD.Schema
			break
		case KindGuard.IsObject(schema):
			result = toJtdProperties(schema as TObject)
			break
		case Utils.TDiscriminatedUnion(schema):
			result = toJtdDiscriminator(schema as Utils.TDiscriminatedUnion) as JTD.Schema
			break
		case KindGuard.IsUnion(schema) && schema[Hint] === 'Enum':
			result = JtdType.Enum(
				(schema.anyOf as TLiteral[]).map((item) => item.const as string),
				{
					enumDescription: Object.fromEntries(
						(schema.anyOf as TLiteral[]).map((item) => [item.const, item.description ?? ''])
					) as Record<string, string>
				}
			)
			break
		default:
			console.log(schema)
			throw new Error('No JTD transform available for JSON schema')
	}

	result = merge(result, { metadata: extractMetadata(schema) })

	// if (result[Kind] === 'TypeDef:Enum' && !result.metadata?.typescriptType) {
	// 	result.metadata ||= {}
	// 	result.metadata.typescriptType = result.enum
	// 		.map((item: string | number) => (isInteger(item) ? item : `'${item}'`))
	// 		.join(' | ')
	// }

	return result as any
}

export function toJtdRoot<T extends TRoot>(schemaRoot: T) {
	const defs = {} as Record<string, JTD.Schema | undefined>

	for (const k in schemaRoot[DefsKey]) {
		if (k === rootSchemaName) continue
		try {

			defs[k] = toJtdForm(schemaRoot[DefsKey][k] as TConvertible)
		} catch (err: any) {
      console.log(`${k}:`, schemaRoot[DefsKey][k])

						throw new Error(`Couldn't convert ${k}. ${err?.message ?? err}`)
		}
	}
	// HACK: not sure why this is getting omitted, there's a few places it could happen and i havent tracked it down yet

	// defs.SelectEnhancementFieldChoice = toJtdForm(
	// 	omit(Assets.SelectEnhancementFieldChoice, JsonTypeDef)
	// )

	const base = toJtdForm(schemaRoot[DefsKey][rootSchemaName] as TConvertible)

	if (typeof base === 'undefined')
		throw new Error(
			`Unable to infer JSON Typedef form for root schema "${rootSchemaName}".`
		)

	return {
		...(base as object),
		definitions: omitBy(defs, (v, k) => {
			if (v === null) {
				Log.info(`Skipping JTD for "${k}"`)
				return true
			}
			// if (!refTracker.has(k)) {
			// 	Log.info(`Orphaned definition "${k}" -- skipping`)
			// 	return true
			// }

			return false
		}),
	}
}

export { toJtdForm }
