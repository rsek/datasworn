import {
	CloneType,
	type SchemaOptions,
	type Static,
	type TObject,
	type TSchema,
	ObjectOptions
} from '@sinclair/typebox'

/** Symbol indicating that this property is computed at build time, and is therefore optional in DataswornSource */
export const ComputedPropertyBrand = Symbol('ComputedProperty')

type ComputedOptions<
	T extends TSchema,
	ParentObject extends TObject
> = SchemaOptions & {
	[ComputedPropertyBrand]:
		| 'ComputedProperty'
		| ComputedPropertyFn<T, ParentObject>
}

/** Create a schema that is computed at build time, and is therefore optional in DataswornSource */
// TODO: make it possible for this to supply a function that computes the property!
export function Computed<
	T extends TSchema,
	ParentObject extends TObject = TObject
>(
	schema: T,
	options: ComputedOptions<T, ParentObject> = {
		[ComputedPropertyBrand]: 'ComputedProperty'
	}
) {
	return CloneType(schema, {
		...options
	}) as TComputed<T, ParentObject>
}
export type TComputed<
	T extends TSchema,
	ParentObject extends TObject = TObject
> = T & {
	[ComputedPropertyBrand]:
		| 'ComputedProperty'
		| ComputedPropertyFn<T, ParentObject>
}

type ComputedPropertyFn<T extends TSchema, ParentObject extends TObject> = (
	object: Static<ParentObject>,
	property: string,
	pointer: string
) => Static<T>

/** Symbol indicating that this property is optional in DataswornSource */
export const SourceOptionalBrand = Symbol('SourceOptional')

/** Flags a schema as being optional in DataswornSource. Mutates the original schema.
 * @remarks Functionally similar to {@link Computed}, but with different semantics.
 */
export function setSourceOptional<T extends TSchema>(schema: T) {
	if (schema == null) return schema
	;(schema as TSourceOptional<T>)[SourceOptionalBrand] = 'SourceOptional'
	return schema as TSourceOptional<T>
}
export type TSourceOptional<T extends TSchema> = T & {
	[SourceOptionalBrand]: 'SourceOptional'
}

export const GetSourceDataSchema = Symbol('GetSourceDataSchema')

/** Provide an override value  */
export function setSourceDataSchema<
	T extends TSchema,
	SourceSchema extends TSchema
>(schema: T, sourceSchema: SourceSchema | ((schema: T) => SourceSchema)): T {
	// @ts-expect-error
	schema[GetSourceDataSchema] =
		typeof sourceSchema === 'function' ? sourceSchema : () => sourceSchema

	return schema as THasSourceSchema<T, SourceSchema>
}
export type THasSourceSchema<
	T extends TSchema = TSchema,
	SourceSchema extends TSchema = TSchema
> = T & { [GetSourceDataSchema]: (schema: T) => SourceSchema }