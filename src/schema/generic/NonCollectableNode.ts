import {
	type ObjectOptions,
	type TObject
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
	const enhancedBase = PrimaryTypeNode(base, type, {
		$id,
		[NonCollectableBrand]: 'NonCollectable',
		...options
	})
	return setSourceDataSchema(enhancedBase, (schema) => ({
		...schema,
		additionalProperties: true
	})) as unknown as TNonCollectableNode<TBase, TType>
}

/** Simplified type to avoid deep instantiation */
export type TNonCollectableNode<
	TBase extends TObject = TObject,
	TType extends TypeId.NonCollectable = TypeId.NonCollectable
> = TObject & { [NonCollectableBrand]: 'NonCollectable'; _type: TType; _base: TBase }

export type NonCollectableNode<
	TBase extends object,
	TType extends TypeId.NonCollectable
> = PrimaryTypeNode<TBase, TType>
