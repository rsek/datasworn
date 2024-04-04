import {
	CloneType,
	Type,
	type ObjectOptions,
	type TObject
} from '@sinclair/typebox'
import { SourcedNode, type TSourcedNode } from './SourcedNode.js'
import { type TAnyId } from '../common/Id.js'
import { setSourceDataSchema, type TDiscriminableBy } from '../Utils.js'

export const CollectableBrand = Symbol('Collectable')
export const RecursiveCollectableBrand = Symbol('RecursiveCollectable')
type CollectableID = TAnyId

export function Collectable<T extends TObject, V extends string>(
	_id: CollectableID,
	type: V,
	base: T,
	options: ObjectOptions = {}
) {
	const schema = CloneType(base, {
		properties: { ...base.properties, type: Type.Literal(type) }
	}) as unknown as TDiscriminableBy<T, 'type', V>

	return setSourceDataSchema(
		SourcedNode(_id, schema, {
			...options,
			[CollectableBrand]: 'Collectable'
		}),
		(schema) => ({ ...schema, additionalProperties: true })
	) as TCollectable<TDiscriminableBy<T, 'type', V>> satisfies TSourcedNode<
		TDiscriminableBy<T, 'type', V>
	>
}

export type Collectable<T extends object> = SourcedNode<T>

export type TCollectable<T extends TObject> = ReturnType<
	typeof SourcedNode<T>
> & {
	[CollectableBrand]: 'Collectable'
}
type RecursiveCollectableID = TAnyId

export function RecursiveCollectable<T extends TObject, V extends string>(
	_id: RecursiveCollectableID,
	type: V,
	base: T,
	options: ObjectOptions = {}
) {
	return Collectable(_id, type, base, {
		...options,
		[CollectableBrand]: 'Collectable',
		[RecursiveCollectableBrand]: 'RecursiveCollectable'
	}) as TRecursiveCollectable<
		TDiscriminableBy<T, 'type', V>
	> satisfies TCollectable<TDiscriminableBy<T, 'type', V>>
}

export type TRecursiveCollectable<T extends TObject> = ReturnType<
	typeof SourcedNode<T>
> &
	TCollectable<T> & {
		[RecursiveCollectableBrand]: 'RecursiveCollectable'
	}
