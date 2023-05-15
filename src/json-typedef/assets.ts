import type * as Types from 'schema'
import * as JSONSchema from '@schema-json'
import { JTDSchemaType } from 'ajv/dist/core'
import {
	UnionCheckboxField,
	UnionChoicesFieldAssetAugment,
	UnionClockField,
	UnionCounterField,
	UnionChoicesFieldNumber,
	UnionSelectFieldStat,
	UnionTextField
} from 'json-typedef/inputs'
import { setIdRef, getMetadata } from 'json-typedef/utils'
import { set } from 'lodash'

export const AssetAugmentChoice: JTDSchemaType<
	Types.Common.SelectOption<Types.Assets.AssetAugment>,
	{ ID: string; Label: string; AssetAugment: Types.Assets.AssetAugment }
> = {
	properties: {
		label: { ref: 'Label' },
		value: { ref: 'AssetAugment' }
	}
}

export const Asset: JTDSchemaType<
	Types.Assets.Asset,
	{
		AssetAbility: Types.Assets.AssetAbility
		AssetID: string
		Label: string
		Source: Types.Metadata.Source
		MarkdownString: string
		AssetControlField: Types.Assets.AssetControlField
		AssetOptionField: Types.Assets.AssetOptionField
		AssetAttachment: Types.Assets.AssetAttachment
		AssetConditionMeter: Types.Assets.AssetConditionMeter
	}
> = {
	properties: {
		id: { ref: 'AssetID' },
		name: { ref: 'Label' },
		source: { ref: 'Source' },
		abilities: { elements: { ref: 'AssetAbility' } }
	},
	optionalProperties: {
		requirement: { ref: 'MarkdownString' },
		count_as_impact: {
			type: 'boolean',
			metadata: {
				description:
					'If `true`, this asset counts as an impact (Starforged) or a debility (classic Ironsworn).'
			}
		},
		attachments: { ref: 'AssetAttachment' },
		controls: { values: { ref: 'AssetControlField' } },
		options: { values: { ref: 'AssetOptionField' } },
		condition_meter: { ref: 'AssetConditionMeter' },
		shared: {
			type: 'boolean',
			metadata: {
				description:
					"Most assets only benefit to their owner, but certain assets (like Starforged's module and command vehicle assets) are shared amongst the player's allies, too."
			}
		}
	}
}

export const AssetConditionMeterID: JTDSchemaType<string> = { type: 'string' }

export const AssetConditionMeter: JTDSchemaType<
	Types.Assets.AssetConditionMeter,
	{
		Label: string
		AssetConditionMeterID: string
		AssetConditionMeterCheckbox: Types.Assets.AssetConditionMeterCheckbox
	}
> = {
	properties: {
		id: { ref: 'AssetConditionMeterID' },
		label: { ref: 'Label' },
		max: { type: 'int8' },
		min: { type: 'int8' }
	},
	optionalProperties: {
		value: { type: 'int8' },
		controls: { values: { ref: 'AssetConditionMeterCheckbox' } }
	}
}

export const AssetConditionMeterCheckbox: JTDSchemaType<
	Types.Assets.AssetConditionMeterCheckbox,
	{ AssetConditionMeterControlFieldID: string; Label: string }
> = {
	properties: {
		field_type: { enum: ['checkbox'] },
		id: { ref: 'AssetConditionMeterControlFieldID' },
		label: { ref: 'Label' }
	},
	optionalProperties: {
		value: { type: 'boolean' }
	}
}

export const AssetAttachment: JTDSchemaType<
	Types.Assets.AssetAttachment,
	{ AssetIDWildcard: string }
> = {
	metadata: getMetadata(JSONSchema.Assets.AssetAttachment),
	properties: {
		assets: {
			metadata: getMetadata(JSONSchema.Assets.AssetIDWildcard),
			elements: { ref: 'AssetIDWildcard' }
		}
	},
	optionalProperties: {
		max: {
			type: 'uint8',
			metadata: {
				description:
					"The maximum number of attached assets. Omitted if there's no upper limit to the number of attached assets."
			}
		}
	}
}

export const AssetAbility: JTDSchemaType<
	Types.Assets.AssetAbility,
	{
		AssetAbilityID: string
		MarkdownString: string
		Label: string
		AssetAbilityControlField: Types.Assets.AssetAbilityControlField
		AssetAbilityOptionField: Types.Assets.AssetAbilityOptionField
		Move: Types.Moves.Move
		MoveAugment: Types.Moves.MoveAugment
		AssetAugment: Types.Assets.AssetAugment
	}
> = {
	properties: {
		id: { ref: 'AssetAbilityID' },
		text: { ref: 'MarkdownString' },
		enabled: { type: 'boolean' }
	},
	optionalProperties: {
		name: { ref: 'Label' },
		controls: { values: { ref: 'AssetAbilityControlField' } },
		options: { values: { ref: 'AssetAbilityOptionField' } },
		moves: { values: { ref: 'Move' } },
		augment_asset: { ref: 'AssetAugment' },
		augment_moves: { elements: { ref: 'MoveAugment' } }
	}
}

export const AssetAbilityControlField: JTDSchemaType<
	Types.Assets.AssetAbilityControlField,
	{ AssetAbilityControlFieldID: string; Label: string }
> = {
	discriminator: 'field_type',
	mapping: {
		//@ts-expect-error
		checkbox: setIdRef(UnionCheckboxField, 'AssetAbilityControlFieldID'),
		//@ts-expect-error
		clock: setIdRef(UnionClockField, 'AssetAbilityControlFieldID'),
		//@ts-expect-error
		counter: setIdRef(UnionCounterField, 'AssetAbilityControlFieldID')
	}
}

export const AssetAbilityOptionField: JTDSchemaType<
	Types.Assets.AssetAbilityOptionField,
	{ AssetAbilityOptionFieldID: string }
> = {
	discriminator: 'field_type',
	mapping: {
		// @ts-expect-error computers were a mistake
		text: setIdRef(UnionTextField, 'AssetAbilityOptionFieldID'),
		// @ts-expect-error
		select_stat: setIdRef(UnionSelectFieldStat, 'AssetAbilityOptionFieldID'),
		// @ts-expect-error
		select_number: setIdRef(
			// @ts-expect-error

			UnionChoicesFieldNumber,
			'AssetAbilityOptionFieldID'
		),
		// @ts-expect-error
		select_asset_extension: setIdRef(
			// @ts-expect-error
			UnionChoicesFieldAssetAugment,
			'AssetAbilityOptionFieldID'
		)
	}
}

export const AssetOptionField: JTDSchemaType<
	Types.Assets.AssetOptionField,
	{
		AssetOptionFieldID: string
		Label: string
		AssetAugment: Types.Assets.AssetAugment
	}
> = {
	metadata: {
		description:
			'Asset options are fields that are usually only set once, typically when the player purchases the asset. The most common examples are the "Name" fields on companion assets. A more complex example is the choice of stats on the Devotant asset.'
	},
	discriminator: 'field_type',
	mapping: {
		// @ts-expect-error computers were a mistake
		text: setIdRef(UnionTextField, 'AssetOptionFieldID'),
		// @ts-expect-error
		select_stat: setIdRef(UnionSelectFieldStat, 'AssetOptionFieldID'),
		// select_number: setIdRef(UnionChoicesFieldNumber, 'AssetOptionFieldID'),
		// @ts-expect-error
		select_asset_extension: setIdRef(
			// @ts-expect-error
			UnionChoicesFieldAssetAugment,
			'AssetOptionFieldID'
		)
	}
}

export const AssetControlField: JTDSchemaType<
	Types.Assets.AssetControlField,
	{ AssetControlFieldID: string; Label: string }
> = {
	discriminator: 'field_type',
	metadata: {
		description:
			"Asset controls are fields that are expected to change throughout the asset's lifespan. The most common example are the condition meters on certain assets. A more complex example is the distinct mechanical modes on Ironsworn's 'Armored'."
	},
	mapping: {
		// @ts-expect-error oh come ON. it can't be missing field_type, it's the discriminator!!!
		checkbox: set(
			UnionCheckboxField,
			'properties.id.ref',
			'AssetControlFieldID'
		),
		// @ts-expect-error
		select_asset_extension: set(
			UnionChoicesFieldAssetAugment,
			'properties.id.ref',
			'AssetControlFieldID'
		)
	}
}

export const AssetAugmentForeign: JTDSchemaType<
	Types.Assets.AssetAugmentForeign,
	{
		AssetID: string
		AssetIDWildcard: string
		Label: string
		AssetAbilityControlFieldID: string
		AssetConditionMeterControlField: Types.Assets.AssetConditionMeterControlField
	}
> = {
	metadata: {
		description:
			'Describes changes applied to an asset, usually by another asset. Unchanged properties are omitted.'
	},
	properties: {
		id: { ref: 'AssetAbilityControlFieldID' },
		augments: { ref: 'AssetIDWildcard' }
	},
	optionalProperties: {
		count_as_impact: { type: 'boolean' },
		attachments: {
			optionalProperties: {
				max: { type: 'uint8' },
				assets: {
					elements: { ref: 'AssetIDWildcard' }
				}
			}
		},
		condition_meter: {
			optionalProperties: {
				max: { type: 'int8' },
				min: { type: 'int8' },
				controls: {
					values: { ref: 'AssetConditionMeterControlField' }
				}
			}
		}
	}
}

export const AssetConditionMeterControlField: JTDSchemaType<
	Types.Assets.AssetConditionMeterControlField,
	{ AssetConditionMeterControlFieldID: string; Label: string }
> = {
	properties: {
		id: { ref: 'AssetConditionMeterControlFieldID' },
		field_type: { enum: ['checkbox'] },
		label: { ref: 'Label' }
	},
	optionalProperties: {
		value: { type: 'boolean' }
	}
}

export const AssetAugment: JTDSchemaType<
	Types.Assets.AssetAugment,
	{
		AssetIDWildcard: string
		Label: string
		AssetConditionMeterControlField: Types.Assets.AssetConditionMeterControlField
	}
> = {
	metadata: {
		description:
			'Describes changes applied to an asset by its own abilities or controls. Unchanged properties are omitted.'
	},

	optionalProperties: {
		count_as_impact: { type: 'boolean' },
		attachments: {
			optionalProperties: {
				max: { type: 'uint8' },
				assets: {
					elements: { ref: 'AssetIDWildcard' }
				}
			}
		},
		condition_meter: {
			optionalProperties: {
				max: { type: 'int8' },
				min: { type: 'int8' },
				controls: {
					values: { ref: 'AssetConditionMeterControlField' }
				}
			}
		}
	}
}
