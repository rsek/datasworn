import {
	Kind,
	Type,
	type ObjectOptions,
	type Static,
	type TObject
} from '@sinclair/typebox'
import { Computed } from '../Utils.js'
import { setDescriptions } from '../utils/typebox.js'
import { FlatIntersect } from '../utils/FlatIntersect.js'
import type { TAnyId } from '../common/Id.js'

const IdNodeBase = Type.Object({
	_id: Computed(Type.String()),
	_comment: Type.Optional(
		Type.String({
			description:
				'Implementation hints or other developer-facing comments on this node. These should be omitted when presenting the node for gameplay.'
		})
	)
})

export function IdNode<TBase extends TObject>(
	base: TBase,
	_id: TAnyId,
	options: ObjectOptions = {}
) {
	const enhancedBase = FlatIntersect(
		[IdNodeBase, Type.Object({ _id: Computed(_id) }), base],
		{
			[Kind]: 'Object',
			...options
		}
	)

	return setDescriptions(enhancedBase, {
		_id: 'The unique Datasworn ID for this node.'
	})
}
export type TIdNode<TBase extends TObject> = ReturnType<
	typeof IdNode<TBase>
> & { static: IdNode<Static<TBase>> }

export type IdNode<TBase extends object> = TBase & Static<typeof IdNodeBase>
