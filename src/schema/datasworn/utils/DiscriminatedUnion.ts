import {
	Kind,
	Type,
	TypeClone,
	TypeRegistry,
	type ObjectProperties,
	type SchemaOptions,
	type Static,
	type TLiteral,
	type TObject,
	type TPick,
	type TRef,
	type TSchema
} from '@sinclair/typebox'
import { map, omit, pick, values } from 'lodash-es'
import {
	Discriminator,
	JsonTypeDef,
	Members
} from '../../../scripts/json-typedef/symbol.js'
import { UnionEnum, type TUnionEnum } from './UnionEnum.js'

export function DiscriminatedUnionFromMapping<
	TDiscriminator extends string,
	Mapping extends Record<string, TObject>
>(
	discriminator: TDiscriminator,
	mapping: Mapping,
	options: SchemaOptions = {}
) {
	type Remapping = {
		[P in string & keyof Mapping]: TDiscriminable<TDiscriminator, P, Mapping[P]>
	}

	const nuMapping = map(mapping, (v, k: keyof Mapping & string) =>
		Discriminable(v, discriminator, k)
	) as unknown as [...Remapping[keyof Remapping][]]

	const schemas = values(nuMapping)

	return DiscriminatedUnion(schemas, discriminator, options)
}

type TDiscriminable<
	TDiscriminator extends string,
	MappingKey extends string = string,
	T extends TObject = TObject
> = Omit<T, 'properties' | 'static'> & {
	properties: ObjectProperties<T> & {
		[D in TDiscriminator]: TLiteral<MappingKey>
	}
	static: Static<T> & { [D in TDiscriminator]: MappingKey }
	params: unknown[]
	type: 'object'
}

export function Discriminable<
	TDiscriminator extends string,
	MappingKey extends string,
	T extends TObject = TObject
>(
	base: T,
	discriminator: TDiscriminator,
	mappingKey: MappingKey,
	options = {}
) {
	const result = TypeClone.Type(base, options)
	result.properties[discriminator] = Type.Literal(mappingKey)
	result.required = [...(result.required ?? []), discriminator]

	return result as any as TDiscriminable<TDiscriminator, MappingKey, T>
}

export function setDiscriminatorDefault<T extends TDiscriminatedUnion>(
	schema: T,
	defaultValue: Static<T>[T[typeof Discriminator]]
): T {
	schema.properties[schema[Discriminator]].default = defaultValue
	return schema
}

export function DiscriminatedUnion<
	T extends TObject[],
	TDiscriminator extends string & keyof Static<T[number]>
>(schemas: [...T], discriminator: TDiscriminator, options: SchemaOptions = {}) {
	if (!TypeRegistry.Has('DiscriminatedUnion'))
		TypeRegistry.Set('DiscriminatedUnion', DiscriminatedUnionCheck)

	const allOf = schemas.map((member) => {
		const result = {
			if: pick(
				Type.Pick(member, [discriminator]),
				`properties.${discriminator}.const`,
				`properties.${discriminator}.type`
			),
			// if: Type.Unsafe<Static<(typeof member)['properties'][D]>>({
			// 	properties: pick(member.properties, discriminator)
			// }),
			then:
				member.$id == null
					? TypeClone.Type(member, { additionalProperties: false })
					: Type.Ref(member)
		}

		// brand the original member so that JTD schema generation skips them -- they won't need their own definition
		;(member as any)[JsonTypeDef] ||= {}
		;(member as any)[JsonTypeDef].skip = true

		return result
	}) as TDiscriminatedUnion<T, TDiscriminator>['allOf']

	// const oneOf = schemas.map((member) => {
	// 	const result =
	// 		member.$id == null
	// 			? TypeClone.Type(member, { additionalProperties: false })
	// 			: Type.Ref(member)

	// 	// brand the original member so that JTD schema generation skips them -- they won't need their own definition
	// 	;(member as any)[JsonTypeDef] ||= {}
	// 	;(member as any)[JsonTypeDef].skip = true

	// 	return result
	// })

	type DiscriminatorValueLiteral = Static<T[number]>[TDiscriminator] & string

	const literals = UnionEnum(
		schemas.map(
			(member) => member.properties[discriminator].const
		) as DiscriminatorValueLiteral[]
	)
	// const literals = Type.Enum(
	// 	Object.fromEntries(
	// 		schemas.map((member) => [
	// 			member.properties[discriminator].const,
	// 			member.properties[discriminator].const
	// 		])
	// 	)
	// )

	const properties = { [discriminator]: literals } as Record<
		TDiscriminator,
		typeof literals
	>

	const result = {
		...options,
		type: 'object',
		params: undefined as any,
		static: undefined as any,
		allOf,
		// oneOf,
		$comment: `Deserialize as a discriminated union/polymorphic object type, using the \`${discriminator}\` property as a discriminator.`,
		required: [discriminator],
		additionalProperties: true,
		properties,
		[Kind]: 'DiscriminatedUnion',
		[Discriminator]: discriminator,
		[Members]: schemas
	}

	return result as TDiscriminatedUnion<T, TDiscriminator>
}

function DiscriminatedUnionCheck(
	schema: TDiscriminatedUnion<TObject[], string>,
	value: unknown
) {
	const discriminator = schema[Discriminator]
	// const members = schema[Members]
	const mapping = schema.properties[discriminator].enum

	// const memberSchema = UnionOneOf(members)
	// const memberValidator = Value.Check()

	return (value as any[]).every((item) => mapping.includes(item[discriminator]))
}

export function TDiscriminatedUnion<
	T extends TDiscriminatedUnion<TObject[], string> = TDiscriminatedUnion<
		TObject[],
		string
	>
>(schema: unknown): schema is T {
	return (schema as T)[Kind] === 'DiscriminatedUnion'
}

export interface TDiscriminatedUnion<
	T extends TObject[] = TObject[],
	TDiscriminator extends string & keyof Static<T[number]> = string &
		keyof Static<T[number]>
> extends TSchema {
	type: 'object'
	static: Static<T[number]>
	properties: Record<
		TDiscriminator,
		TUnionEnum<(Static<T[number]>[TDiscriminator] & string)[]>
	>
	allOf: {
		if: TPick<T[number], TDiscriminator>
		then: T[number] | TRef<T[number]>
	}[]
	// oneOf: (T[number] | TRef<T[number]>)[]
	additionalProperties: true
	[Kind]: 'DiscriminatedUnion'
	[Discriminator]: TDiscriminator
	[Members]: [...T]
}

export function ToUnion<T extends TObject[]>(
	schema: TDiscriminatedUnion<T, string>
) {
	const base = omit(TypeClone.Type(schema), [
		'type',
		'allOf',
		'additionalProperties',
		'oneOf',
		Kind,
		Discriminator,
		Members
	])

	const anyOf = schema.allOf.map(({ then }) => then) as T

	// console.log(anyOf)

	return Type.Union(anyOf, omit(base, ['properties']))
}
