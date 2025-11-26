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
	})

	return setSourceDataSchema(enhancedBase, (schema: TObject) => ({
		...CloneType(schema),
		additionalProperties: true
	})) as unknown as TCollectableNode<TBase, TType>
}

/** Simplified type to avoid deep instantiation - uses TObject as base */
export type TCollectableNode<
	TBase extends TObject = TObject,
	TType extends TypeId.Collectable = TypeId.Collectable
> = TObject & TCollectableBranded<TObject> & { _type: TType; _base: TBase }

export type CollectableNode<
	TBase extends object,
	TType extends TypeId.Collectable
> = PrimaryTypeNode<TBase, TType>

/** Simplified type to avoid deep instantiation */
export type TCollectableSubtypeNode<
	TBase extends TObject = TObject,
	TType extends TypeId.Collectable = TypeId.Collectable,
	TSubtypeKey extends string = string,
	TSubtype extends string = string
> = TCollectableNode<TBase, TType> & { _subtypeKey: TSubtypeKey; _subtype: TSubtype }

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
	})

	return setSourceDataSchema(enhancedBase, (schema: TObject) => ({
		...CloneType(schema),
		additionalProperties: true
	})) as unknown as TCollectableSubtypeNode<TBase, TType, TSubtypeKey, TSubtype>
}
