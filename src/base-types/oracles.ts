import { type Localize, type Metadata, type Abstract } from '@base-types'
import { type SvgImageUrl } from 'base-types/metadata'
export type OracleTableID = string

export interface OracleTable {
	id: OracleTableID
	// _template?: string
	name: string
	canonical_name?: string
	source: Metadata.Source
	summary?: Localize.MarkdownString
	description?: Localize.MarkdownString
	match?: OracleTableMatchBehavior
	table: OracleTableRow[]
	rendering?: OracleTableRendering
	suggestions?: Metadata.SuggestionsBase
}

export type OracleTableStyle = 'table' | 'embed_in_row' | 'embed_as_column'
export type OracleColumnContentType =
	| 'range'
	| 'result'
	| 'summary'
	| 'description'

export interface OracleRenderingBase {
	/**
	 * Describes the rendering of this oracle as a standalone table.
	 */
	columns?: Record<string, OracleTableColumn>
	style?: OracleTableStyle | OracleCollectionStyle | null
	color?: Metadata.Color
}

export type OracleCollectionColumn<
	T extends OracleTableColumn = OracleTableColumn
> = T & {
	table_key: OracleTableID
	color?: Metadata.Color
}

export interface OracleTableRendering extends OracleRenderingBase {
	icon?: Metadata.SvgImageUrl
	style?: OracleTableStyle
	color?: Metadata.Color
}

export interface OracleTableColumn {
	label?: Localize.Label
	content_type: OracleColumnContentType
}

export interface OracleTableMatchBehavior {
	text: Localize.MarkdownString
}

export interface OracleRollTemplate
	extends Pick<Partial<OracleTableRow>, 'result' | 'summary' | 'description'> {}

export type OracleTableRowID = string

export interface OracleTableRow<
	Low extends number | null = number | null,
	High extends number | null = number | null,
	ID extends string = OracleTableRowID
> extends Abstract.Range<Low, High> {
	id: ID
	low: Low
	high: High
	result: Localize.MarkdownString
	icon?: SvgImageUrl
	summary?: Localize.MarkdownString
	description?: Localize.MarkdownString
	rolls?: OracleTableRoll[]
	suggestions?: Metadata.SuggestionsBase
	embed_table?: OracleTableRowID
	template?: OracleRollTemplate
}

export type OracleTableRollMethod =
	| 'no_duplicates'
	| 'keep_duplicates'
	| 'make_it_worse'

export interface OracleTableRoll<
	Times extends number | undefined = number | undefined,
	Method extends OracleTableRollMethod = OracleTableRollMethod
> {
	oracle: string
	times?: Times
	method?: Method
}

export type OracleCollectionID = string
export interface OracleCollection
	extends Abstract.RecursiveCollection<OracleTable, OracleCollectionID> {
	extends?: OracleCollectionID
	rendering?: OracleCollectionRendering
	images?: string[]
	sample_names?: Localize.Label[]
	collections?: Record<string, this>
	// template?: OracleRollTemplate
}

export type OracleCollectionStyle = 'multi_table'

export interface OracleCollectionRendering extends OracleRenderingBase {
	color?: string
	columns: Record<string, OracleCollectionColumn<OracleTableColumn>>
	style?: OracleCollectionStyle | null
}
