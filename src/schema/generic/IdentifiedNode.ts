import type * as Id from '../common/Id.js'
import * as Utils from '../Utils.js'

import { type TObject, type ObjectOptions, Type } from '@sinclair/typebox'
import { setDescriptions } from '../utils/typebox.js'

export function IdentifiedNode<T extends TObject>(
	_id: Id.TAnyId,
	schema: T,
	options: ObjectOptions = {}
) {
	// console.log('BASE', schema)
	// const result =
	// 	// @ts-expect-error
	// 	Type.Object(
	// 		{ _id:ComputedProperty(id), ...CloneType(schema).properties },
	// 		options
	// 	) as TIdentifiedNode<T>
	// console.log('ADDED ID', result)
	const { description, $comment } = schema

	const result = Utils.Assign(
		[Type.Object({ _id: Utils.Computed(_id) }), schema],
		{
			description,
			$comment,
			...options
		}
	)

	return setDescriptions(result, {
		_id: 'The unique Datasworn ID for this item.'
	}) satisfies TIdentifiedNode<T>
}

export type TIdentifiedNode<T extends TObject> = TObject<
	T['properties'] & { _id: Utils.TComputed<Id.TAnyId> }
>
export type IdentifiedNode<T extends object = object> = T & { _id: string }
