import {
	Type,
	type ObjectOptions,
	type Static,
	type TLiteral,
	type TObject,
	type TRefUnsafe,
	type TSchema
} from '@sinclair/typebox'
import { Mapping, Members } from '../Symbols.js'
import type { TMoveEnhancement } from 'schema/moves/MoveEnhancement.js'
import * as Utils from '../Utils.js'
import type { TAssetEnhancement } from '../assets/Enhancement.js'
import * as Base from './Inputs.js'
import * as Metadata from './Metadata.js'
import { RollableValue } from './RollableValues.js'
import { mapValues } from 'lodash-es'
import { Assign } from '../utils/FlatIntersect.js'

export const EnhanceableProperties = Symbol('EnhanceableProperties')

/** The standard discriminator key for input fields. */
export const DISCRIMINATOR = 'field_type' as const

/** Wraps basic inputs with a descriminator and optional icon for use in discriminated union input fields. */
function InputField<T extends Base.TInput<TSchema>, V extends string>(
	base: T,
	type: V,
	options: ObjectOptions = {}
) {
	const { description, remarks } = base

	const mixin = Type.Object({
		[DISCRIMINATOR]: Type.Literal(type),
		icon: Type.Optional(
			Type.Ref(Metadata.SvgImageUrl, {
				description: 'An icon associated with this input.'
			})
		)
	})

	const result = Assign(base, mixin, {
		description,
		remarks,
		[EnhanceableProperties]: [] as Array<keyof Static<T>>,
		...options
	}) as unknown as TInputField<T, V>

	// const result = Generic.IdentifiedNode(
	// 	id,
	// 	Assign(base, mixin) as unknown as TObject<
	// 		T['properties'] & {
	// 			[DISCRIMINATOR]: TLiteral<Discriminator>
	// 			_id:Id.TAnyId
	// 		}
	// 	>,
	// 	{
	// 		description,
	// 		$comment,
	// 		[EnhanceableProperties]: [] as Array<keyof Static<T>>,
	// 		...options
	// 	}
	// ) as unknown as TInputField<T, Discriminator>

	return result
}
export type TInputField<
	T extends Base.TInput<TSchema>,
	Discriminator extends string
> = TObject<
	// Generic.TIdentifiedNode<
	T['properties'] & {
		[DISCRIMINATOR]: TLiteral<Discriminator>
		// _id:Id.TAnyId
	}
> & {
	// >
	[EnhanceableProperties]: Array<keyof Static<T>>
}

// ReturnType<typeof InputField<T, Discriminator>> & InputFieldOptions<T>

export type InputField<T extends Base.Input<any>, V extends string> = Assign<
	T,
	{
		[DISCRIMINATOR]: V
	}
>

export function isEnhanceable(
	field: TInputField<Base.TInput<TSchema>, string>
) {
	return !!field[EnhanceableProperties].length
}

// export function CounterField(
// 	// _id:Id.TAnyId,
// 	options: ObjectOptions = {}
// ) {
// 	return InputField(
// 		Base.Counter,
// 		'counter',
// 		// id,
// 		{
// 			[EnhanceableProperties]: ['max'],
// 			title: 'CounterField',
// 			...options
// 		}
// 	)
// }
export const CounterField = InputField(Base.Counter, 'counter', {
	[EnhanceableProperties]: ['max'],
	$id: 'CounterField'
})
export type TCounterField = typeof CounterField
export type CounterField = Static<TCounterField>

// }
export const ClockField = InputField(Base.Clock, 'clock', {
	[EnhanceableProperties]: ['max'],
	$id: 'ClockField'
})
export type TClockField = typeof ClockField
export type ClockField = Static<TClockField>

export const ConditionMeterField = InputField(
	Base.Meter(Type.Literal(true)),
	'condition_meter',
	{
		[EnhanceableProperties]: ['max'],
		$id: 'ConditionMeterField'
	}
)
export type TConditionMeterField = typeof ConditionMeterField
export type ConditionMeterField = Static<TConditionMeterField>

function SelectField<
	Choice extends TRefUnsafe<TObject>,
	Discriminator extends string
>(choiceSchema: Choice, type: Discriminator, options: ObjectOptions = {}) {
	return InputField(
		Base.Select(choiceSchema),
		type,
		// id,
		options
	)
}

function SelectFieldWithGroups<
	Choice extends Base.TSelectChoice<TObject>,
	Discriminator extends string
>(
	choiceSchema: Choice,
	choiceGroupSchema: Base.TSelectChoicesGroup<TRefUnsafe<Choice>>,
	type: Discriminator,
	// _id:Id.TAnyId,
	options: ObjectOptions = {}
) {
	return InputField(
		Base.SelectWithGroups(choiceSchema, choiceGroupSchema),
		type,
		// id,
		options
	)
}

export const SelectValueFieldChoice = Utils.DiscriminatedUnion(
	mapValues(RollableValue[Mapping], (v) => Base.SelectOption(v)),
	'using',
	{ $id: 'SelectValueFieldChoice' }
)

export type SelectValueFieldChoice = {
	label: string
	choice_type: 'choice'
}
export type TSelectValueFieldChoice = typeof SelectValueFieldChoice

// export function SelectValueField(
// 	// _id:Id.TAnyId,
// 	options: ObjectOptions = {}
// ) {
// 	return SelectField(
// 		Type.Ref(SelectValueFieldChoice),
// 		'select_value',
// 		// id,
// 		{
// 			...options
// 		}
// 	)
// }

export const SelectValueField = SelectField(
	Type.Ref(SelectValueFieldChoice),
	'select_value',
	// id,
	{
		$id: 'SelectValueField'
	}
)
export type TSelectValueField = typeof SelectValueField
export type SelectValueField = Static<TSelectValueField>

export const SelectEnhancementFieldChoice = Base.SelectOption(
	Type.Partial(
		Type.Object({
			enhance_asset: Type.Ref('AssetEnhancement'),
			// TODO
			// enhance_player: Type.Object({}, { description: 'NYI' }),
			enhance_moves: Type.Array(Type.Ref('MoveEnhancement'))
		})
	),
	{ $id: 'SelectEnhancementFieldChoice' }
)
export const SelectEnhancementFieldChoiceGroup = Base.SelectChoicesGroup(
	Type.Ref(SelectEnhancementFieldChoice),
	{
		$id: 'SelectEnhancementFieldChoiceGroup'
	}
)

// export function SelectEnhancementField(
// 	// _id:Id.TAnyId,
// 	options: ObjectOptions = {}
// ) {
// 	return SelectFieldWithGroups(
// 		SelectEnhancementFieldChoice,
// 		SelectEnhancementFieldChoiceGroup,
// 		'select_enhancement',
// 		// id,
// 		{
// 			description:
// 				'Select from player and/or asset enhancements. Use it to describe modal abilities. For examples, see Ironclad (classic Ironsworn) and Windbinder (Sundered Isles).',
// 			...options
// 		}
// 	)
// }
export const SelectEnhancementField = SelectFieldWithGroups(
	SelectEnhancementFieldChoice,
	SelectEnhancementFieldChoiceGroup,
	'select_enhancement',
	// id,
	{
		description:
			'Select from player and/or asset enhancements. Use it to describe modal abilities. For examples, see Ironclad (classic Ironsworn) and Windbinder (Sundered Isles).',
		$id: 'SelectEnhancementField'
	}
)
export type TSelectEnhancementField = typeof SelectEnhancementField
export type SelectEnhancementField = Static<TSelectEnhancementField>

// export function CardFlipField(
// 	// _id:Id.TAnyId,
// 	options: ObjectOptions = {}
// ) {
// 	return InputField(
// 		Base.Input(
// 			Type.Boolean({ description: 'Is the card flipped over?', default: false })
// 		),
// 		'card_flip',
// 		// id,
// 		{
// 			title: 'CardFlipField',
// 			description: `When its value is set to \`true\` it means that the card is flipped over. Some assets use this to represent a 'broken' state (e.g. Starforged Module assets).`,
// 			...options
// 		}
// 	)
// }
// export type TCardFlipField = ReturnType<typeof CardFlipField>
// export type CardFlipField = Static<TCardFlipField>

export const CardFlipField = InputField(
	Base.Input(
		Type.Boolean({ description: 'Is the card flipped over?', default: false })
	),
	'card_flip',
	// id,
	{
		title: 'CardFlipField',
		description: `When its value is set to \`true\` it means that the card is flipped over. Some assets use this to represent a 'broken' state (e.g. Starforged Module assets).`
		// ...options
	}
)

export type TCardFlipField = typeof CardFlipField
export type CardFlipField = Static<TCardFlipField>

// export function CheckboxField(
// 	// _id:Id.TAnyId,
// 	options: ObjectOptions = {}
// ) {
// 	return InputField(
// 		Base.Checkbox,
// 		'checkbox',
// 		// id,
// 		{
// 			title: 'CheckboxField',
// 			...options
// 		}
// 	)
// }
// export type TCheckboxField = ReturnType<typeof CheckboxField>
export const CheckboxField = InputField(Base.Checkbox, 'checkbox', {
	$id: 'CheckboxField'
})
export type TCheckboxField = typeof CheckboxField
export type CheckboxField = Static<TCheckboxField>

// export function TextField(
// 	// _id:Id.TAnyId,
// 	options: ObjectOptions = {}
// ) {
// 	return InputField(
// 		Base.TextInput,
// 		'text',
// 		// id,
// 		{
// 			title: 'TextField',
// 			...options
// 		}
// 	)
// }
// export type TTextField = ReturnType<typeof TextField>
// export type TextField = Static<TTextField>
export const TextField = InputField(Base.TextInput, 'text', {
	$id: 'TextField'
})
export type TTextField = typeof TextField
export type TextField = Static<TTextField>
