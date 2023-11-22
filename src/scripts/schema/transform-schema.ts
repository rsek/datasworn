/**
 * Utilities for transforming the primary Datasworn schema into a schema for raw data entry.
 *
 * This variant schema allows several properties to be omitted. Any missing values are then generated and inserted when the JSON is compiled.
 */
import { TypeGuard, type TSchema, Type } from '@sinclair/typebox'
import { cloneDeep, mapValues } from 'lodash-es'
import { type TRoot } from '../../schema/datasworn/Root.js'
import {
	SetOptional,
	keysWithDefaults
} from '../../schema/datasworn/utils/typebox.js'

import JsonPointer from 'json-pointer'
import JSL from 'json-schema-library'
import { log } from '../utils/logger.js'
import { OptionalInSourceBrand } from '../../schema/datasworn/utils/generic.js'

// function recurseSchema(
// 	schema: TAnySchema | TAnySchema[],
// 	fn: (subschema: TAnySchema) => void
// ) {
// 	if (TypeGuard.TSchema(schema)) fn(schema)

// 	if (schema == null) return

// 	switch (true) {
// 		case Array.isArray(schema):
// 			return schema.map((subschema) => recurseSchema(subschema, fn))
// 		case TypeGuard.TIntersect(schema):
// 			return recurseSchema(schema.allOf, fn)
// 		case TypeGuard.TUnion(schema):
// 			return recurseSchema(schema.anyOf, fn)
// 		case Array.isArray(schema.oneOf):
// 			return recurseSchema(schema.oneOf, fn)
// 		case TypeGuard.TArray(schema): {
// 			if (Array.isArray(schema.items)) return recurseSchema(schema.items, fn)
// 		}
// 		case TypeGuard.TObject(schema):
// 			if (schema.patternProperties)
// 				recurseSchema(Object.values(schema.patternProperties), fn)

// 			if (schema.properties) recurseSchema(Object.values(schema.properties), fn)
// 	}
// }

export function prepareDistributableSchema(root: TRoot) {
	const rootSchema = cloneDeep(root)

	rootSchema.$defs = mapValues(rootSchema.$defs, (v) => prepareSchemaDef(v))

	const draft = new JSL.Draft07(rootSchema)
	// const pointersToDelete: string[] = []
	// const sorted: Record<string, unknown> = {}

	draft.eachSchema((schema) => {
		if (!('properties' in schema)) return

		const props = schema.properties as Record<string, { macro?: boolean }>

		for (const key in props) {
			if (Object.prototype.hasOwnProperty.call(props, key)) {
				const element = props[key]

				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				if (element.macro) delete props[key]
			}
		}
	})

	return draft.getSchema()
}

function mapSubschemas<T extends TSchema>(
	schema: T,
	fn: (schema: TSchema, pointer: string) => TSchema
): T {
	const draft = new JSL.Draft07(cloneDeep(schema))

	const subschemaGetter = JsonPointer(schema)

	const updatedSchemas = new Map<string, TSchema>()

	draft.eachSchema((_, pointer) => {
		if (pointer === '#') return
		const hasPointer = subschemaGetter.has(pointer)
		if (!hasPointer) return log.info(`couldn't find pointer: ${pointer}`)
		const subschema = subschemaGetter.get(pointer)
		const updatedSubschema = fn(subschema, pointer)
		updatedSchemas.set(pointer, updatedSubschema)
	})

	for (const [pointer, subschema] of updatedSchemas) {
		subschemaGetter.set(pointer, subschema)
	}

	return schema
}

export function prepareInputSchema(root: TRoot) {
	const rootSchema = cloneDeep(root)

	for (const [k, v] of Object.entries(rootSchema.$defs)) v.title = k

	const newSchema = mapSubschemas(root, (subschema, pointer) =>
		prepareInputSchemaDef(prepareSchemaDef(subschema), pointer)
	)

	return newSchema
}

/** Mutates schema */
function prepareSchemaDef(schema: TSchema) {
	// these are redundant once we have a $defs object
	if (!(schema.$id as string)?.startsWith('http')) delete schema.$id

	if (TypeGuard.TObject(schema)) schema.additionalProperties ||= false

	return schema
}

/** Mutates schema */
function prepareInputSchemaDef(schema: TSchema, pointer: string) {
	// skip the root schema
	const defKey = pointer.split('/').pop()

	if (!schema.$id?.startsWith('http')) {
		if (TypeGuard.TObject(schema)) {
			// const propsBefore = schema.required
			schema = SetOptional(schema, [...keysWithDefaults(schema)])

			if ((schema as any)[OptionalInSourceBrand] === 'OptionalInSource') {
				console.log(schema)
				schema = Type.Optional(schema)
			}

			// const propsAfter = schema.required

			// console.log(schema.title, propsBefore, propsAfter)
		}
	}

	// if (defKey === 'DelveSiteDomain') console.log(schema)

	return schema
}
