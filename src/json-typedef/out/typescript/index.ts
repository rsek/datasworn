// Code generated by jtd-codegen for TypeScript v0.2.1

export type Dataforged = any

export interface Asset {
	abilities: AssetAbility[]
	id: AssetId
	name: Label
	source: Source
	attachments?: AssetAttachment
	condition_meter?: AssetConditionMeter
	controls?: { [key: string]: AssetControlField }

	/**
	 * If `true`, this asset counts as an impact (Starforged) or a debility
	 * (classic Ironsworn).
	 */
	count_as_impact?: boolean
	options?: { [key: string]: AssetOptionField }
	requirement?: MarkdownString

	/**
	 * Most assets only benefit to their owner, but certain assets (like
	 * Starforged's module and command vehicle assets) are shared amongst the
	 * player's allies, too.
	 */
	shared?: boolean
}

export interface AssetAbility {
	enabled: boolean
	id: AssetAbilityId
	text: MarkdownString
	controls?: { [key: string]: AssetAbilityControlField }
	augment_asset?: AssetAugment
	augment_moves?: MoveAugment[]
	moves?: { [key: string]: Move }
	name?: Label
	options?: { [key: string]: AssetAbilityOptionField }
}

export type AssetAbilityControlField =
	| AssetAbilityControlFieldCheckbox
	| AssetAbilityControlFieldClock
	| AssetAbilityControlFieldCounter

export interface AssetAbilityControlFieldCheckbox {
	field_type: 'checkbox'
	id: AssetControlFieldId
	label: Label
	value?: boolean
}

export interface AssetAbilityControlFieldClock {
	field_type: 'clock'
	id: AssetAbilityControlFieldId
	label: Label
	max: number
	min: number
	value?: number
}

export interface AssetAbilityControlFieldCounter {
	field_type: 'counter'
	id: AssetAbilityControlFieldId
	label: Label
	max: number | null
	min: number
	value?: number
}

export type AssetAbilityControlFieldId = string

export type AssetAbilityId = string

export type AssetAbilityOptionField =
	| AssetAbilityOptionFieldSelectAssetAugment
	| AssetAbilityOptionFieldSelectNumber
	| AssetAbilityOptionFieldSelectStat
	| AssetAbilityOptionFieldText

export interface AssetAbilityOptionFieldSelectAssetAugmentChoice {
	label: Label
	value: AssetAugment
	selected?: boolean
}

export interface AssetAbilityOptionFieldSelectAssetAugment {
	field_type: 'select_asset_extension'
	choices: { [key: string]: AssetAbilityOptionFieldSelectAssetAugmentChoice }
	id: AssetControlFieldId
	label: Label
	value?: AssetAugment
}

export interface AssetAbilityOptionFieldSelectNumberChoice {
	label: Label
	value: number
	selected?: boolean
}

export interface AssetAbilityOptionFieldSelectNumber {
	field_type: 'select_number'
	choices: { [key: string]: AssetAbilityOptionFieldSelectNumberChoice }
	id: AssetAbilityOptionFieldId
	label: Label
	value?: number
}

export interface AssetAbilityOptionFieldSelectStatChoice {
	label: Label
	value: PlayerStat
	selected?: boolean
}

export interface AssetAbilityOptionFieldSelectStat {
	field_type: 'select_stat'
	choices: { [key: string]: AssetAbilityOptionFieldSelectStatChoice }
	id: AssetOptionFieldId
	label: Label
	value?: PlayerStat
}

export interface AssetAbilityOptionFieldText {
	field_type: 'text'
	id: AssetOptionFieldId
	label: Label
	value?: string
}

export type AssetAbilityOptionFieldId = string

/**
 * Describes which assets can be attached to this asset. The "canonical" example
 * for this are Starforged's Module assets, which can be equipped by Command
 * Vehicle assets. See p. 55 of Starforged for more info.
 */
export interface AssetAttachment {
	assets: AssetIdwildcard[]

	/**
	 * The maximum number of attached assets. Omitted if there's no upper limit to
	 * the number of attached assets.
	 */
	max?: number
}

export interface AssetConditionMeter {
	id: AssetConditionMeterId
	label: Label
	max: number
	min: number
	controls?: { [key: string]: AssetConditionMeterCheckbox }
	value?: number
}

export enum AssetConditionMeterCheckboxFieldType {
	Checkbox = 'checkbox'
}

export interface AssetConditionMeterCheckbox {
	field_type: AssetConditionMeterCheckboxFieldType
	id: AssetConditionMeterControlFieldId
	label: Label
	value?: boolean
}

export enum AssetConditionMeterControlFieldFieldType {
	Checkbox = 'checkbox'
}

export interface AssetConditionMeterControlField {
	field_type: AssetConditionMeterControlFieldFieldType
	id: AssetConditionMeterControlFieldId
	label: Label
	value?: boolean
}

export type AssetConditionMeterControlFieldId = string

export type AssetConditionMeterId = string

/**
 * Asset controls are fields that are expected to change throughout the asset's
 * lifespan. The most common example are the condition meters on certain assets.
 * A more complex example is the distinct mechanical modes on Ironsworn's
 * 'Armored'.
 */
export type AssetControlField =
	| AssetControlFieldCheckbox
	| AssetControlFieldSelectAssetAugment

export interface AssetControlFieldCheckbox {
	field_type: 'checkbox'
	id: AssetControlFieldId
	label: Label
	value?: boolean
}

export interface AssetControlFieldSelectAssetAugmentChoice {
	label: Label
	value: AssetAugment
	selected?: boolean
}

export interface AssetControlFieldSelectAssetAugment {
	field_type: 'select_asset_extension'
	choices: { [key: string]: AssetControlFieldSelectAssetAugmentChoice }
	id: AssetControlFieldId
	label: Label
	value?: AssetAugment
}

export type AssetControlFieldId = string

export type AssetControlFieldIdwildcard = string

export interface AssetAugmentAttachments {
	assets?: AssetIdwildcard[]
	max?: number
}

export interface AssetAugmentConditionMeter {
	controls?: { [key: string]: AssetConditionMeterControlField }
	max?: number
	min?: number
}

/**
 * Describes changes applied to an asset by its own abilities or controls.
 * Unchanged properties are omitted.
 */
export interface AssetAugment {
	attachments?: AssetAugmentAttachments
	condition_meter?: AssetAugmentConditionMeter
	count_as_impact?: boolean
}

export interface AssetAugmentChoice {
	label: Label
	value: AssetAugment
}

export interface AssetAugmentForeignAttachments {
	assets?: AssetIdwildcard[]
	max?: number
}

export interface AssetAugmentForeignConditionMeter {
	controls?: { [key: string]: AssetConditionMeterControlField }
	max?: number
	min?: number
}

/**
 * Describes changes applied to an asset, usually by another asset. Unchanged
 * properties are omitted.
 */
export interface AssetAugmentForeign {
	augments: AssetIdwildcard
	id: AssetAbilityControlFieldId
	attachments?: AssetAugmentForeignAttachments
	condition_meter?: AssetAugmentForeignConditionMeter
	count_as_impact?: boolean
}

export type AssetId = string

export type AssetIdwildcard = string

/**
 * Asset options are fields that are usually only set once, typically when the
 * player purchases the asset. The most common examples are the "Name" fields
 * on companion assets. A more complex example is the choice of stats on the
 * Devotant asset.
 */
export type AssetOptionField =
	| AssetOptionFieldSelectAssetAugment
	| AssetOptionFieldSelectStat
	| AssetOptionFieldText

export interface AssetOptionFieldSelectAssetAugmentChoice {
	label: Label
	value: AssetAugment
	selected?: boolean
}

export interface AssetOptionFieldSelectAssetAugment {
	field_type: 'select_asset_extension'
	choices: { [key: string]: AssetOptionFieldSelectAssetAugmentChoice }
	id: AssetControlFieldId
	label: Label
	value?: AssetAugment
}

export interface AssetOptionFieldSelectStatChoice {
	label: Label
	value: PlayerStat
	selected?: boolean
}

export interface AssetOptionFieldSelectStat {
	field_type: 'select_stat'
	choices: { [key: string]: AssetOptionFieldSelectStatChoice }
	id: AssetOptionFieldId
	label: Label
	value?: PlayerStat
}

export interface AssetOptionFieldText {
	field_type: 'text'
	id: AssetOptionFieldId
	label: Label
	value?: string
}

export type AssetOptionFieldId = string

/**
 * Challenge rank represented as a number from 1 (troublesome) to 5 (epic)
 */
export type ChallengeRank = 1 | 2 | 3 | 4 | 5

/**
 * A valid CSS color.
 */
export type Color = string

export enum DelveSiteDenizenFrequency {
	Common = 'common',
	Rare = 'rare',
	Uncommon = 'uncommon',
	Unforeseen = 'unforeseen',
	VeryCommon = 'very_common'
}

export interface DelveSiteDenizen {
	frequency: DelveSiteDenizenFrequency
	high: number
	low: number
	encounter?: Id
	name?: Label
}

export interface DelveSiteDomain {
	card_type: 'domain'
	dangers: [
		FeatureOrDanger & { low: 31; high: 33 },
		FeatureOrDanger & { low: 34; high: 36 },
		FeatureOrDanger & { low: 37; high: 39 },
		FeatureOrDanger & { low: 40; high: 42 },
		FeatureOrDanger & { low: 43; high: 45 }
	]
	features: [
		FeatureOrDanger & { low: 21; high: 43 },
		FeatureOrDanger & { low: 44; high: 56 },
		FeatureOrDanger & { low: 57; high: 64 },
		FeatureOrDanger & { low: 65; high: 68 },
		FeatureOrDanger & { low: 69; high: 72 },
		FeatureOrDanger & { low: 73; high: 76 },
		FeatureOrDanger & { low: 77; high: 80 },
		FeatureOrDanger & { low: 81; high: 84 },
		FeatureOrDanger & { low: 85; high: 88 },
		FeatureOrDanger & { low: 89; high: 98 },
		FeatureOrDanger & { low: 99; high: 99 },
		FeatureOrDanger & { low: 100; high: 100 }
	]
	id: DelveSiteDomainId
	name: Label
	source: Source
	summary: MarkdownString
	description?: MarkdownString
	icon?: SvgImageUrl
	suggestions?: Suggestions
}

export type DelveSiteDomainId = string

export interface DelveSiteTheme {
	card_type: 'theme'
	dangers: [
		FeatureOrDanger & { low: 1; high: 5 },
		FeatureOrDanger & { low: 6; high: 10 },
		FeatureOrDanger & { low: 11; high: 12 },
		FeatureOrDanger & { low: 13; high: 14 },
		FeatureOrDanger & { low: 15; high: 16 },
		FeatureOrDanger & { low: 17; high: 18 },
		FeatureOrDanger & { low: 19; high: 20 },
		FeatureOrDanger & { low: 21; high: 22 },
		FeatureOrDanger & { low: 23; high: 24 },
		FeatureOrDanger & { low: 25; high: 26 },
		FeatureOrDanger & { low: 27; high: 28 },
		FeatureOrDanger & { low: 29; high: 30 }
	]
	features: [
		FeatureOrDanger & { low: 1; high: 4 },
		FeatureOrDanger & { low: 5; high: 8 },
		FeatureOrDanger & { low: 9; high: 12 },
		FeatureOrDanger & { low: 13; high: 16 },
		FeatureOrDanger & { low: 17; high: 20 }
	]
	id: DelveSiteThemeId
	name: Label
	source: Source
	summary: MarkdownString
	description?: MarkdownString
	icon?: SvgImageUrl
	suggestions?: Suggestions
}

export type DelveSiteThemeId = string

export type EncounterNatureClassic = string

export type EncounterNatureStarforged = string

export interface EncounterStarforged {
	description: MarkdownString
	drives: MarkdownString[]
	features: MarkdownString[]
	id: Id
	name: Label
	nature: EncounterNatureStarforged
	quest_starter: MarkdownString
	rank: ChallengeRank
	source: Source
	summary: MarkdownString
	tactics: MarkdownString[]
	suggestions?: Suggestions
	variants?: { [key: string]: EncounterVariantStarforged }
}

export interface EncounterVariantStarforged {
	description: MarkdownString
	id: Id
	name: Label
	nature: EncounterNatureStarforged
	rank: ChallengeRank
}

export interface FeatureOrDanger {
	high: number
	id: Id
	low: number
	result: MarkdownString
	description?: MarkdownString
	embed_table?: Id
	icon?: SvgImageUrl
	rolls?: OracleTableRoll[]
	suggestions?: Suggestions
	summary?: MarkdownString
	template?: OracleRollTemplate
}

export type Id = string

/**
 * A user-facing text label or name.
 */
export type Label = string

/**
 * A rich text string in Markdown. Usually this is a direct excerpt from the
 * rules text.
 *
 *       The custom syntax `{{table:some_oracle_table_id}}` represents a
 * markdown table rendered from oracle data.
 */
export type MarkdownString = string

export interface Move {
	id: MoveId
	name: Label
	outcomes: MoveOutcomes
	source: Source
	text: MarkdownString
	trigger: Trigger
	oracles?: OracleTableId[]
	suggestions?: Suggestions
}

export interface MoveCategory {
	color: Color
	contents: { [key: string]: Move }
	id: MoveCategoryId
	name: Label
	source: Source
	summary: MarkdownString
	canonical_name?: Label
	description?: MarkdownString
	suggestions?: Suggestions
}

export type MoveCategoryId = string

export interface MoveAugment {
	augments: MoveId[] | null
	trigger: TriggerAugment
	outcomes?: MoveOutcomesAugment
	text?: MarkdownString
}

/**
 * A move ID, for a standard move or a unique asset move
 */
export type MoveId = string

export interface MoveOutcome {
	text: MarkdownString
	count_as?: MoveOutcomeType
	reroll?: MoveReroll
}

export interface MoveOutcomeAugmentReroll {
	method?: MoveRerollMethod
	text?: MarkdownString
}

/**
 * s or upgrades an outcome from an existing move.
 */
export interface MoveOutcomeAugment {
	count_as?: MoveOutcomeType
	reroll?: MoveOutcomeAugmentReroll
	text?: MarkdownString
}

export interface MoveOutcomeMatchable {
	text: MarkdownString
	count_as?: MoveOutcomeType
	match?: MoveOutcome
	reroll?: MoveReroll
}

export interface MoveOutcomeMatchableAugmentReroll {
	method?: MoveRerollMethod
	text?: MarkdownString
}

/**
 * s or upgrades an outcome from an existing move.
 */
export interface MoveOutcomeMatchableAugment {
	count_as?: MoveOutcomeType
	match?: MoveOutcomeAugment
	reroll?: MoveOutcomeMatchableAugmentReroll
	text?: MarkdownString
}

export enum MoveOutcomeType {
	/**
	 * The player's score doesn't beat any challenge dice.
	 */
	Miss = 'miss',

	/**
	 * The player's score beats both of the challenge dice.
	 */
	StrongHit = 'strong_hit',

	/**
	 * The player's score beats one of the challenge dice.
	 */
	WeakHit = 'weak_hit'
}

export interface MoveOutcomes {
	miss: MoveOutcomeMatchable
	strong_hit: MoveOutcomeMatchable
	weak_hit: MoveOutcome
}

/**
 * s or upgrades one or more outcomes of an existing move.
 */
export interface MoveOutcomesAugment {
	miss?: MoveOutcomeMatchableAugment
	strong_hit?: MoveOutcomeMatchableAugment
	weak_hit?: MoveOutcomeAugment
}

export interface MoveReroll {
	method: MoveRerollMethod

	/**
	 * Describes the trigger condition for the reroll, if any.
	 */
	text?: MarkdownString
}

export enum MoveRerollMethod {
	/**
	 * Reroll the action die
	 */
	ActionDie = 'action_die',

	/**
	 * Reroll all dice
	 */
	All = 'all',

	/**
	 * Reroll any number of dice
	 */
	Any = 'any',

	/**
	 * Reroll any number of challenge dice
	 */
	ChallengeDice = 'challenge_dice',

	/**
	 * Reroll one of the challenge dice
	 */
	ChallengeDie = 'challenge_die'
}

export enum MoveRollMethod {
	/**
	 * When rolling with this move trigger option, *every* stat or progress track
	 * of the `using` key is rolled
	 */
	All = 'all',

	/**
	 * When rolling with this move trigger option, the player picks which stat
	 * to use.
	 */
	Any = 'any',

	/**
	 * When rolling with this move trigger option, use the highest/best option
	 * from the `using` key.
	 */
	Highest = 'highest',

	/**
	 * When rolling with this move trigger option, use the lowest/worst option
	 * from the `using` key.
	 */
	Lowest = 'lowest',

	/**
	 * Take an automatic miss instead of rolling.
	 */
	Miss = 'miss',

	/**
	 * Take an automatic strong hit instead of rolling.
	 */
	StrongHit = 'strong_hit',

	/**
	 * Take an automatic weak hit instead of rolling.
	 */
	WeakHit = 'weak_hit'
}

export interface OracleCollection {
	id: OracleCollectionId
	name: Label
	source: Source
	summary: MarkdownString
	canonical_name?: Label
	collections?: { [key: string]: OracleCollection }
	color?: Color
	contents?: { [key: string]: OracleTable }
	description?: MarkdownString
	augments?: OracleCollectionId
	rendering?: OracleCollectionRendering
	sample_names?: Label[]
	suggestions?: Suggestions
}

export interface OracleCollectionColumn {
	content_type: OracleColumnContentType
	table_key: string
	color?: Color
	label?: Label
}

export type OracleCollectionId = string

export interface OracleCollectionRendering {
	columns: { [key: string]: OracleCollectionColumn }
	color?: Color
	style?: OracleCollectionStyle | null
}

export enum OracleCollectionStyle {
	MultiTable = 'multi_table'
}

export enum OracleColumnContentType {
	Description = 'description',
	Range = 'range',
	Result = 'result',
	Summary = 'summary'
}

export interface OracleRollTemplate {
	description?: TemplateString
	result?: TemplateString
	summary?: TemplateString
}

export interface OracleTable {
	id: OracleTableId
	name: Label
	source: Source
	table: OracleTableRow[]
	canonical_name?: Label
	description?: MarkdownString
	match?: OracleTableMatchBehavior
	rendering?: OracleTableRendering
	suggestions?: Suggestions
	summary?: MarkdownString
}

export interface OracleTableColumn {
	content_type: OracleColumnContentType
	label?: Label
}

export type OracleTableId = string

export interface OracleTableMatchBehavior {
	text: MarkdownString
}

export interface OracleTableRendering {
	color?: Color
	columns?: { [key: string]: OracleTableColumn }
	icon?: SvgImageUrl
	style?: OracleTableStyle
}

export interface OracleTableRoll {
	oracle: OracleTableId
	auto?: boolean
	method?: OracleTableRollMethod
	times?: number
}

export enum OracleTableRollMethod {
	KeepDuplicates = 'keep_duplicates',
	MakeItWorse = 'make_it_worse',
	NoDuplicates = 'no_duplicates'
}

export interface OracleTableRow {
	high: number | null
	id: OracleTableRowId
	low: number | null
	result: MarkdownString
	description?: MarkdownString
	embed_table?: OracleTableId
	icon?: SvgImageUrl
	rolls?: OracleTableRoll[]
	suggestions?: Suggestions
	summary?: MarkdownString
	template?: OracleRollTemplate
}

export type OracleTableRowId = string

export enum OracleTableStyle {
	EmbedAsColumn = 'embed_as_column',
	EmbedInRow = 'embed_in_row',
	Table = 'table'
}

/**
 * A standard player stat, or a condition meter that can be used as a stat in an
 * action roll.
 */
export enum PlayerAttributeRollable {
	Edge = 'edge',
	Health = 'health',
	Heart = 'heart',
	Iron = 'iron',
	Shadow = 'shadow',
	Spirit = 'spirit',
	Supply = 'supply',
	Wits = 'wits'
}

/**
 * A standard player character condition meter.
 */
export enum PlayerConditionMeter {
	Health = 'health',
	Spirit = 'spirit',
	Supply = 'supply'
}

/**
 * A standard player character stat.
 */
export enum PlayerStat {
	Edge = 'edge',
	Heart = 'heart',
	Iron = 'iron',
	Shadow = 'shadow',
	Wits = 'wits'
}

export enum ProgressType {
	/**
	 * A player's Bonds legacy track(Starforged ruleset only)
	 */
	BondsLegacy = 'bonds_legacy',

	/**
	 * A player's bonds progress track (Ironsworn ruleset only)
	 */
	BondsProgress = 'bonds_progress',

	/**
	 * A combat progress track, started with Enter the Fray.
	 */
	CombatProgress = 'combat_progress',

	/**
	 * A connection progress track, started with Make a Connection (Starforged
	 * ruleset only)
	 */
	ConnectionProgress = 'connection_progress',

	/**
	 * A delve site progress track, started with Discover a Site (Ironsworn
	 * ruleset only)
	 */
	DelveProgress = 'delve_progress',

	/**
	 * A player's Discoveries legacy track(Starforged ruleset only)
	 */
	DiscoveriesLegacy = 'discoveries_legacy',

	/**
	 * An expedition progress track, started with Undertake an Expedition
	 * (Starforged ruleset only)
	 */
	ExpeditionProgress = 'expedition_progress',

	/**
	 * A player's failure track (see p. 59 of Ironsworn: Delve)
	 */
	FailureTrack = 'failure_track',

	/**
	 * A journey progress track, started with Undertake a Journey (Ironsworn
	 * ruleset only)
	 */
	JourneyProgress = 'journey_progress',

	/**
	 * A player's Quests legacy track (Starforged ruleset only)
	 */
	QuestsLegacy = 'quests_legacy',

	/**
	 * A scene challenge progress track.
	 */
	SceneChallengeProgress = 'scene_challenge_progress',

	/**
	 * A vow progress track, started with Swear an Iron Vow.
	 */
	VowProgress = 'vow_progress'
}

export interface Rarity {
	asset: AssetId
	description: MarkdownString
	id: RarityId
	name: Label
	source: Source
	xp_cost: number
	icon?: SvgImageUrl
	suggestions?: Suggestions
}

export type RarityId = string

export interface RegionEntry {
	description: MarkdownString
	features: MarkdownString[]
	id: RegionEntryId
	name: Label
	quest_starter: MarkdownString
	source: Source
	summary: MarkdownString
	suggestions?: Suggestions
}

export type RegionEntryId = string

export interface SettingTruth {
	id: SettingTruthId
	name: Label
	options: SettingTruthOption[]
	source: Source
	icon?: SvgImageUrl
	suggestions?: Suggestions
}

export type SettingTruthId = string

export interface SettingTruthOption {
	description: MarkdownString
	id: SettingTruthOptionId
	quest_starter: MarkdownString
	summary: MarkdownString
}

export type SettingTruthOptionId = string

export interface Source {
	authors: string[]
	date: string
	license: Url
	title: string
	url: Url
	page?: number
}

export interface Suggestions {
	assets?: AssetIdwildcard[]
	moves?: MoveId[]
	oracles?: OracleTableId[]
}

/**
 * A relative URL pointing to an SVG image.
 */
export type SvgImageUrl = string

/**
 * A rich text string in Markdown with replaced values from oracle roll results.
 *
 *       The custom syntax `{{some_row_key:some_oracle_table_id}}`
 * should be replaced by the `some_row_key` string of a rolled
 * oracle table. This is usually the `result` key, for example
 * `{{result:starforged/oracles/core/action}}`
 */
export type TemplateString = string

/**
 * Describes a move's trigger condition(s) and any rolls associated with them.
 */
export type Trigger = TriggerActionRoll | TriggerProgressRoll

export interface TriggerActionRoll {
	move_type: 'action_roll'

	/**
	 * Text describing the primary trigger condition of the move. Any trigger
	 * options are assumed to meet this condition in addition to their own trigger
	 * conditions.
	 */
	text: MarkdownString
	conditions?: TriggerRollConditionAction[]
}

export interface TriggerProgressRoll {
	move_type: 'progress_roll'

	/**
	 * Text describing the primary trigger condition of the move. Any trigger
	 * options are assumed to meet this condition in addition to their own trigger
	 * conditions.
	 */
	text: MarkdownString
	conditions?: TriggerRollConditionProgress[]
}

/**
 * Information on who can trigger this trigger option. Usually this is just the
 * player, but some asset abilities can trigger from an ally's move.
 */
export interface TriggerBy {
	ally: boolean
	player: boolean
}

/**
 * s or upgrades an existing move trigger.
 */
export type TriggerAugment =
	| TriggerAugmentActionRoll
	| TriggerAugmentProgressRoll

/**
 * s or upgrades an existing action roll trigger.
 */
export interface TriggerAugmentActionRoll {
	move_type: 'action_roll'
	conditions: TriggerRollConditionAction[]
}

/**
 * s or upgrades an existing action roll trigger.
 */
export interface TriggerAugmentProgressRoll {
	move_type: 'progress_roll'
	conditions: TriggerRollConditionProgress[]
}

export interface TriggerRollConditionAction {
	method: MoveRollMethod | null
	by?: TriggerBy
	choices?: TriggerRollConditionActionChoice[]

	/**
	 * Describes any additional trigger conditions for this trigger option
	 */
	text?: MarkdownString
}

export type TriggerRollConditionActionChoice =
	| TriggerRollConditionActionChoiceAttachedAssetRef
	| TriggerRollConditionActionChoiceCustomValue
	| TriggerRollConditionActionChoiceEdge
	| TriggerRollConditionActionChoiceHealth
	| TriggerRollConditionActionChoiceHeart
	| TriggerRollConditionActionChoiceIron
	| TriggerRollConditionActionChoiceRef
	| TriggerRollConditionActionChoiceShadow
	| TriggerRollConditionActionChoiceSpirit
	| TriggerRollConditionActionChoiceSupply
	| TriggerRollConditionActionChoiceWits

export interface TriggerRollConditionActionChoiceAttachedAssetRef {
	using: 'attached_asset_ref'
	ref: string
}

export interface TriggerRollConditionActionChoiceCustomValue {
	using: 'custom_value'
	label: Label
	value: number
}

export interface TriggerRollConditionActionChoiceEdge {
	using: 'edge'
}

export interface TriggerRollConditionActionChoiceHealth {
	using: 'health'
}

export interface TriggerRollConditionActionChoiceHeart {
	using: 'heart'
}

export interface TriggerRollConditionActionChoiceIron {
	using: 'iron'
}

export interface TriggerRollConditionActionChoiceRef {
	using: 'ref'
	ref: string
}

export interface TriggerRollConditionActionChoiceShadow {
	using: 'shadow'
}

export interface TriggerRollConditionActionChoiceSpirit {
	using: 'spirit'
}

export interface TriggerRollConditionActionChoiceSupply {
	using: 'supply'
}

export interface TriggerRollConditionActionChoiceWits {
	using: 'wits'
}

export interface TriggerRollConditionProgress {
	method: MoveRollMethod | null
	by?: TriggerBy
	choices?: TriggerRollConditionProgressChoice[]

	/**
	 * Describes any additional trigger conditions for this trigger option
	 */
	text?: MarkdownString
}

export interface TriggerRollConditionProgressChoice {
	using: ProgressType
}

/**
 * An absolute URL pointing to a web site.
 */
export type Url = string

/**
 * A relative URL pointing to a WEBP image.
 */
export type WebpImageUrl = string

export interface WorldTruth {
	id: WorldTruthId
	name: Label
	options: WorldTruthOption[]
	source: Source
	icon?: SvgImageUrl
	suggestions?: Suggestions
}

export type WorldTruthId = string

export interface WorldTruthOption {
	description: MarkdownString
	id: WorldTruthOptionId
	quest_starter: MarkdownString
}

export type WorldTruthOptionId = string
