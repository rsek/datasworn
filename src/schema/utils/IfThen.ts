import {
	Kind,
	type SchemaOptions,
	type Static,
	type TSchema
} from '@sinclair/typebox'

export type TIfThenElse<
	If extends TSchema,
	Then extends TSchema,
	Else extends TSchema | never = never
> = {
	[Kind]: 'IfThenElse'
	if: If
	then: Then
	else: Else
	static: (Static<If> & Static<Then>) | Else extends TSchema
		? Exclude<Static<Else>, Static<If>>
		: never
}

export function IfThenElse<
	If extends TSchema,
	Then extends TSchema,
	Else extends TSchema | never = never
>(
	{
		condition,
		ifTrue,
		ifFalse
	}: {
		condition: If
		ifTrue: Then
		ifFalse?: Else
	},
	options: SchemaOptions = {}
) {
	return {
		...options,
		if: condition,
		then: ifTrue,
		else: ifFalse,
		[Kind]: 'IfThenElse'
	} as TIfThenElse<If, Then, Else>
}
