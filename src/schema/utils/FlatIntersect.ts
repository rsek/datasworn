import {
	Type,
	type ObjectOptions,
	type TObject,
	type TSchema,
	CloneType,
	Kind
} from '@sinclair/typebox'
import { isEqual } from 'lodash-es'

export type Assign<TTarget, TSource> = Omit<TTarget, keyof TSource> & TSource

// alternate way to compose this type:
// export type Assign<TTarget, TSource> = {
// 	[P in keyof TTarget | keyof TSource]: P extends keyof TSource
// 		? TSource[P]
// 		: P extends keyof TTarget
// 			? TTarget[P]
// 			: never
// }

export type FlatIntersect<T extends [...object[]]> = T extends [
	infer U extends object
]
	? U
	: T extends [infer TTarget extends object, infer TSource extends object]
		? Assign<TTarget, TSource>
		: T extends [
					infer TTarget extends object,
					infer TSource extends object,
					...infer Tail extends object[]
				]
			? FlatIntersect<[Assign<TTarget, TSource>, ...Tail]>
			: never

// export type TAssign<TBase extends TObject, TOverride extends TObject> = TObject<
// 	Assign<TBase['properties'], TOverride['properties']>
// >
// above version is more precise but more computation-intensive. the one below is close enough for most purposes

export type TAssign<TBase extends TObject, TOverride extends TObject> = TObject<
	TBase['properties'] & TOverride['properties']
>

export type TFlatIntersect<T extends [...TObject[]]> = T extends [
	infer U extends TObject
]
	? U
	: T extends [infer TBase extends TObject, infer TOverride extends TObject]
		? TAssign<TBase, TOverride>
		: T extends [
					infer TBase extends TObject,
					infer TOverride extends TObject,
					...infer Tail extends [...TObject[]]
				]
			? TFlatIntersect<[TAssign<TBase, TOverride>, ...Tail]>
			: never

export function Assign<TTarget extends TObject, TSource extends TObject>(
	target: TTarget,
	source: TSource,
	options: ObjectOptions = {}
) {
	// Use Record<string, TSchema> to allow mutation, then cast result
	const mergedProps: Record<string, TSchema> = { ...CloneType(target).properties }

	const props = CloneType(source).properties
	for (const k in props) {
		const oldProp = mergedProps[k]
		const newProp = props[k]

		// skip if it's the same thing
		if (isEqual(oldProp, newProp)) continue
		// skip if it's the optional version of the same schema
		if (isEqual(oldProp, Type.Optional(newProp))) continue

		mergedProps[k] = newProp
	}

	return Type.Object(mergedProps, {
		[Kind]: 'Object',
		...options
	}) as unknown as TAssign<TTarget, TSource>
}

export function FlatIntersect<T extends TObject[]>(
	schemas: [...T],
	options: ObjectOptions = {}
) {
	if (schemas.length === 0)
		throw new Error(
			`FlatIntersect expected an array of schemas, but the array is empty`
		)

	const [target, ...sources] = schemas

	let result = CloneType(target, { ...target })

	for (const source of sources) result = Assign(result, source)

	return CloneType(result, {
		[Kind]: 'Object',
		...options
	}) as TFlatIntersect<T>
}
