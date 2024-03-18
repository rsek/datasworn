import { type TSchema, TypeGuard } from '@sinclair/typebox'

/** Mutates schema. */
export function NiceSchema(schema: TSchema) {
	if (TypeGuard.IsObject(schema)) schema.additionalProperties ||= false


	// if (!schema.title && !('$ref' in schema)) {
	// 	console.log(schema)
	// 	throw new Error(
	// 		"Couldn't infer a title for this schema, please set it manually."
	// 	)
	// }

	return schema
}
