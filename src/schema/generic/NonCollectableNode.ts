import {
	Type,
	type ObjectOptions,
	type TObject,
	type TString
} from '@sinclair/typebox'
import type TypeId from '../../pkg-core/IdElements/TypeId.js'
import { PrimaryTypeNode, type TPrimaryTypeNode } from './PrimaryTypeNode.js'
import { SourcedNode } from './SourcedNode.js'
import { pascalCase } from '../utils/string.js'
import { setSourceDataSchema } from '../Utils.js'

export const NonCollectableBrand = Symbol('NonCollectable')

export function NonCollectableNode<
	TBase extends TObject,
	TType extends TypeId.NonCollectable
>(base: TBase, type: TType, options: ObjectOptions = {}) {
	const $id = pascalCase(type)
	const _id = Type.Ref<TString>($id + 'Id')
	const enhancedBase = PrimaryTypeNode(base, type, {
		$id,
		[NonCollectableBrand]: 'NonCollectable',
		...options
	}) as TNonCollectableNode<TBase, TType>
	return setSourceDataSchema(enhancedBase, (schema) => ({
		...schema,
		additionalProperties: true
	}))
}
export type TNonCollectableNode<
	TBase extends TObject,
	TType extends TypeId.NonCollectable
> = TPrimaryTypeNode<TBase, TType> & { [NonCollectableBrand]: 'NonCollectable' }

export type NonCollectableNode<
	TBase extends object,
	TType extends TypeId.NonCollectable
> = PrimaryTypeNode<TBase, TType>
