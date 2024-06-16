import { Type, type Static } from '@sinclair/typebox'
import { CollectionNode } from '../generic/CollectionNode.js'

export const MoveCategory = CollectionNode(Type.Object({}), 'move_category')
export type MoveCategory = Static<typeof MoveCategory>
export type TMoveCategory = typeof MoveCategory
