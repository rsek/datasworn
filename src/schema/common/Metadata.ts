import { type Static, Type } from '@sinclair/typebox'
import { Nullable } from '../utils/Nullable.js'
import { JsonTypeDef } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'
import { extractMetadata } from '../../scripts/json-typedef/utils.js'

export const SvgImageUrl = Type.String({
	pattern: /\.svg$/i.source,
	$id: 'SvgImageUrl',
	format: 'uri-reference',
	description:
		'A relative (local) URL pointing to a vector image in the SVG format.'
})
export type SvgImageUrl = Static<typeof SvgImageUrl>
export const WebpImageUrl = Type.String({
	pattern: /\.webp$/i.source,
	$id: 'WebpImageUrl',
	format: 'uri-reference',
	description:
		'A relative (local) URL pointing to a raster image in the WEBP format.'
})
export type WebpImageUrl = Static<typeof WebpImageUrl>
export const CssColor = Type.String({
	$id: 'CssColor',
	remarks: 'See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value',
	description: 'A CSS color value.'
})
export type CssColor = Static<typeof CssColor>

// export const SemanticVersion = Type.String({
// 	pattern:
// 		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
// 			.source,
// 	$id: 'SemanticVersion'
// })
// export type SemanticVersion = Static<typeof SemanticVersion>

export const AuthorInfo = Type.Object(
	{
		name: Type.String({ examples: ['Shawn Tomkin'] }),
		email: Type.Optional(
			Type.String({
				title: 'Email',
				format: 'email',
				description: 'An optional email contact for the author'
			})
		),
		url: Type.Optional(
			Type.String({
				format: 'uri',
				description: "An optional URL for the author's website."
			})
		)
	},
	{
		examples: [{ name: 'Shawn Tomkin', url: 'https://ironswornrpg.com' }],
		$id: 'AuthorInfo',
		description: 'Information on the original creator of this material.'
	}
)
export const SourceTitle = Type.String({
	description: 'The title of the source document.',
	examples: [
		'Ironsworn Rulebook',
		'Ironsworn Assets Master Set',
		'Ironsworn: Delve',
		'Ironsworn: Starforged Rulebook',
		'Ironsworn: Starforged Assets',
		'Sundered Isles'
	],
	$id: 'SourceTitle'
})

export const PageNumber = Type.Integer({
	minimum: 1,
	description: 'Represents a page number in a book.',
	$id: 'PageNumber'
})

export const Date = Type.String({
	pattern: /[0-9]{4}-((0[0-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))/.source,
	format: 'date',
	remarks: 'You may prefer to deserialize this as a Date object.',
	description: 'A date formatted YYYY-MM-DD.',
	$id: 'Date'
})

export const WebUrl = Type.String({
	format: 'uri',
	description: 'An absolute URL pointing to a website.',
	$id: 'WebUrl'
})

export const License = Nullable(Type.Ref(WebUrl), {
	default: undefined,
	description:
		"An URL pointing to the location where this content's license can be found.\n\nA `null` here indicates that the content provides __no__ license, and is not intended for redistribution.",
	examples: [
		'https://creativecommons.org/licenses/by/4.0',
		'https://creativecommons.org/licenses/by-nc-sa/4.0'
	],
	$id: 'License',
	[JsonTypeDef]: {
		schema: JtdType.Nullable(JtdType.Ref(WebUrl.$id as string))
	}
})

export const SourceInfo = Type.Object(
	{
		title: Type.Ref(SourceTitle, {
			[JsonTypeDef]: {
				schema: JtdType.String(extractMetadata(SourceTitle))
			}
		}),
		page: Type.Optional(
			Type.Ref(PageNumber, {
				description: 'The page number where this content is described in full.',
				[JsonTypeDef]: {
					schema: Type.Optional(JtdType.Uint16())
				}
			})
		),
		authors: Type.Array(Type.Ref(AuthorInfo), {
			minItems: 1,
			description: 'Lists authors credited by the source material.'
		}),
		date: Type.Ref(Date, {
			description:
				"The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.",
			[JsonTypeDef]: { schema: JtdType.Timestamp() }
		}),
		url: Type.Ref(WebUrl, {
			description: 'A URL where the source document is available.',
			examples: ['https://ironswornrpg.com']
		}),
		license: Type.Ref(License)
	},
	{
		description: 'Metadata describing the original source of this node',
		$id: 'SourceInfo'
	}
)

export type SourceInfo = Static<typeof SourceInfo>

export const Suggestions = Type.Array(Type.Ref('AnyIdWildcard'), {
	$id: 'Suggestions',
	releaseStage: 'experimental'
})

export type Suggestions = Static<typeof Suggestions>
