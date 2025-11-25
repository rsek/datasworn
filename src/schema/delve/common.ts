import {
	CloneType,
	Type,
	type ObjectOptions,
	type TObject,
	type TString
} from '@sinclair/typebox'
import type TypeId from '../../pkg-core/IdElements/TypeId.js'
import { pascalCase } from '../utils/string.js'
import { Computed } from '../Utils.js'

export function EmbeddedType<
	TBase extends TObject,
	T extends TypeId.Embedding,
	T2 extends TypeId.EmbeddableIn<T>
>(
	base: TBase,
	parentTypeId: T,
	embeddedTypeId: T2,
	options: ObjectOptions = {}
) {
	const schemaName = pascalCase(parentTypeId) + pascalCase(embeddedTypeId)
	const idSchemaName = schemaName + 'Id'

	const schema = CloneType(base, options)

	schema.$id = schemaName
	schema.properties._id = Computed(Type.Ref(idSchemaName))


	// @ts-expect-error
	return schema as TObject<TBase['properties'] & { _id: TString }>
}
