import { Type, type Static } from '@sinclair/typebox'
import * as Generic from '../Generic.js'
import Id from '../common/Id.js'
import { Move } from './Move.js'

export const MoveCategory = Generic.Collection(
	Type.Ref(Id.MoveCategoryId),
	'move_category',
	Type.Ref(Move),
	{},
	{ $id: 'MoveCategory' }
)
export type MoveCategory = Static<typeof MoveCategory>
export type TMoveCategory = typeof MoveCategory
