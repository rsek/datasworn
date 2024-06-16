import { CloneType, type ObjectOptions, type TObject } from '@sinclair/typebox'
import type { SetRequired } from 'type-fest'
import type TypeId from '../../pkg-core/IdElements/TypeId.js'
import { setSourceDataSchema } from '../Utils.js'
import { pascalCase } from '../utils/string.js'
import {
	PrimarySubtypeNode,
	PrimaryTypeNode,
	type TPrimarySubtypeNode,
	type TPrimaryTypeNode
} from './PrimaryTypeNode.js'

export const CollectableBrand = Symbol('Collectable')

type TCollectableBranded<TBase extends TObject> = TBase & {
	[CollectableBrand]: 'Collectable'
}

export function CollectableNode<
	TBase extends TObject,
	TType extends TypeId.Collectable
>(base: TBase, type: TType, options: ObjectOptions = {}) {
	const $id = pascalCase(type)

	const enhancedBase = PrimaryTypeNode(base, type, {
		$id,
		...options,
		[CollectableBrand]: 'Collectable'
	}) as TCollectableNode<TBase, TType>

	return setSourceDataSchema(enhancedBase, (schema: TObject) => ({
		...CloneType(schema),
		additionalProperties: true
	}))
}
export type TCollectableNode<
	TBase extends TObject,
	TType extends TypeId.Collectable
> = TCollectableBranded<TPrimaryTypeNode<TBase, TType>>

export type CollectableNode<
	TBase extends object,
	TType extends TypeId.Collectable
> = PrimaryTypeNode<TBase, TType>

export type TCollectableSubtypeNode<
	TBase extends TObject,
	TType extends TypeId.Collectable,
	TSubtypeKey extends string,
	TSubtype extends string
> = TCollectableBranded<
	TPrimarySubtypeNode<TBase, TType, TSubtypeKey, TSubtype>
> &
	TCollectableNode<TBase, TType>

export function CollectableSubtypeNode<
	TBase extends TObject,
	TType extends TypeId.Collectable,
	TSubtypeKey extends string,
	TSubtype extends string
>(
	base: TBase,
	type: TType,
	subtypeKey: TSubtypeKey,
	subtype: TSubtype,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const enhancedBase = PrimarySubtypeNode(base, type, subtypeKey, subtype, {
		...options,
		[CollectableBrand]: 'Collectable'
	}) as TCollectableSubtypeNode<TBase, TType, TSubtypeKey, TSubtype>

	return setSourceDataSchema(enhancedBase, (schema: TObject) => ({
		...CloneType(schema),
		additionalProperties: true
	}))
}
