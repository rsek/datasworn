/** Abstract inputs that are used by option and control fields.  */
import {
	Type,
	type ObjectOptions,
	type Static,
	type TInteger,
	type TLiteral,
	type TObject,
	type TRefUnsafe,
	type TSchema,
	type TString
} from '@sinclair/typebox'
import { JsonTypeDef } from '../Symbols.js'

import {
	LiteralZero,
	setDescriptions,
	type TFuzzySchemaOf
} from '../utils/typebox.js'

import * as Generic from '../Generic.js'
import * as Utils from '../Utils.js'
import type * as Id from './Id.js'
import * as Text from './Text.js'
import JtdType from '../../scripts/json-typedef/typedef.js'
import type { ObjectProperties } from '../utils/ObjectProperties.js'
import { Assign } from '../utils/FlatIntersect.js'

/**
 * @abstract
 */
export function Input<Value extends TSchema>(
	value: Value,
	options: ObjectOptions = {}
) {
	return Type.Object(
		{
			label: Type.Ref(Text.Label),
			value: {
				description: 'The current value of this input.',
				...value
			} as Value
		},
		options
	) satisfies TInput<Value>
}
export type TInput<Value extends TSchema> = TObject<{
	label: TRefUnsafe<TString>
	value: Value
}>
export interface Input<Value> {
	label: string
	value: Value
}

/**
 * Represents a range of number values with a minimum and a maximum.
 * @template Min The schema of the minimum value
 * @template Max The schema of the maximum value
 * @abstract
 */
export function Range<
	Min extends TFuzzySchemaOf<number>,
	Max extends TFuzzySchemaOf<number>
>({ min, max }: { min: Min; max: Max }, options: ObjectOptions = {}) {
	return setDescriptions(
		Type.Object({ min, max }, options),
		{
			min: 'The (inclusive) minimum value.',
			max: 'The (inclusive) maximum value.'
		},
		false
	)
}
export type TRange<
	Min extends TFuzzySchemaOf<number> = TFuzzySchemaOf<number>,
	Max extends TFuzzySchemaOf<number> = TFuzzySchemaOf<number>
> = TObject<{ min: Min; max: Max }>
export interface Range<
	Min extends number | null = number | null,
	Max extends number | null = number | null
> {
	min: Min
	max: Max
}

function IntegerInput<
	Min extends TFuzzySchemaOf<number>,
	Max extends TFuzzySchemaOf<number>,
	Rollable extends TLiteral<boolean>
>(
	{ min, max, rollable }: { min: Min; max: Max; rollable: Rollable },
	options: ObjectOptions = {}
) {
	const mixin = Assign(
		Input(
			Type.Integer({ default: 0, [JsonTypeDef]: { schema: JtdType.Int8() } })
		),
		Range({
			min: { [JsonTypeDef]: { schema: JtdType.Int8() }, ...min },
			max: { [JsonTypeDef]: { schema: JtdType.Int8() }, ...max }
		})
	)

	return Assign(
		mixin,
		Type.Object({
			rollable: {
				[JsonTypeDef]: { schema: JtdType.Boolean() },
				default: rollable.const,
				...rollable
			}
		}),

		options
	) as unknown as TIntegerInput<Min, Max, Rollable>
}
export type TIntegerInput<
	Min extends TFuzzySchemaOf<number> = TFuzzySchemaOf<number>,
	Max extends TFuzzySchemaOf<number> = TFuzzySchemaOf<number>,
	Rollable extends TLiteral<boolean> = TLiteral<boolean>
> = TObject<{
	label: TRefUnsafe<TString>
	min: Min
	max: Max
	rollable: Rollable
	value: TInteger
}>

// TInput<TInteger> &
// 	TRange<Min, Max>

export const Counter: TIntegerInput<
	TInteger,
	Utils.TNullable<TInteger>,
	TLiteral<false>
> = IntegerInput(
	{
		min: Type.Integer({ default: 0 }),
		max: Utils.Nullable(Type.Integer(), {
			default: null,
			description:
				"The (inclusive) maximum value, or `null` if there's no maximum."
		}),
		rollable: Type.Literal(false)
	},
	{
		description:
			'A basic counter representing a non-rollable integer value. They usually start at 0, and may or may not have a maximum.',
		remarks: 'Semantics are similar to `<input type="number" step="1">`'
	}
) satisfies TInput<TInteger>

export type TCounter = typeof Counter

export type Counter = Static<TCounter>

// value: 'The current number of filled clock segments.',
export const Clock = IntegerInput(
	{
		min: {
			...LiteralZero,
			description:
				'The minimum number of filled clock segments. This is always 0.'
		} as TLiteral<0>,
		max: Type.Integer({
			title: 'ClockSize',
			multipleOf: 2,
			minimum: 2,
			// examples: [4, 6, 8, 10],
			description:
				'The size of the clock -- in other words, the maximum number of filled clock segments. Standard clocks have 4, 6, 8, or 10 segments.'
		}),
		rollable: Type.Literal(false)
	},
	{
		description: 'A clock with 4 or more segments.',
		remarks:
			'Semantics are similar to HTML `<input type="number">`, but rendered as a clock (a circle with equally sized wedges).'
	}
)
export type TClock = typeof Clock
export type Clock = Static<typeof Clock>

/**
 * A meter with an integer value, bounded by a minimum and maximum
 * @abstract
 */
export function Meter<Rollable extends TLiteral<boolean>>(
	rollable: Rollable,
	options: ObjectOptions = {}
) {
	return setDescriptions(
		IntegerInput(
			{
				min: Type.Integer({
					default: 0,
					description: 'The minimum value of this meter.'
				}),
				max: Type.Integer({ description: 'The maximum value of this meter.' }),
				rollable: {
					description:
						"Is this meter's `value` usable as a stat in an action roll?",
					...rollable
				}
			},
			{
				description:
					'A meter with an integer value, bounded by a minimum and maximum.',
				...options
			}
		),
		{
			value: 'The current value of this meter.'
		}
	)
}

export type TMeter<Rollable extends TLiteral<boolean> = TLiteral<boolean>> =
	ReturnType<typeof Meter<Rollable>>
export type Meter<Rollable extends boolean = boolean> = Static<
	TMeter<TLiteral<Rollable>>
>

/**
 * Represents a checkbox, similar to an HTML `<input type="checkbox">` element.
 * @abstract
 */
export const Checkbox = Input(
	Type.Boolean({ description: 'Is the box checked?', default: false }),
	{
		description: 'Represents a checkbox.',
		remarks: 'Semantics are similar to the `<input type="checkbox">` element.'
	}
)
export type Checkbox = Static<typeof Checkbox>
export type TCheckbox = typeof Checkbox

export const TextInput = Input(
	Utils.Nullable(Type.String(), {
		description: "The content of this text input, or `null` if it's empty",
		default: null
	}),
	{
		description: 'Represents an input that accepts plain text.',
		remarks: 'Semantics are similar to the HTML `<input type="text">` element.'
	}
)
export type TextInput = Static<typeof TextInput>
export type TTextInput = typeof TextInput

/**
 * Represents an option in a list of choices.
 * @abstract
 */
const SelectOptionBase = Type.Object({
	label: Type.Ref(Text.Label),
	choice_type: Type.Literal('choice')
})

export function SelectOption<T extends TObject>(
	schema: T,
	options: ObjectOptions = {}
) {
	return Assign(SelectOptionBase, schema, {
		description: 'Represents an option in a list of choices.',
		remarks: 'Semantics are similar to the HTML `<option>` element.',
		...options
	})
}
export type TSelectChoice<T extends TObject> = ReturnType<
	typeof SelectOption<T>
>
export type SelectChoice<T extends object> = T & Static<typeof SelectOptionBase>

function Choices<T extends TSchema>(
	choiceSchema: T,
	options: ObjectOptions = {}
) {
	return Type.Object(
		{
			choices: Generic.Dictionary(choiceSchema)
		},
		options
	)
}
export type TChoices<T extends TSchema> = ReturnType<typeof Choices<T>>
export interface Choices<T> {
	choices: Record<string, T>
}

const SelectChoicesGroupBase = Type.Object({
	name: Type.Ref(Text.Label, {
		description: 'A label for this option group.'
	}),
	choice_type: Type.Literal('choice_group')
})
export function SelectChoicesGroup<
	TOption extends TRefUnsafe<TSelectChoice<TObject>> | TSelectChoice<TObject>
>(optionSchema: TOption, options: ObjectOptions = {}) {
	const mixin = Choices(optionSchema)
	return Assign(SelectChoicesGroupBase, mixin, {
		description: 'Represents a grouping of options in a list of choices.',
		remarks: 'Semantics are similar to the HTML `<optgroup>` element.',
		title: optionSchema.title ? optionSchema.title + 'Group' : undefined,
		...options
	}) as TObject<
		ObjectProperties<typeof SelectChoicesGroupBase> &
			ObjectProperties<typeof mixin>
	>
}
export type TSelectChoicesGroup<
	TOption extends TRefUnsafe<TSelectChoice<TObject>> | TSelectChoice<TObject>
> = ReturnType<typeof SelectChoicesGroup<TOption>>

export type SelectChoicesGroup<Option extends SelectChoice<any>> = Static<
	typeof SelectChoicesGroupBase
> &
	Choices<Option>

const SelectBase = Input(
	Utils.Nullable(Type.Ref('DictKey'), {
		description:
			'The key of the currently selected choice from the `choices` property, or `null` if none is selected.',
		default: null
	})
)

export function SelectWithGroups<Option extends TSelectChoice<TObject>>(
	choiceSchema: Option,
	choicesGroupSchema: TSelectChoicesGroup<TRefUnsafe<Option> | Option>,
	options: ObjectOptions = {}
) {
	const mixin = Choices(
		Utils.DiscriminatedUnion(
			{
				choice: choiceSchema,
				choice_group: choicesGroupSchema
			},
			'choice_type'
		)
	)
	return Assign(SelectBase, mixin, {
		description: 'Represents a list of mutually exclusive choices.',
		remarks: 'Semantics are similar to the HTML `<select>` element',
		...options
	}) as TObject<
		ObjectProperties<typeof SelectBase> & ObjectProperties<typeof mixin>
	>
}

/**
 * Represents a list of mutually exclusive choices.
 * @remarks Semantics are similar to the HTML `<select>` element.
 */
export function Select<
	Option extends TRefUnsafe<
		| TSelectChoice<TObject>
		| Utils.TDiscriminatedUnion<TSelectChoice<TObject>, string>
	>
>(choiceSchema: Option, options: ObjectOptions = {}) {
	const mixin = Choices(choiceSchema)

	return Assign(SelectBase, mixin, {
		description: 'Represents a list of mutually exclusive choices.',
		remarks: 'Semantics are similar to the HTML `<select>` element',
		...options
	}) as TObject<
		ObjectProperties<typeof SelectBase> & ObjectProperties<typeof mixin>
	>
}
export type TSelect<Option extends TRefUnsafe<TSelectChoice<TObject>>> = ReturnType<
	typeof Select<Option>
>
export type Select<Option extends SelectChoice<any>> = Static<
	typeof SelectBase
> &
	Choices<Option>
