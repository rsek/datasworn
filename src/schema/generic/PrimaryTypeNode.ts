import {
	CloneType,
	Type,
	type ObjectOptions,
	type Static,
	type TArray,
	type TObject,
	type TOptional,
	type TRef,
	type TString
} from '@sinclair/typebox'
import type { SetRequired } from 'type-fest'
import type TypeId from '../../pkg-core/IdElements/TypeId.js'
import { Discriminable, type TDiscriminable } from '../Utils.js'
import { Label } from '../common/Localize.js'
import { CssColor, WebpImageUrl, SvgImageUrl } from '../common/Metadata.js'
import { Assign, FlatIntersect, type TAssign } from '../utils/FlatIntersect.js'
import { pascalCase } from '../utils/string.js'

import { SourcedNode, type TSourcedNode } from '../generic/SourcedNode.js'

const replacesDescription =
	'This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.'
const PrimaryNodeBase = Type.Object({
	replaces: Type.Optional(
		Type.Array(Type.String() as TString | TRef<TString>, {
			description: replacesDescription
		})
	),
	color: Type.Optional(
		Type.Ref(CssColor, {
			description: 'A thematic color associated with this node.'
		})
	),
	images: Type.Optional(
		Type.Array(
			Type.Ref(WebpImageUrl, {
				description: 'Extra images associated with this node.'
			})
		)
	),
	icon: Type.Optional(
		Type.Ref(SvgImageUrl, {
			description: 'An SVG icon associated with this collection.'
		})
	)
})

export function PrimaryTypeNode<
	TBase extends TObject,
	TType extends TypeId.Primary
>(base: TBase, type: TType, options: ObjectOptions = {}) {
	const _id = Type.Ref<TString>(pascalCase(type) + 'Id')

	const replaces = Type.Ref<TString>(pascalCase(type) + 'IdWildcard')

	const mixin = Assign(
		PrimaryNodeBase,
		Type.Object({
			replaces: Type.Optional(
				Type.Array(replaces, { description: replacesDescription })
			)
		})
	)

	const enhancedBase = Discriminable(Assign(mixin, base), 'type', type)

	return SourcedNode(enhancedBase, _id, options) as TPrimaryTypeNode<
		TBase,
		TType
	>
}

export type TPrimaryTypeNode<
	TBase extends TObject,
	TType extends TypeId.Primary
> = TSourcedNode<
	TDiscriminable<'type', TType, TAssign<typeof PrimaryNodeBase, TBase>>
> & { static: PrimaryTypeNode<Static<TBase>, TType> }

export type PrimaryTypeNode<
	TBase extends object,
	TType extends TypeId.Primary
> = SourcedNode<Discriminable<'type', TType, TBase>>

export function PrimarySubtypeNode<
	TBase extends TObject,
	TType extends TypeId.Primary,
	TSubtypeKey extends string,
	TSubtype extends string
>(
	base: TBase,
	type: TType,
	subtypeKey: TSubtypeKey,
	subtype: TSubtype,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const superType = PrimaryTypeNode(base, type)

	return Discriminable(
		superType,
		subtypeKey,
		subtype,
		options
	) as TPrimarySubtypeNode<TBase, TType, TSubtypeKey, TSubtype>
}
export type TPrimarySubtypeNode<
	TBase extends TObject,
	TType extends TypeId.Primary,
	TSubtypeKey extends string,
	TSubtype extends string
> = TDiscriminable<TSubtypeKey, TSubtype, TPrimaryTypeNode<TBase, TType>>
