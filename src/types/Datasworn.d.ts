/**
 *   - `miss`: An automatic miss.
 *   - `weak_hit`: An automatic weak hit.
 *   - `strong_hit`: An automatic strong hit.
 *   - `player_choice`: The player chooses which roll option to use.
 *   - `highest`: Use the roll option with the best/highest value.
 *   - `lowest`: Use the roll option with the worst/lowest value.
 *   - `all`: Use _every_ roll option at once.
 */
export type ActionRollMethod = "miss" | "weak_hit" | "strong_hit" | "player_choice" | "highest" | "lowest" | "all"

/**
 * Represents any kind of non-wildcard ID, including IDs of embedded objects.
 */
export type AnyId = AtlasEntryId | NpcId | NpcVariantId | OracleRollableId | AssetAbilityOracleRollableId | MoveOracleRollableId | TruthOptionOracleRollableId | OracleRollableRowId | AssetAbilityOracleRollableRowId | MoveOracleRollableRowId | TruthOptionOracleRollableRowId | AssetId | AssetAbilityId | AssetAbilityMoveId | MoveId | AtlasCollectionId | NpcCollectionId | OracleCollectionId | AssetCollectionId | MoveCategoryId | DelveSiteId | DelveSiteDenizenId | DelveSiteDomainId | DelveSiteDomainFeatureId | DelveSiteThemeFeatureId | DelveSiteDomainDangerId | DelveSiteThemeDangerId | DelveSiteThemeId | RarityId | TruthId | TruthOptionId

/**
 * Represents any kind of wildcard ID, including IDs of embedded objects.
 */
export type AnyIdWildcard = AtlasEntryIdWildcard | NpcIdWildcard | NpcVariantIdWildcard | OracleRollableIdWildcard | AssetAbilityOracleRollableIdWildcard | MoveOracleRollableIdWildcard | TruthOptionOracleRollableIdWildcard | OracleRollableRowIdWildcard | AssetAbilityOracleRollableRowIdWildcard | MoveOracleRollableRowIdWildcard | TruthOptionOracleRollableRowIdWildcard | AssetIdWildcard | AssetAbilityIdWildcard | AssetAbilityMoveIdWildcard | MoveIdWildcard | AtlasCollectionIdWildcard | NpcCollectionIdWildcard | OracleCollectionIdWildcard | AssetCollectionIdWildcard | MoveCategoryIdWildcard | DelveSiteIdWildcard | DelveSiteDenizenIdWildcard | DelveSiteDomainIdWildcard | DelveSiteDomainFeatureIdWildcard | DelveSiteThemeFeatureIdWildcard | DelveSiteDomainDangerIdWildcard | DelveSiteThemeDangerIdWildcard | DelveSiteThemeIdWildcard | RarityIdWildcard | TruthIdWildcard | TruthOptionIdWildcard

export type AnyMove = Move | EmbeddedMove

export type AnyMoveId = MoveId | AssetAbilityMoveId

export type AnyMoveIdWildcard = MoveIdWildcard | AssetAbilityMoveIdWildcard

export type AnyOracleRollable = OracleRollable | EmbeddedOracleRollable

export type AnyOracleRollableId = OracleRollableId | AssetAbilityOracleRollableId | TruthOptionOracleRollableId | MoveOracleRollableId

export type AnyOracleRollableIdWildcard = OracleRollableIdWildcard | AssetAbilityOracleRollableIdWildcard | TruthOptionOracleRollableIdWildcard | MoveOracleRollableIdWildcard

export type AnyOracleRollableRowId = OracleRollableRowId | AssetAbilityOracleRollableRowId | MoveOracleRollableRowId | TruthOptionOracleRollableRowId

export type AnyOracleRollableRowIdWildcard = OracleRollableRowIdWildcard | AssetAbilityOracleRollableRowIdWildcard | MoveOracleRollableRowIdWildcard | TruthOptionOracleRollableRowIdWildcard

export interface Asset {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: AssetId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: AssetIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * A localized category label for this asset. This is the surtitle above the asset's name on the card.
	 * @example "Combat Talent"
	 * @example "Command Vehicle"
	 * @example "Companion"
	 * @example "Deed"
	 * @example "Module"
	 * @example "Path"
	 * @example "Ritual"
	 * @example "Support Vehicle"
	 */
	category: Label;
	/**
	 * Options are input fields set when the player purchases the asset. They're likely to remain the same through the life of the asset. Typically, they are rendered at the top of the asset card.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	options: Record<DictKey, AssetOptionField>;
	/**
	 * Describes prerequisites for purchasing or using this asset.
	 */
	requirement?: MarkdownString;
	abilities: AssetAbility[];
	/**
	 * Controls are condition meters, clocks, counters, and other asset input fields whose values are expected to change throughout the life of the asset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	controls?: Record<DictKey, AssetControlField>;
	/**
	 * If `true`, this asset counts as an impact (Starforged) or a debility (classic Ironsworn).
	 * @default false
	 */
	count_as_impact: boolean;
	attachments?: AssetAttachment;
	/**
	 * Most assets only benefit to their owner, but certain assets (like Starforged's module and command vehicle assets) are shared amongst the player's allies, too.
	 * @default false
	 */
	shared: boolean;
	type: "asset";
}

/**
 * An asset ability: one of the purchasable features of an asset. Most assets have three.
 */
export interface AssetAbility {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: AssetAbilityId;
	_comment?: Documentation;
	/**
	 * A handful of asset abilities have a label/name, for instance classic Ironsworn companion assets. Most canonical assets omit this property.
	 */
	name?: Label;
	/**
	 * The complete rules text of this asset ability.
	 */
	text: MarkdownString;
	/**
	 * Is this asset ability enabled?
	 * @default false
	 */
	enabled: boolean;
	/**
	 * Unique moves added by this asset ability.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	moves?: Record<DictKey, EmbeddedMove>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles?: Record<DictKey, EmbeddedOracleRollable>;
	/**
	 * Fields that are expected to be set once and remain the same through the life of the asset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	options?: Record<DictKey, AssetAbilityOptionField>;
	/**
	 * Fields whose values are expected to change over the life of the asset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	controls?: Record<DictKey, AssetAbilityControlField>;
	/**
	 * Changes made to the asset, when this ability is enabled.
	 */
	enhance_asset?: AssetEnhancement;
	/**
	 * Describes changes made to various moves by this asset ability. Usually these require specific trigger conditions.
	 */
	enhance_moves?: MoveEnhancement[];
	tags?: Tags;
}

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetAbilityControlField = ClockField | CounterField | AssetCheckboxField | TextField

/**
 * A unique ID representing an AssetAbility object.
 * @pattern ```javascript
 * /^asset\.ability:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.(\d+)$/
 * ```
 */
export type AssetAbilityId = string

/**
 * A wildcarded AssetAbilityId that can be used to match multiple AssetAbility objects.
 * @pattern ```javascript
 * /^asset\.ability:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.(\d+|\*)$/
 * ```
 */
export type AssetAbilityIdWildcard = string

/**
 * A unique ID representing an AssetAbilityMove object.
 * @pattern ```javascript
 * /^asset\.ability\.move:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.(\d+)\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type AssetAbilityMoveId = string

/**
 * A wildcarded AssetAbilityMoveId that can be used to match multiple AssetAbilityMove objects.
 * @pattern ```javascript
 * /^asset\.ability\.move:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.(\d+|\*)\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type AssetAbilityMoveIdWildcard = string

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetAbilityOptionField = TextField

/**
 * A unique ID representing an AssetAbilityOracleRollable object.
 * @pattern ```javascript
 * /^asset\.ability\.oracle_rollable:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.(\d+)\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type AssetAbilityOracleRollableId = string

/**
 * A wildcarded AssetAbilityOracleRollableId that can be used to match multiple AssetAbilityOracleRollable objects.
 * @pattern ```javascript
 * /^asset\.ability\.oracle_rollable:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.(\d+|\*)\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type AssetAbilityOracleRollableIdWildcard = string

/**
 * A unique ID representing an AssetAbilityOracleRollableRow object.
 * @pattern ```javascript
 * /^asset\.ability\.oracle_rollable\.row:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.(\d+)\.([a-z][a-z0-9_]*|\*)\.(\d+)$/
 * ```
 */
export type AssetAbilityOracleRollableRowId = string

/**
 * A wildcarded AssetAbilityOracleRollableRowId that can be used to match multiple AssetAbilityOracleRollableRow objects.
 * @pattern ```javascript
 * /^asset\.ability\.oracle_rollable\.row:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.(\d+|\*)\.([a-z][a-z0-9_]*|\*)\.(\d+|\*)$/
 * ```
 */
export type AssetAbilityOracleRollableRowIdWildcard = string

/**
 * Describes which assets can be attached to this asset. Example: Starforged's Module assets, which can be equipped by Command Vehicle assets. See p. 55 of Starforged for more info.
 */
export interface AssetAttachment {
	/**
	 * Asset IDs (which may be wildcards) that may be attached to this asset
	 */
	assets: AssetIdWildcard[];
	/**
	 * Null if there's no upper limit to the number of attached assets.
	 * @default null
	 */
	max: number | null;
}

export interface AssetCardFlipField {
	label: Label;
	/**
	 * Is the card flipped over?
	 * @default false
	 */
	value: boolean;
	field_type: "card_flip";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
	/**
	 * Does this field count as an impact (Starforged) or debility (Ironsworn classic) when its value is set to `true`?
	 * @default false
	 */
	is_impact: boolean;
	/**
	 * Does this field disable the asset when its value is set to `true`?
	 * @default false
	 */
	disables_asset: boolean;
}

export interface AssetCheckboxField {
	label: Label;
	/**
	 * Is the box checked?
	 * @default false
	 */
	value: boolean;
	field_type: "checkbox";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
	/**
	 * Does this field count as an impact (Starforged) or debility (Ironsworn classic) when its value is set to `true`?
	 * @default false
	 */
	is_impact: boolean;
	/**
	 * Does this field disable the asset when its value is set to `true`?
	 * @default false
	 */
	disables_asset: boolean;
}

export interface AssetCollection {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: AssetCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: AssetCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: AssetCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, Asset>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	collections: Record<DictKey, AssetCollection>;
	type: "asset_collection";
}

/**
 * A unique ID representing an AssetCollection object.
 * @pattern ```javascript
 * /^asset_collection:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){1,4})$/
 * ```
 */
export type AssetCollectionId = string

/**
 * A wildcarded AssetCollectionId that can be used to match multiple AssetCollection objects.
 * @pattern ```javascript
 * /^asset_collection:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){1,4})$/
 * ```
 */
export type AssetCollectionIdWildcard = string

/**
 * Some assets provide a special condition meter of their own. The most common example is the health meters on companion assets. Asset condition meters may also include their own controls, such as the checkboxes that Starforged companion assets use to indicate they are "out of action".
 */
export interface AssetConditionMeter {
	label: Label;
	/**
	 * The current value of this meter.
	 * @default 0
	 */
	value: number;
	/**
	 * The minimum value of this meter.
	 * @default 0
	 */
	min: number;
	/**
	 * The maximum value of this meter.
	 */
	max: number;
	/**
	 * Is this meter's `value` usable as a stat in an action roll?
	 */
	rollable: true;
	field_type: "condition_meter";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
	/**
	 * Provides hints for moves that interact with this condition meter, such as suffer and recovery moves.
	 * @experimental
	 */
	moves?: {
		/**
		 * The ID(s) of suffer moves associated with the condition meter. If the suffer move makes an action roll, this condition meter value should be made available as a roll option.
		 */
		suffer?: AnyMoveIdWildcard[];
		/**
		 * The ID(s) of recovery moves associated with this meter.
		 */
		recover?: AnyMoveIdWildcard[];
	};
	/**
	 * Checkbox controls rendered as part of the condition meter.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	controls: Record<DictKey, AssetConditionMeterControlField>;
}

/**
 * A checkbox control field, rendered as part of an asset condition meter.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetConditionMeterControlField = AssetCheckboxField | AssetCardFlipField

/**
 * Some assets provide a special condition meter of their own. The most common example is the health meters on companion assets. Asset condition meters may also include their own controls, such as the checkboxes that Starforged companion assets use to indicate they are "out of action".
 */
export interface AssetConditionMeterEnhancement {
	field_type: "condition_meter";
	/**
	 * The maximum value of this meter.
	 */
	max: number;
}

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetControlField = AssetConditionMeter | SelectEnhancementField | AssetCheckboxField | AssetCardFlipField

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetControlFieldEnhancement = AssetConditionMeterEnhancement

/**
 * A reference to the value of an asset control.
 */
export interface AssetControlValueRef {
	/**
	 * Asset IDs (which may be wildcarded) that may provide the control field. For asset ability enhancements, `null` is used to represent the asset's own control fields.
	 * @default null
	 */
	assets: AssetIdWildcard[] | null;
	/**
	 * The dictionary key of the asset control field.
	 * @example "health"
	 * @example "integrity"
	 */
	control: DictKey;
	/**
	 * A reference to the value of an asset control.
	 */
	using: "asset_control";
}

/**
 * Describes enhancements made to this asset in a partial asset object. The changes should be applied recursively; only the values that are specified should be changed.
 */
export interface AssetEnhancement {
	/**
	 * Controls are condition meters, clocks, counters, and other asset input fields whose values are expected to change throughout the life of the asset.
	 * @remarks Deserialize as a dictionary object.
	 */
	controls?: Record<DictKey, AssetControlFieldEnhancement>;
	suggestions?: Suggestions;
	/**
	 * If `true`, this asset counts as an impact (Starforged) or a debility (classic Ironsworn).
	 */
	count_as_impact?: boolean;
	attachments?: AssetAttachment;
	/**
	 * Most assets only benefit to their owner, but certain assets (like Starforged's module and command vehicle assets) are shared amongst the player's allies, too.
	 */
	shared?: boolean;
}

/**
 * A unique ID representing an Asset object.
 * @pattern ```javascript
 * /^asset:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})$/
 * ```
 */
export type AssetId = string

/**
 * A wildcarded AssetId that can be used to match multiple Asset objects.
 * @pattern ```javascript
 * /^asset:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})$/
 * ```
 */
export type AssetIdWildcard = string

/**
 * Options are asset input fields which are set once, usually when the character takes the asset. The most common example is the "name" field on companion assets. A more complex example is the choice of a god's stat for the Devotant asset.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetOptionField = SelectValueField | SelectEnhancementField | TextField

/**
 * A reference to the value of an asset option.
 */
export interface AssetOptionValueRef {
	/**
	 * Asset IDs (which may be wildcarded) that may provide the option field. For asset ability enhancements, `null` is used to represent the asset's own option fields.
	 * @default null
	 */
	assets: AssetIdWildcard[] | null;
	/**
	 * The dictionary key of the asset option field.
	 */
	option: DictKey;
	/**
	 * A reference to the value of an asset option.
	 */
	using: "asset_option";
}

export interface AtlasCollection {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: AtlasCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: AtlasCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: AtlasCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, AtlasEntry>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	collections: Record<DictKey, AtlasCollection>;
	type: "atlas_collection";
}

/**
 * A unique ID representing an AtlasCollection object.
 * @pattern ```javascript
 * /^atlas_collection:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){1,4})$/
 * ```
 */
export type AtlasCollectionId = string

/**
 * A wildcarded AtlasCollectionId that can be used to match multiple AtlasCollection objects.
 * @pattern ```javascript
 * /^atlas_collection:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){1,4})$/
 * ```
 */
export type AtlasCollectionIdWildcard = string

/**
 * An atlas entry, like the Ironlands region entries found in classic Ironsworn.
 */
export interface AtlasEntry {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: AtlasEntryId;
	_comment?: Documentation;
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: AtlasEntryIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	features: MarkdownString[];
	summary?: MarkdownString;
	description: MarkdownString;
	quest_starter?: MarkdownString;
	your_truth?: MarkdownString;
	type: "atlas_entry";
}

/**
 * A unique ID representing an AtlasEntry object.
 * @pattern ```javascript
 * /^atlas_entry:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})$/
 * ```
 */
export type AtlasEntryId = string

/**
 * A wildcarded AtlasEntryId that can be used to match multiple AtlasEntry objects.
 * @pattern ```javascript
 * /^atlas_entry:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})$/
 * ```
 */
export type AtlasEntryIdWildcard = string

/**
 * A reference to the value of an attached asset control. For example, a Module asset could use this to roll using the `integrity` control of an attached Vehicle.
 */
export interface AttachedAssetControlValueRef {
	/**
	 * The dictionary key of the asset control field.
	 * @example "health"
	 * @example "integrity"
	 */
	control: DictKey;
	/**
	 * A reference to the value of an attached asset control. For example, a Module asset could use this to roll using the `integrity` control of an attached Vehicle.
	 */
	using: "attached_asset_control";
}

/**
 * A reference to the value of an attached asset option.
 */
export interface AttachedAssetOptionValueRef {
	/**
	 * The dictionary key of the asset option field.
	 */
	option: DictKey;
	/**
	 * A reference to the value of an attached asset option.
	 */
	using: "attached_asset_option";
}

/**
 * Information on the original creator of this material.
 * @example ```javascript
 * 	{
 * 		name: "Shawn Tomkin",
 * 		url: "https://ironswornrpg.com"
 * 	}
 * ```
 */
export interface AuthorInfo {
	/**
	 * The name of the author.
	 * @example "Shawn Tomkin"
	 */
	name: Label;
	/**
	 * An optional email contact for the author
	 */
	email?: Email;
	/**
	 * An optional URL for the author's website.
	 */
	url?: WebUrl;
}

/**
 * Challenge rank, represented as an integer from 1 (troublesome) to 5 (epic).
 * 
 *   - `1`: Troublesome
 *   - `2`: Dangerous
 *   - `3`: Formidable
 *   - `4`: Extreme
 *   - `5`: Epic
 */
export type ChallengeRank = 1 | 2 | 3 | 4 | 5

/**
 * A clock with 4 or more segments.
 * @remarks Semantics are similar to HTML `<input type="number">`, but rendered as a clock (a circle with equally sized wedges).
 */
export interface ClockField {
	label: Label;
	/**
	 * The current value of this input.
	 * @default 0
	 */
	value: number;
	/**
	 * The minimum number of filled clock segments. This is always 0.
	 */
	min: 0;
	/**
	 * The size of the clock -- in other words, the maximum number of filled clock segments. Standard clocks have 4, 6, 8, or 10 segments.
	 * @minimum 2
	 */
	max: number;
	rollable: false;
	field_type: "clock";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
}

export type CollectableType = "atlas_entry" | "npc" | "oracle_rollable" | "asset" | "move"

export type CollectionType = "atlas_collection" | "npc_collection" | "oracle_collection" | "asset_collection" | "move_category"

/**
 * A meter with an integer value, bounded by a minimum and maximum.
 */
export interface ConditionMeterField {
	label: Label;
	/**
	 * The current value of this meter.
	 * @default 0
	 */
	value: number;
	/**
	 * The minimum value of this meter.
	 * @default 0
	 */
	min: number;
	/**
	 * The maximum value of this meter.
	 */
	max: number;
	/**
	 * Is this meter's `value` usable as a stat in an action roll?
	 */
	rollable: true;
	field_type: "condition_meter";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
}

/**
 * A basic, rollable player character resource specified by the ruleset.
 * @example "health"
 * @example "spirit"
 * @example "supply"
 */
export type ConditionMeterKey = DictKey

/**
 * Describes a standard player character condition meter.
 */
export interface ConditionMeterRule {
	/**
	 * A description of this condition meter.
	 */
	description: MarkdownString;
	/**
	 * Is this condition meter shared by all players?
	 * @default false
	 */
	shared: boolean;
	/**
	 * @experimental
	 */
	tags?: Tags;
	label: Label;
	/**
	 * The current value of this meter.
	 * @default 0
	 */
	value: number;
	/**
	 * The minimum value of this meter.
	 * @default 0
	 */
	min: number;
	/**
	 * The maximum value of this meter.
	 */
	max: number;
	/**
	 * Is this meter's `value` usable as a stat in an action roll?
	 */
	rollable: true;
}

/**
 * A reference to the value of a standard player condition meter.
 */
export interface ConditionMeterValueRef {
	condition_meter: ConditionMeterKey;
	/**
	 * A reference to the value of a standard player condition meter.
	 */
	using: "condition_meter";
}

export interface CoreTags {
	/**
	 * This object is supernatural in nature, and is ideal for settings that feature supernatural or mythic powers.
	 */
	supernatural?: boolean;
	/**
	 * This object is technological in nature, and is ideal for settings that feature remarkable technologies.
	 */
	technological?: boolean;
	/**
	 * This object requires allies to function, and is intended for co-op play, or guided play with allies. It is not appropriate for solo play.
	 */
	requires_allies?: boolean;
}

/**
 * A basic counter representing a non-rollable integer value. They usually start at 0, and may or may not have a maximum.
 * @remarks Semantics are similar to `<input type="number" step="1">`
 */
export interface CounterField {
	label: Label;
	/**
	 * The current value of this input.
	 * @default 0
	 */
	value: number;
	/**
	 * The (inclusive) minimum value.
	 * @default 0
	 */
	min: number;
	/**
	 * The (inclusive) maximum value, or `null` if there's no maximum.
	 * @default null
	 */
	max: number | null;
	rollable: false;
	field_type: "counter";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
}

/**
 * A CSS color value.
 * @remarks See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 */
export type CssColor = string

/**
 * An arbitrary static integer value with a label.
 */
export interface CustomValue {
	label: Label;
	value: number;
	/**
	 * An arbitrary static integer value with a label.
	 */
	using: "custom";
}

/**
 * A delve site with a theme, domain, and denizens.
 */
export interface DelveSite {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: DelveSiteId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: DelveSiteIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	rank: ChallengeRank;
	/**
	 * The ID of an atlas entry representing the region in which this delve site is located.
	 */
	region?: AtlasEntryId;
	/**
	 * The ID of the site's DelveSiteTheme card.
	 */
	theme: DelveSiteThemeId;
	/**
	 * The ID of the site's DelveSiteDomain card.
	 */
	domain: DelveSiteDomainId;
	/**
	 * An additional theme or domain card ID, for use with optional rules in Ironsworn: Delve.
	 */
	extra_card?: DelveSiteThemeId | DelveSiteDomainId;
	description: MarkdownString;
	/**
	 * Represents the delve site's denizen matrix as an array of objects.
	 */
	denizens: DelveSiteDenizen[] & [
		{
			frequency: "very_common";
			roll: {
				min: 1;
				max: 27;
			};
		},
		{
			frequency: "common";
			roll: {
				min: 28;
				max: 41;
			};
		},
		{
			frequency: "common";
			roll: {
				min: 42;
				max: 55;
			};
		},
		{
			frequency: "common";
			roll: {
				min: 56;
				max: 69;
			};
		},
		{
			frequency: "uncommon";
			roll: {
				min: 70;
				max: 75;
			};
		},
		{
			frequency: "uncommon";
			roll: {
				min: 76;
				max: 81;
			};
		},
		{
			frequency: "uncommon";
			roll: {
				min: 82;
				max: 87;
			};
		},
		{
			frequency: "uncommon";
			roll: {
				min: 88;
				max: 93;
			};
		},
		{
			frequency: "rare";
			roll: {
				min: 94;
				max: 95;
			};
		},
		{
			frequency: "rare";
			roll: {
				min: 96;
				max: 97;
			};
		},
		{
			frequency: "rare";
			roll: {
				min: 98;
				max: 99;
			};
		},
		{
			frequency: "unforeseen";
			roll: {
				min: 100;
				max: 100;
			};
		}
	];
	type: "delve_site";
}

/**
 * Represents an entry in a delve site denizen matrix. Denizen matrices are described in Ironsworn: Delve.
 */
export interface DelveSiteDenizen {
	/**
	 * A name for the denizen, if it's different than the `name` property of the NPC.
	 */
	name?: Label;
	/**
	 * The ID of the relevant NPC entry, if one is specified.
	 */
	npc?: NpcId;
	frequency: DelveSiteDenizenFrequency;
	roll: DiceRange;
	_id: DelveSiteDenizenId;
}

export type DelveSiteDenizenFrequency = "very_common" | "common" | "uncommon" | "rare" | "unforeseen"

/**
 * A unique ID representing a DelveSiteDenizen object.
 * @pattern ```javascript
 * /^delve_site\.denizen:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)$/
 * ```
 */
export type DelveSiteDenizenId = string

/**
 * A wildcarded DelveSiteDenizenId that can be used to match multiple DelveSiteDenizen objects.
 * @pattern ```javascript
 * /^delve_site\.denizen:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)$/
 * ```
 */
export type DelveSiteDenizenIdWildcard = string

/**
 * A delve site Domain card.
 */
export interface DelveSiteDomain {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: DelveSiteDomainId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: DelveSiteDomainIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The text that appears below the title on the card.
	 */
	summary: MarkdownString;
	/**
	 * Optional extended description text.
	 */
	descriptipn?: MarkdownString;
	/**
	 * An oracle table ID containing place name elements. For examples, see oracle ID `oracle_rollable:delve/site_name/place/barrow`, and its siblings in oracle collection ID `oracle_collection:delve/site_name/place`. These oracles are used by the site name oracle from Ironsworn: Delve (`oracle_rollable:delve/site_name/format`) to create random names for delve sites.
	 */
	name_oracle?: OracleRollableId;
	features: DelveSiteDomainFeature[] & [
		{
			roll: {
				min: 21;
				max: 43;
			};
		},
		{
			roll: {
				min: 44;
				max: 56;
			};
		},
		{
			roll: {
				min: 57;
				max: 64;
			};
		},
		{
			roll: {
				min: 65;
				max: 68;
			};
		},
		{
			roll: {
				min: 69;
				max: 72;
			};
		},
		{
			roll: {
				min: 73;
				max: 76;
			};
		},
		{
			roll: {
				min: 77;
				max: 80;
			};
		},
		{
			roll: {
				min: 81;
				max: 84;
			};
		},
		{
			roll: {
				min: 85;
				max: 88;
			};
		},
		{
			roll: {
				min: 89;
				max: 98;
			};
		},
		{
			roll: {
				min: 99;
				max: 99;
			};
		},
		{
			roll: {
				min: 100;
				max: 100;
			};
		}
	];
	dangers: DelveSiteDomainDanger[] & [
		{
			roll: {
				min: 31;
				max: 33;
			};
		},
		{
			roll: {
				min: 34;
				max: 36;
			};
		},
		{
			roll: {
				min: 37;
				max: 39;
			};
		},
		{
			roll: {
				min: 40;
				max: 42;
			};
		},
		{
			roll: {
				min: 43;
				max: 45;
			};
		}
	];
	type: "delve_site_domain";
}

/**
 * Represents a row in an oracle table, with a single text cell.
 */
export interface DelveSiteDomainDanger {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: DelveSiteDomainDangerId;
}

/**
 * A unique ID representing a DelveSiteDomainDanger object.
 * @pattern ```javascript
 * /^delve_site_domain\.danger:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)$/
 * ```
 */
export type DelveSiteDomainDangerId = string

/**
 * A wildcarded DelveSiteDomainDangerId that can be used to match multiple DelveSiteDomainDanger objects.
 * @pattern ```javascript
 * /^delve_site_domain\.danger:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)$/
 * ```
 */
export type DelveSiteDomainDangerIdWildcard = string

/**
 * Represents a row in an oracle table, with a single text cell.
 */
export interface DelveSiteDomainFeature {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: DelveSiteDomainFeatureId;
}

/**
 * A unique ID representing a DelveSiteDomainFeature object.
 * @pattern ```javascript
 * /^delve_site_domain\.feature:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)$/
 * ```
 */
export type DelveSiteDomainFeatureId = string

/**
 * A wildcarded DelveSiteDomainFeatureId that can be used to match multiple DelveSiteDomainFeature objects.
 * @pattern ```javascript
 * /^delve_site_domain\.feature:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)$/
 * ```
 */
export type DelveSiteDomainFeatureIdWildcard = string

/**
 * A unique ID representing a DelveSiteDomain object.
 * @pattern ```javascript
 * /^delve_site_domain:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)$/
 * ```
 */
export type DelveSiteDomainId = string

/**
 * A wildcarded DelveSiteDomainId that can be used to match multiple DelveSiteDomain objects.
 * @pattern ```javascript
 * /^delve_site_domain:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)$/
 * ```
 */
export type DelveSiteDomainIdWildcard = string

/**
 * A unique ID representing a DelveSite object.
 * @pattern ```javascript
 * /^delve_site:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)$/
 * ```
 */
export type DelveSiteId = string

/**
 * A wildcarded DelveSiteId that can be used to match multiple DelveSite objects.
 * @pattern ```javascript
 * /^delve_site:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)$/
 * ```
 */
export type DelveSiteIdWildcard = string

/**
 * A delve site theme card.
 */
export interface DelveSiteTheme {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: DelveSiteThemeId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: DelveSiteThemeIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The text that appears below the title on the card.
	 */
	summary: MarkdownString;
	/**
	 * Optional extended description text.
	 */
	descriptipn?: MarkdownString;
	features: DelveSiteThemeFeature[] & [
		{
			roll: {
				min: 1;
				max: 4;
			};
		},
		{
			roll: {
				min: 5;
				max: 8;
			};
		},
		{
			roll: {
				min: 9;
				max: 12;
			};
		},
		{
			roll: {
				min: 13;
				max: 16;
			};
		},
		{
			roll: {
				min: 17;
				max: 20;
			};
		}
	];
	dangers: DelveSiteThemeDanger[] & [
		{
			roll: {
				min: 1;
				max: 5;
			};
		},
		{
			roll: {
				min: 6;
				max: 10;
			};
		},
		{
			roll: {
				min: 11;
				max: 12;
			};
		},
		{
			roll: {
				min: 13;
				max: 14;
			};
		},
		{
			roll: {
				min: 15;
				max: 16;
			};
		},
		{
			roll: {
				min: 17;
				max: 18;
			};
		},
		{
			roll: {
				min: 19;
				max: 20;
			};
		},
		{
			roll: {
				min: 21;
				max: 22;
			};
		},
		{
			roll: {
				min: 23;
				max: 24;
			};
		},
		{
			roll: {
				min: 25;
				max: 26;
			};
		},
		{
			roll: {
				min: 27;
				max: 28;
			};
		},
		{
			roll: {
				min: 29;
				max: 30;
			};
		}
	];
	type: "delve_site_theme";
}

/**
 * Represents a row in an oracle table, with a single text cell.
 */
export interface DelveSiteThemeDanger {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: DelveSiteThemeDangerId;
}

/**
 * A unique ID representing a DelveSiteThemeDanger object.
 * @pattern ```javascript
 * /^delve_site_theme\.danger:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)$/
 * ```
 */
export type DelveSiteThemeDangerId = string

/**
 * A wildcarded DelveSiteThemeDangerId that can be used to match multiple DelveSiteThemeDanger objects.
 * @pattern ```javascript
 * /^delve_site_theme\.danger:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)$/
 * ```
 */
export type DelveSiteThemeDangerIdWildcard = string

/**
 * Represents a row in an oracle table, with a single text cell.
 */
export interface DelveSiteThemeFeature {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: DelveSiteThemeFeatureId;
}

/**
 * A unique ID representing a DelveSiteThemeFeature object.
 * @pattern ```javascript
 * /^delve_site_theme\.feature:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)$/
 * ```
 */
export type DelveSiteThemeFeatureId = string

/**
 * A wildcarded DelveSiteThemeFeatureId that can be used to match multiple DelveSiteThemeFeature objects.
 * @pattern ```javascript
 * /^delve_site_theme\.feature:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)$/
 * ```
 */
export type DelveSiteThemeFeatureIdWildcard = string

/**
 * A unique ID representing a DelveSiteTheme object.
 * @pattern ```javascript
 * /^delve_site_theme:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)$/
 * ```
 */
export type DelveSiteThemeId = string

/**
 * A wildcarded DelveSiteThemeId that can be used to match multiple DelveSiteTheme objects.
 * @pattern ```javascript
 * /^delve_site_theme:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)$/
 * ```
 */
export type DelveSiteThemeIdWildcard = string

/**
 * A simple dice roll expression with an optional (positive or negative) modifer.
 * @pattern ```javascript
 * /([1-9][0-9]*)d([1-9][0-9]*)([+-]([1-9][0-9]*))?/
 * ```
 * @example "1d100"
 * @example "1d6+2"
 * @example "2d10"
 */
export type DiceExpression = string

/**
 * Represents a range of dice roll results, bounded by `min` and `max` (inclusive).
 */
export interface DiceRange {
	/**
	 * Low end of the dice range.
	 */
	min: number;
	/**
	 * High end of the dice range.
	 */
	max: number;
}

/**
 * A `snake_case` key used in a Datasworn dictionary object.
 * @remarks If you need to generate a key from a user-provided label, it's recommended to use a 'slugify' function/library, e.g. https://www.npmjs.com/package/slugify for NodeJS.
 * @pattern ```javascript
 * /^[a-z][a-z0-9_]*$/
 * ```
 */
export type DictKey = string

/**
 * Implementation hints or other developer-facing comments on this node. These should be omitted when representing an object for gameplay.
 */
export type Documentation = string

/**
 * An email address.
 */
export type Email = string

export interface EmbeddedActionRollMove {
	_id: EmbeddedMoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerActionRoll;
	/**
	 * Is burning momentum allowed for this move?
	 * @default true
	 */
	allow_momentum_burn: boolean;
	outcomes: MoveOutcomes;
	type: "move";
	roll_type: "action_roll";
}

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `roll_type` property as a discriminator.
 */
export type EmbeddedMove = EmbeddedActionRollMove | EmbeddedNoRollMove | EmbeddedProgressRollMove | EmbeddedSpecialTrackMove

export type EmbeddedMoveId = AssetAbilityMoveId

export type EmbeddedMoveIdWildcard = AssetAbilityMoveIdWildcard

export interface EmbeddedNoRollMove {
	_id: EmbeddedMoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerNoRoll;
	/**
	 * Is burning momentum allowed for this move?
	 */
	allow_momentum_burn: false;
	/**
	 * @default null
	 */
	outcomes: null;
	type: "move";
	roll_type: "no_roll";
}

export interface EmbeddedOracleColumnText {
	_id: EmbeddedOracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: OracleRollableRowText[];
	type: "oracle_rollable";
	oracle_type: "column_text";
}

export interface EmbeddedOracleColumnText2 {
	_id: EmbeddedOracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText2>;
	type: "oracle_rollable";
	oracle_type: "column_text2";
}

export interface EmbeddedOracleColumnText3 {
	_id: EmbeddedOracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText3>;
	type: "oracle_rollable";
	oracle_type: "column_text3";
}

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type EmbeddedOracleRollable = EmbeddedOracleTableText | EmbeddedOracleTableText2 | EmbeddedOracleTableText3 | EmbeddedOracleColumnText | EmbeddedOracleColumnText2 | EmbeddedOracleColumnText3

export type EmbeddedOracleRollableId = AssetAbilityOracleRollableId | TruthOptionOracleRollableId | MoveOracleRollableId

export type EmbeddedOracleRollableIdWildcard = AssetAbilityOracleRollableIdWildcard | TruthOptionOracleRollableIdWildcard | MoveOracleRollableIdWildcard

export interface EmbeddedOracleTableText {
	_id: EmbeddedOracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: OracleRollableRowText[];
	/**
	 * @default 
	 * ```javascript
	 * 	{
	 * 		roll: "Roll",
	 * 		text: "Result"
	 * 	}
	 * ```
	 */
	column_labels: {
		roll: Label;
		text: Label;
	};
	type: "oracle_rollable";
	oracle_type: "table_text";
}

export interface EmbeddedOracleTableText2 {
	_id: EmbeddedOracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText2>;
	/**
	 * @default 
	 * ```javascript
	 * 	{
	 * 		roll: "Roll",
	 * 		text: "Result",
	 * 		text2: "Details"
	 * 	}
	 * ```
	 */
	column_labels: {
		roll: Label;
		text: Label;
		text2: Label;
	};
	type: "oracle_rollable";
	oracle_type: "table_text2";
}

export interface EmbeddedOracleTableText3 {
	_id: EmbeddedOracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText3>;
	column_labels: {
		roll: Label;
		text: Label;
		text2: Label;
		text3: Label;
	};
	type: "oracle_rollable";
	oracle_type: "table_text3";
}

export interface EmbeddedProgressRollMove {
	_id: EmbeddedMoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerProgressRoll;
	/**
	 * Is burning momentum allowed for this move?
	 */
	allow_momentum_burn: false;
	outcomes: MoveOutcomes;
	type: "move";
	roll_type: "progress_roll";
	/**
	 * Describes the common features of progress tracks associated with this move.
	 */
	tracks: ProgressTrackTypeInfo;
}

export interface EmbeddedSpecialTrackMove {
	_id: EmbeddedMoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerSpecialTrack;
	/**
	 * Is burning momentum allowed for this move?
	 */
	allow_momentum_burn: false;
	outcomes: MoveOutcomes;
	type: "move";
	roll_type: "special_track";
}

export type EmbedOnlyType = "ability" | "option" | "row" | "feature" | "danger" | "denizen" | "variant"

/**
 * This type is a placeholder and may see signficant changes in v0.2.0.
 * @experimental
 */
export interface EntityPrompt {
	text: MarkdownString;
}

/**
 * A Datasworn package that relies on an external package to provide its ruleset.
 */
export interface Expansion {
	_id: ExpansionId;
	type: "expansion";
	/**
	 * The version of the Datasworn format used by this data.
	 * @pattern ```javascript
	 * /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
	 * ```
	 */
	datasworn_version: "0.1.0";
	description?: MarkdownString;
	/**
	 * The title of the source document.
	 * @example "Ironsworn Rulebook"
	 * @example "Ironsworn Assets Master Set"
	 * @example "Ironsworn: Delve"
	 * @example "Ironsworn: Starforged Rulebook"
	 * @example "Ironsworn: Starforged Assets"
	 * @example "Sundered Isles"
	 */
	title: Label;
	/**
	 * Lists authors credited by the source material.
	 */
	authors: AuthorInfo[];
	/**
	 * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
	 * @remarks You may prefer to deserialize this as a Date object.
	 * @pattern ```javascript
	 * /[0-9]{4}-((0[0-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))/
	 * ```
	 */
	date: string;
	/**
	 * A URL where the source document is available.
	 * @example "https://ironswornrpg.com"
	 */
	url: WebUrl;
	/**
	 * An URL pointing to the location where this content's license can be found.
	 * 
	 * A `null` here indicates that the content provides __no__ license, and is not intended for redistribution.
	 * @example "https://creativecommons.org/licenses/by/4.0"
	 * @example "https://creativecommons.org/licenses/by-nc-sa/4.0"
	 */
	license: WebUrl | null;
	/**
	 * A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles: Record<DictKey, OracleTablesCollection>;
	/**
	 * A dictionary object containing move categories, which contain moves.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	moves: Record<DictKey, MoveCategory>;
	/**
	 * A dictionary object containing asset collections, which contain assets.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	assets: Record<DictKey, AssetCollection>;
	/**
	 * A dictionary object containing atlas collections, which contain atlas entries.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	atlas?: Record<DictKey, AtlasCollection>;
	/**
	 * A dictionary object containing NPC collections, which contain NPCs.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	npcs?: Record<DictKey, NpcCollection>;
	/**
	 * A dictionary object of truth categories.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	truths?: Record<DictKey, Truth>;
	/**
	 * A dictionary object containing rarities, like those presented in Ironsworn: Delve.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	rarities?: Record<DictKey, Rarity>;
	/**
	 * A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	delve_sites?: Record<DictKey, DelveSite>;
	/**
	 * A dictionary object containing delve site themes.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	site_themes?: Record<DictKey, DelveSiteTheme>;
	/**
	 * A dictionary object containing delve site domains.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	site_domains?: Record<DictKey, DelveSiteDomain>;
	ruleset: RulesetId;
	rules?: RulesExpansion;
}

/**
 * The ID of a Datasworn package that relies on an external package to provide its ruleset.
 * @pattern ```javascript
 * /^[a-z][a-z0-9_]*$/
 * ```
 * @example "delve"
 * @example "sundered_isles"
 */
export type ExpansionId = string

/**
 * @experimental
 */
export interface I18nHint {
	/**
	 * The part of speech for this string.
	 */
	part_of_speech?: PartOfSpeech;
}

/**
 * Internationalization/localization hints for the text content of this object.
 * @experimental
 */
export interface I18nHints {
	text?: I18nHint;
	text2?: I18nHint;
	text3?: I18nHint;
	template?: {
		text?: I18nHint;
		text2?: I18nHint;
		text3?: I18nHint;
	};
}

/**
 * Describes a category of standard impacts/debilities.
 */
export interface ImpactCategory {
	/**
	 * A label for this impact category.
	 */
	label: Label;
	/**
	 * A description of this impact category.
	 */
	description: MarkdownString;
	/**
	 * A dictionary object of the Impacts in this category.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, ImpactRule>;
}

/**
 * Describes a standard impact/debility.
 */
export interface ImpactRule {
	/**
	 * The label for this impact.
	 */
	label: Label;
	/**
	 * A description of this impact.
	 */
	description: MarkdownString;
	/**
	 * Is this impact applied to all players at once?
	 * @default false
	 */
	shared: boolean;
	/**
	 * Any ruleset condition meters that can't recover when this impact is active.
	 * @default []
	 */
	prevents_recovery: ConditionMeterKey[];
	/**
	 * Is this impact permanent?
	 * @default false
	 */
	permanent: boolean;
	/**
	 * @experimental
	 */
	tags?: Tags;
}

/**
 * A localized, player-facing name or label, formatted as plain text. In some contexts it may be undesirable to render this text, but it should always be exposed to assistive technology (e.g. with `aria-label` in HTML).
 * @i18n
 */
export type Label = string

/**
 * Localized, player-facing text, formatted in Markdown. It is *not* formatted for use "out of the box"; it uses some custom syntax, intended to be replaced in whatever way is most appropriate for your implementation.
 * 
 * * `[Link text](datasworn:move:starforged/suffer/pay_the_price)`: A link to the identified object. The ID must conform to the `AnyId` type; no wildcards allowed.
 * * `{{table>oracle_rollable:starforged/core/action}}`: the referenced oracle is rendered here in the source material. The ID must conform to the `AnyOracleRollableId` type; no wildcards allowed.
 * * `{{table_columns>move:delve/delve/delve_the_depths}}`: Render *all* direct OracleRollable children of the identified node. This can be an OracleCollectionId, or the ID of anything that can have EmbeddedOracleRollables (such as a Move or TruthOption).
 * 
 * @i18n
 */
export type MarkdownString = string

/**
 * A rich text string in Markdown with replaced values from oracle roll results.
 * 
 * The custom syntax `{{some_row_key>some_oracle_table_id}}` should be replaced by the `some_row_key` string of a rolled oracle table. This is usually the `text` key, for example `{{text>oracle_rollable:starforged/core/action}}`
 * 
 * @i18n
 * @experimental
 */
export type MarkdownTemplateString = string

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `roll_type` property as a discriminator.
 */
export type Move = MoveActionRoll | MoveNoRoll | MoveProgressRoll | MoveSpecialTrack

/**
 * A move that makes an action roll.
 */
export interface MoveActionRoll {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: MoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * Indicates that this move replaces the identified moves. References to the replaced moves can be considered equivalent to this move.
	 */
	replaces?: MoveIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles?: Record<DictKey, EmbeddedOracleRollable>;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerActionRoll;
	/**
	 * Is burning momentum allowed for this move?
	 * @default true
	 */
	allow_momentum_burn: boolean;
	outcomes: MoveOutcomes;
	type: "move";
	roll_type: "action_roll";
}

/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveActionRollEnhancement {
	/**
	 * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
	 * @default null
	 */
	enhances: AnyMoveIdWildcard[] | null;
	/**
	 * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
	 */
	roll_type: "action_roll";
	trigger?: TriggerActionRollEnhancement;
}

export interface MoveCategory {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: MoveCategoryId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: MoveCategoryIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: MoveCategoryIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, Move>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	collections: Record<DictKey, MoveCategory>;
	type: "move_category";
}

/**
 * A unique ID representing a MoveCategory object.
 * @pattern ```javascript
 * /^move_category:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){1,4})$/
 * ```
 */
export type MoveCategoryId = string

/**
 * A wildcarded MoveCategoryId that can be used to match multiple MoveCategory objects.
 * @pattern ```javascript
 * /^move_category:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){1,4})$/
 * ```
 */
export type MoveCategoryIdWildcard = string

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `roll_type` property as a discriminator.
 */
export type MoveEnhancement = MoveActionRollEnhancement | MoveNoRollEnhancement | MoveProgressRollEnhancement | MoveSpecialTrackEnhancement

/**
 * A unique ID representing a Move object.
 * @pattern ```javascript
 * /^move:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})$/
 * ```
 */
export type MoveId = string

/**
 * A wildcarded MoveId that can be used to match multiple Move objects.
 * @pattern ```javascript
 * /^move:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})$/
 * ```
 */
export type MoveIdWildcard = string

/**
 * A move that makes no progress rolls or action rolls.
 */
export interface MoveNoRoll {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: MoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * Indicates that this move replaces the identified moves. References to the replaced moves can be considered equivalent to this move.
	 */
	replaces?: MoveIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles?: Record<DictKey, EmbeddedOracleRollable>;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerNoRoll;
	/**
	 * Is burning momentum allowed for this move?
	 */
	allow_momentum_burn: false;
	/**
	 * @default null
	 */
	outcomes: null;
	type: "move";
	roll_type: "no_roll";
}

/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveNoRollEnhancement {
	/**
	 * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
	 * @default null
	 */
	enhances: AnyMoveIdWildcard[] | null;
	/**
	 * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
	 */
	roll_type: "no_roll";
	trigger?: TriggerNoRollEnhancement;
}

/**
 * A unique ID representing a MoveOracleRollable object.
 * @pattern ```javascript
 * /^move\.oracle_rollable:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type MoveOracleRollableId = string

/**
 * A wildcarded MoveOracleRollableId that can be used to match multiple MoveOracleRollable objects.
 * @pattern ```javascript
 * /^move\.oracle_rollable:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type MoveOracleRollableIdWildcard = string

/**
 * A unique ID representing a MoveOracleRollableRow object.
 * @pattern ```javascript
 * /^move\.oracle_rollable\.row:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.([a-z][a-z0-9_]*|\*)\.(\d+)$/
 * ```
 */
export type MoveOracleRollableRowId = string

/**
 * A wildcarded MoveOracleRollableRowId that can be used to match multiple MoveOracleRollableRow objects.
 * @pattern ```javascript
 * /^move\.oracle_rollable\.row:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.([a-z][a-z0-9_]*|\*)\.(\d+|\*)$/
 * ```
 */
export type MoveOracleRollableRowIdWildcard = string

export interface MoveOutcome {
	text: MarkdownString;
	oracle_rolls?: OracleRoll[];
}

/**
 * A standalone localized description for each move outcome (miss, weak hit, or strong hit). This is for for e.g. VTT implementations, where it's often useful to display only the rules text relevant to a roll result.
 * 
 *   This often requires light editorialization to create text that can stand alone without reference to the rest of the move. For example, 'as above' (in reference to another move outcome) shouldn't be used here; instead, the relevant text should be repeated.
 */
export interface MoveOutcomes {
	strong_hit: MoveOutcome;
	weak_hit: MoveOutcome;
	miss: MoveOutcome;
}

/**
 * A progress move that rolls on a standard progress track type (whose features are defined by this move object). For progress rolls that use special tracks, see MoveSpecialTrack.
 */
export interface MoveProgressRoll {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: MoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * Indicates that this move replaces the identified moves. References to the replaced moves can be considered equivalent to this move.
	 */
	replaces?: MoveIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles?: Record<DictKey, EmbeddedOracleRollable>;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerProgressRoll;
	/**
	 * Is burning momentum allowed for this move?
	 */
	allow_momentum_burn: false;
	outcomes: MoveOutcomes;
	type: "move";
	roll_type: "progress_roll";
	/**
	 * Describes the common features of progress tracks associated with this move.
	 */
	tracks: ProgressTrackTypeInfo;
}

/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveProgressRollEnhancement {
	/**
	 * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
	 * @default null
	 */
	enhances: AnyMoveIdWildcard[] | null;
	/**
	 * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
	 */
	roll_type: "progress_roll";
	trigger?: TriggerProgressRollEnhancement;
}

/**
 *   - `no_roll`: A move that makes no action rolls or progress rolls.
 *   - `action_roll`: A move that makes an action roll.
 *   - `progress_roll`: A progress move that rolls on a standard progress track type (defined by this move).
 *   - `special_track`: A progress move that rolls on one or more special tracks, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
 */
export type MoveRollType = "no_roll" | "action_roll" | "progress_roll" | "special_track"

/**
 * A progress move that rolls on a special track, such as Legacies (Starforged) or Bonds (classic Ironsworn). For progress moves that use standard progress tracks, see MoveProgressRoll instead.
 */
export interface MoveSpecialTrack {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: MoveId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * Indicates that this move replaces the identified moves. References to the replaced moves can be considered equivalent to this move.
	 */
	replaces?: MoveIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The complete rules text of the move.
	 */
	text: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles?: Record<DictKey, EmbeddedOracleRollable>;
	/**
	 * Trigger conditions for this move.
	 */
	trigger: TriggerSpecialTrack;
	/**
	 * Is burning momentum allowed for this move?
	 */
	allow_momentum_burn: false;
	outcomes: MoveOutcomes;
	type: "move";
	roll_type: "special_track";
}

/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveSpecialTrackEnhancement {
	/**
	 * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
	 * @default null
	 */
	enhances: AnyMoveIdWildcard[] | null;
	/**
	 * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
	 */
	roll_type: "special_track";
	trigger?: TriggerSpecialTrackEnhancement;
}

export type NonCollectableType = "delve_site" | "delve_site_domain" | "delve_site_theme" | "rarity" | "truth"

/**
 * A non-player character entry, similar to those in Chapter 5 of the Ironsworn Rulebook, or Chapter 4 of Starforged.
 */
export interface Npc {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: NpcId;
	_comment?: Documentation;
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: NpcIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	features: MarkdownString[];
	summary?: MarkdownString;
	description: MarkdownString;
	quest_starter?: MarkdownString;
	your_truth?: MarkdownString;
	/**
	 * The suggested challenge rank for this NPC.
	 */
	rank: ChallengeRank;
	nature: NpcNature;
	drives: MarkdownString[];
	tactics: MarkdownString[];
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	variants: Record<DictKey, NpcVariant>;
	type: "npc";
}

export interface NpcCollection {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: NpcCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: NpcCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: NpcCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, Npc>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	collections: Record<DictKey, NpcCollection>;
	type: "npc_collection";
}

/**
 * A unique ID representing a NpcCollection object.
 * @pattern ```javascript
 * /^npc_collection:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){1,4})$/
 * ```
 */
export type NpcCollectionId = string

/**
 * A wildcarded NpcCollectionId that can be used to match multiple NpcCollection objects.
 * @pattern ```javascript
 * /^npc_collection:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){1,4})$/
 * ```
 */
export type NpcCollectionIdWildcard = string

/**
 * A unique ID representing a Npc object.
 * @pattern ```javascript
 * /^npc:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})$/
 * ```
 */
export type NpcId = string

/**
 * A wildcarded NpcId that can be used to match multiple Npc objects.
 * @pattern ```javascript
 * /^npc:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})$/
 * ```
 */
export type NpcIdWildcard = string

/**
 * A localized category label describing the nature of this NPC.
 * 
 * In Ironsworn classic, this is probably the singular form of the parent collection's name.
 * 
 * For Starforged, see the table on p. 258 for examples.
 * @example "Ironlander"
 * @example "Firstborn"
 * @example "Animal"
 * @example "Beast"
 * @example "Horror"
 * @example "Anomaly"
 * @example "Creature"
 * @example "Human"
 * @example "Machine"
 * @example "Monster"
 * @example "Vehicle"
 */
export type NpcNature = Label

export interface NpcVariant {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: NpcVariantId;
	_comment?: Documentation;
	name: Label;
	/**
	 * The suggested challenge rank for this NPC.
	 */
	rank: ChallengeRank;
	nature: NpcNature;
	summary?: MarkdownString;
	description: MarkdownString;
}

/**
 * A unique ID representing a NpcVariant object.
 * @pattern ```javascript
 * /^npc\.variant:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type NpcVariantId = string

/**
 * A wildcarded NpcVariantId that can be used to match multiple NpcVariant objects.
 * @pattern ```javascript
 * /^npc\.variant:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type NpcVariantIdWildcard = string

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type OracleCollection = OracleTablesCollection | OracleTableSharedRolls | OracleTableSharedText | OracleTableSharedText2 | OracleTableSharedText3

/**
 * A unique ID representing an OracleCollection object.
 * @pattern ```javascript
 * /^oracle_collection:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){1,4})$/
 * ```
 */
export type OracleCollectionId = string

/**
 * A wildcarded OracleCollectionId that can be used to match multiple OracleCollection objects.
 * @pattern ```javascript
 * /^oracle_collection:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){1,4})$/
 * ```
 */
export type OracleCollectionIdWildcard = string

/**
 * Represents a single column in an OracleCollection.
 */
export interface OracleColumnText {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleRollableIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: OracleRollableRowText[];
	type: "oracle_rollable";
	oracle_type: "column_text";
}

export interface OracleColumnText2 {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleRollableIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText2>;
	type: "oracle_rollable";
	oracle_type: "column_text2";
}

export interface OracleColumnText3 {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleRollableIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText3>;
	type: "oracle_rollable";
	oracle_type: "column_text3";
}

/**
 * Special roll instructions to use when rolling multiple times on a single oracle.
 * 
 *   - `reroll`: Duplicate results should be re-rolled.
 *   - `keep`: Duplicates results should be kept.
 *   - `make_it_worse`: Duplicate results should be kept, and they compound to make things worse.
 */
export type OracleDuplicateBehavior = "reroll" | "keep" | "make_it_worse"

export interface OracleMatchBehavior {
	text: MarkdownString;
}

export interface OracleRoll {
	/**
	 * The ID of the oracle to be rolled. A `null` value indicates that it's a roll on the same table.
	 * @default null
	 */
	oracle: OracleRollableId | null;
	/**
	 * Both Ironsworn and Starforged explicitly recommend *against* rolling all details at once. That said, some oracle results only provide useful information once a secondary roll occurs, such as "Action + Theme" or "Roll twice".
	 * @default false
	 */
	auto: boolean;
	/**
	 * Special rules on how to handle duplicate results, when rolling multiple times.
	 * @default "reroll"
	 */
	duplicates: OracleDuplicateBehavior;
	/**
	 * The dice roll to make on the oracle table. Set it to `null` if you just want the table's default.
	 * @default null
	 */
	dice: DiceExpression | null;
	/**
	 * The number of times to roll.
	 * @default 1
	 * @minimum 1
	 */
	number_of_rolls: number;
}

/**
 * A collection of table rows from which random results may be rolled. This may represent a standalone table, or a column in a larger table.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type OracleRollable = OracleTableText | OracleTableText2 | OracleTableText3 | OracleColumnText | OracleColumnText2 | OracleColumnText3

/**
 * A unique ID representing an OracleRollable object.
 * @pattern ```javascript
 * /^oracle_rollable:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})$/
 * ```
 */
export type OracleRollableId = string

/**
 * A wildcarded OracleRollableId that can be used to match multiple OracleRollable objects.
 * @pattern ```javascript
 * /^oracle_rollable:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})$/
 * ```
 */
export type OracleRollableIdWildcard = string

export type OracleRollableRow = OracleRollableRowText | OracleRollableRowText2 | OracleRollableRowText3

/**
 * A unique ID representing an OracleRollableRow object.
 * @pattern ```javascript
 * /^oracle_rollable\.row:([a-z][a-z0-9_]*(?:\/[a-z][a-z0-9_]*){2,5})\.(\d+)$/
 * ```
 */
export type OracleRollableRowId = string

/**
 * A wildcarded OracleRollableRowId that can be used to match multiple OracleRollableRow objects.
 * @pattern ```javascript
 * /^oracle_rollable\.row:((?:[a-z][a-z0-9_]*|\*)(?:\/(?:[a-z][a-z0-9_]*|\*|\*\*)){2,5})\.(\d+|\*)$/
 * ```
 */
export type OracleRollableRowIdWildcard = string

/**
 * Represents a row in an oracle table, with a single text cell.
 */
export interface OracleRollableRowText {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: AnyOracleRollableRowId;
}

/**
 * Represents a row in an oracle table that provides a secondary text field.
 */
export interface OracleRollableRowText2 {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: AnyOracleRollableRowId;
	/**
	 * The secondary text for this row. Use `null` to represent a cell with a blank or empty vlue.
	 */
	text2: MarkdownString | null;
}

/**
 * Represents a row in an oracle table with 3 text cells.
 */
export interface OracleRollableRowText3 {
	/**
	 * The primary text content of this row.
	 */
	text: MarkdownString;
	icon?: SvgImageUrl;
	/**
	 * Further oracle rolls prompted by this table row.
	 */
	oracle_rolls?: OracleRoll[];
	suggestions?: Suggestions;
	/**
	 * Hints that the identified table should be rendered inside this table row.
	 * @experimental
	 */
	embed_table?: OracleRollableId;
	/**
	 * @experimental
	 */
	template?: OracleRollTemplate;
	/**
	 * @experimental
	 */
	_i18n?: I18nHints;
	/**
	 * `null` represents an unrollable row, included only for rendering purposes.
	 * @default null
	 */
	roll: DiceRange | null;
	tags?: Tags;
	_id: AnyOracleRollableRowId;
	/**
	 * The secondary text for this row. Use `null` to represent a cell with a blank or empty value.
	 */
	text2: MarkdownString | null;
	/**
	 * The tertiary text for this row. Use `null` to represent a cell with a blank or empty vlue.
	 */
	text3: MarkdownString | null;
}

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type OracleRollableTable = OracleTableText | OracleTableText2 | OracleTableText3

/**
 * Provides string templates that may be used in place of the static row text from `OracleRollableRow#text`, `OracleRollableRow#text2`, and `OracleRollableRow#text3`.
 * 
 *   These strings are formatted in Markdown, but use a special syntax for their placeholders: `{{text>some_oracle_rollable_id}}`. The placeholder should be replaced with the value of a rolled (or selected) `OracleRollableRow#text` from the target oracle rollable ID.
 * @experimental
 */
export interface OracleRollTemplate {
	/**
	 * A string template that may be used in place of OracleRollableRow#text.
	 * @example "{{text>oracle_rollable:starforged/faction/name/affiliation}} of the {{text>oracle_rollable:starforged/faction/name/legacy}} {{text>oracle_rollable:starforged/faction/name/identity}}"
	 */
	text?: MarkdownTemplateString;
	/**
	 * A string template that may be used in place of OracleRollableRow#text2.
	 */
	text2?: MarkdownTemplateString;
	/**
	 * A string template that may be used in place of OracleRollableRow#text3.
	 */
	text3?: MarkdownTemplateString;
}

/**
 * An OracleCollection that represents a category or grouping of tables, which may themselves be `OracleTablesCollection`s.
 */
export interface OracleTablesCollection {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: OracleCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, OracleRollableTable>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	collections: Record<DictKey, OracleCollection>;
	type: "oracle_collection";
	oracle_type: "tables";
}

/**
 * An OracleCollection representing a single table with one roll column and multiple text columns.
 */
export interface OracleTableSharedRolls {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: OracleCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, OracleColumnText>;
	/**
	 * Provides column labels for this table. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row). For all other column labels, see the `name` property of each child `OracleColumn`.
	 * @default 
	 * ```javascript
	 * 	{
	 * 		roll: "Roll"
	 * 	}
	 * ```
	 */
	column_labels: {
		roll: Label;
	};
	type: "oracle_collection";
	oracle_type: "table_shared_rolls";
}

/**
 * An OracleCollection representing a single table with multiple roll columns and one text column.
 */
export interface OracleTableSharedText {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: OracleCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, OracleColumnText>;
	/**
	 * @default 
	 * ```javascript
	 * 	{
	 * 		text: "Result"
	 * 	}
	 * ```
	 */
	column_labels: {
		text: Label;
	};
	type: "oracle_collection";
	oracle_type: "table_shared_text";
}

/**
 * An OracleCollection representing a single table with multiple roll columns, and 2 shared text columns.
 */
export interface OracleTableSharedText2 {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: OracleCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, OracleColumnText2>;
	/**
	 * @default 
	 * ```javascript
	 * 	{
	 * 		text: "Result",
	 * 		text2: "Details"
	 * 	}
	 * ```
	 */
	column_labels: {
		text: Label;
		text2: Label;
	};
	type: "oracle_collection";
	oracle_type: "table_shared_text2";
}

/**
 * An OracleCollection representing a single table with multiple roll columns, and 3 shared text columns.
 */
export interface OracleTableSharedText3 {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleCollectionId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleCollectionIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * This node's content enhances all nodes that match these wildcards, rather than being a standalone item of its own.
	 */
	enhances?: OracleCollectionIdWildcard[];
	/**
	 * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
	 */
	summary?: MarkdownString;
	/**
	 * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
	 */
	description?: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	contents: Record<DictKey, OracleColumnText3>;
	/**
	 * @default {}
	 */
	column_labels: {
		text: Label;
		text2: Label;
		text3: Label;
	};
	type: "oracle_collection";
	oracle_type: "table_shared_text3";
}

/**
 * Represents a basic rollable oracle table with one roll column and one text result column.
 */
export interface OracleTableText {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleRollableIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: OracleRollableRowText[];
	/**
	 * @default 
	 * ```javascript
	 * 	{
	 * 		roll: "Roll",
	 * 		text: "Result"
	 * 	}
	 * ```
	 */
	column_labels: {
		roll: Label;
		text: Label;
	};
	type: "oracle_rollable";
	oracle_type: "table_text";
}

/**
 * A rollable oracle table with one roll column and two text columns.
 */
export interface OracleTableText2 {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleRollableIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText2>;
	/**
	 * @default 
	 * ```javascript
	 * 	{
	 * 		roll: "Roll",
	 * 		text: "Result",
	 * 		text2: "Details"
	 * 	}
	 * ```
	 */
	column_labels: {
		roll: Label;
		text: Label;
		text2: Label;
	};
	type: "oracle_rollable";
	oracle_type: "table_text2";
}

/**
 * A rollable oracle table with one roll column and 3 text columns.
 */
export interface OracleTableText3 {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: OracleRollableId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: OracleRollableIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	recommended_rolls?: {
		/**
		 * @default 1
		 */
		min: number;
		/**
		 * @default 1
		 */
		max: number;
	};
	/**
	 * The roll used to select a result on this oracle.
	 * @default "1d100"
	 */
	dice: DiceExpression;
	/**
	 * Most oracle tables are insensitive to matches, but a few define special match behavior.
	 */
	match?: OracleMatchBehavior;
	/**
	 * An array of objects, each representing a single row of the table.
	 */
	rows: Array<OracleRollableRowText3>;
	column_labels: {
		roll: Label;
		text: Label;
		text2: Label;
		text3: Label;
	};
	type: "oracle_rollable";
	oracle_type: "table_text3";
}

/**
 * Represents a page number in a book.
 * @minimum 1
 */
export type PageNumber = number

/**
 *   - `common_noun`: A common noun.
 *   - `proper_noun`: A proper noun.
 *   - `adjunct_common_noun`: A common noun used as an adjective, to modify another noun.
 *   - `adjunct_proper_noun`: A proper noun used as an adjective, to modify another noun.
 *   - `verb`: A verb in present tense
 *   - `gerund`: Gerund or present participle of a verb, e.g. "going", "seeing", "waving". Can function as a noun, an adjective, or a progressive verb.
 *   - `adjective`: An adjective.
 *   - `attributive_verb`: A verb used as an adjective, to modify a noun.
 *   - `adjective_as_proper_noun`: An adjective used as a proper noun.
 *   - `common_noun_as_proper_noun`: An common noun used as a proper noun.
 * @experimental
 */
export type PartOfSpeech = "common_noun" | "proper_noun" | "adjunct_common_noun" | "adjunct_proper_noun" | "verb" | "gerund" | "adjective" | "attributive_verb" | "adjective_as_proper_noun" | "common_noun_as_proper_noun"

/**
 *   - `miss`: An automatic miss.
 *   - `weak_hit`: An automatic weak hit.
 *   - `strong_hit`: An automatic strong hit.
 *   - `progress_roll`: Make a progress roll on a progress track associated with this move.
 */
export type ProgressRollMethod = "miss" | "weak_hit" | "strong_hit" | "progress_roll"

export interface ProgressRollOption {
	using: "progress_track";
}

/**
 * Describes the features of a type of progress track.
 */
export interface ProgressTrackTypeInfo {
	/**
	 * A category label for progress tracks of this type.
	 * @example "Vow"
	 * @example "Journey"
	 * @example "Combat"
	 * @example "Scene Challenge"
	 * @example "Expedition"
	 * @example "Connection"
	 * @example "Delve"
	 */
	category: Label;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	controls?: Record<DictKey, {
		
	}>;
}

/**
 * A rarity, as described in Ironsworn: Delve.
 */
export interface Rarity {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: RarityId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: RarityIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * The asset augmented by this rarity.
	 */
	asset: AssetId;
	/**
	 * From Ironsworn: Delve, p. 174:
	 * 
	 *       Some assets will bring a rarity into play more often than others, so the experience point cost for a rarity will vary by the linked asset. These costs are shown in the tables on page 175.
	 * 
	 *       If you are playing solo, and aren’t concerned with the relative balance of rarity abilities, you can ignore these variable costs. If so, spend 3 experience points to purchase a rarity.
	 * @default 3
	 * @minimum 3
	 * @maximum 5
	 */
	xp_cost: number;
	type: "rarity";
}

/**
 * A unique ID representing a Rarity object.
 * @pattern ```javascript
 * /^rarity:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)$/
 * ```
 */
export type RarityId = string

/**
 * A wildcarded RarityId that can be used to match multiple Rarity objects.
 * @pattern ```javascript
 * /^rarity:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)$/
 * ```
 */
export type RarityIdWildcard = string

/**
 * Provides a value like a stat, condition meter, or other number (usually for use in an action roll). The expected value is an integer, or null.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `using` property as a discriminator.
 */
export type RollableValue = StatValueRef | ConditionMeterValueRef | AssetControlValueRef | AssetOptionValueRef | AttachedAssetControlValueRef | AttachedAssetOptionValueRef | CustomValue

/**
 * Describes rules for player characters in this ruleset, such as stats and condition meters.
 * @experimental
 */
export interface Rules {
	/**
	 * Describes the standard stats used by player characters in this ruleset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	stats: Record<DictKey, StatRule>;
	/**
	 * Describes the standard condition meters used by player characters in this ruleset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	condition_meters: Record<DictKey, ConditionMeterRule>;
	/**
	 * Describes the standard impacts/debilities used by player characters in this ruleset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	impacts: Record<DictKey, ImpactCategory>;
	/**
	 * Describes the special tracks used by player characters in this ruleset, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	special_tracks: Record<DictKey, SpecialTrackRule>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 * @experimental
	 */
	tags: Record<DictKey, TagRule>;
}

/**
 * A standalone Datasworn package that describes its own ruleset.
 */
export interface Ruleset {
	_id: RulesetId;
	type: "ruleset";
	/**
	 * The version of the Datasworn format used by this data.
	 * @pattern ```javascript
	 * /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
	 * ```
	 */
	datasworn_version: "0.1.0";
	description?: MarkdownString;
	/**
	 * The title of the source document.
	 * @example "Ironsworn Rulebook"
	 * @example "Ironsworn Assets Master Set"
	 * @example "Ironsworn: Delve"
	 * @example "Ironsworn: Starforged Rulebook"
	 * @example "Ironsworn: Starforged Assets"
	 * @example "Sundered Isles"
	 */
	title: Label;
	/**
	 * Lists authors credited by the source material.
	 */
	authors: AuthorInfo[];
	/**
	 * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
	 * @remarks You may prefer to deserialize this as a Date object.
	 * @pattern ```javascript
	 * /[0-9]{4}-((0[0-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))/
	 * ```
	 */
	date: string;
	/**
	 * A URL where the source document is available.
	 * @example "https://ironswornrpg.com"
	 */
	url: WebUrl;
	/**
	 * An URL pointing to the location where this content's license can be found.
	 * 
	 * A `null` here indicates that the content provides __no__ license, and is not intended for redistribution.
	 * @example "https://creativecommons.org/licenses/by/4.0"
	 * @example "https://creativecommons.org/licenses/by-nc-sa/4.0"
	 */
	license: WebUrl | null;
	/**
	 * A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles: Record<DictKey, OracleTablesCollection>;
	/**
	 * A dictionary object containing move categories, which contain moves.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	moves: Record<DictKey, MoveCategory>;
	/**
	 * A dictionary object containing asset collections, which contain assets.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	assets: Record<DictKey, AssetCollection>;
	/**
	 * A dictionary object containing atlas collections, which contain atlas entries.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	atlas?: Record<DictKey, AtlasCollection>;
	/**
	 * A dictionary object containing NPC collections, which contain NPCs.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	npcs?: Record<DictKey, NpcCollection>;
	/**
	 * A dictionary object of truth categories.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	truths?: Record<DictKey, Truth>;
	/**
	 * A dictionary object containing rarities, like those presented in Ironsworn: Delve.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	rarities?: Record<DictKey, Rarity>;
	/**
	 * A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	delve_sites?: Record<DictKey, DelveSite>;
	/**
	 * A dictionary object containing delve site themes.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	site_themes?: Record<DictKey, DelveSiteTheme>;
	/**
	 * A dictionary object containing delve site domains.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	site_domains?: Record<DictKey, DelveSiteDomain>;
	rules: Rules;
}

/**
 * The ID of standalone Datasworn package that describes its own ruleset.
 * @pattern ```javascript
 * /^[a-z][a-z0-9_]*$/
 * ```
 * @example "classic"
 * @example "starforged"
 */
export type RulesetId = string

/**
 * Describes rules for player characters in this ruleset, such as stats and condition meters.
 * @experimental
 */
export interface RulesExpansion {
	/**
	 * Describes the standard stats used by player characters in this ruleset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	stats?: Record<DictKey, StatRule>;
	/**
	 * Describes the standard condition meters used by player characters in this ruleset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	condition_meters?: Record<DictKey, ConditionMeterRule>;
	/**
	 * Describes the standard impacts/debilities used by player characters in this ruleset.
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	impacts?: Record<DictKey, ImpactCategory>;
	/**
	 * Describes the special tracks used by player characters in this ruleset, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	special_tracks?: Record<DictKey, SpecialTrackRule>;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 * @experimental
	 */
	tags?: Record<DictKey, TagRule>;
}

/**
 * Describes game rules compatible with the Ironsworn tabletop role-playing game by Shawn Tomkin.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `type` property as a discriminator.
 */
export type RulesPackage = Ruleset | Expansion

export type RulesPackageId = RulesetId | ExpansionId

export type RuleType = "impact" | "condition_meter" | "special_track" | "stat"

/**
 * Select from player and/or asset enhancements. Use it to describe modal abilities. For examples, see Ironclad (classic Ironsworn) and Windbinder (Sundered Isles).
 * @remarks Semantics are similar to the HTML `<select>` element
 */
export interface SelectEnhancementField {
	label: Label;
	/**
	 * The key of the currently selected choice from the `choices` property, or `null` if none is selected.
	 * @default null
	 */
	value: DictKey | null;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	choices: Record<DictKey, SelectEnhancementFieldChoice | SelectEnhancementFieldChoiceGroup>;
	field_type: "select_enhancement";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
}

/**
 * Represents an option in a list of choices.
 * @remarks Semantics are similar to the HTML `<option>` element.
 */
export interface SelectEnhancementFieldChoice {
	label: Label;
	choice_type: "choice";
	enhance_asset?: AssetEnhancement;
	enhance_moves?: MoveEnhancement[];
}

/**
 * Represents a grouping of options in a list of choices.
 * @remarks Semantics are similar to the HTML `<optgroup>` element.
 */
export interface SelectEnhancementFieldChoiceGroup {
	/**
	 * A label for this option group.
	 */
	name: Label;
	choice_type: "choice_group";
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	choices: Record<DictKey, SelectEnhancementFieldChoice>;
}

/**
 * Represents a list of mutually exclusive choices.
 * @remarks Semantics are similar to the HTML `<select>` element
 */
export interface SelectValueField {
	label: Label;
	/**
	 * The key of the currently selected choice from the `choices` property, or `null` if none is selected.
	 * @default null
	 */
	value: DictKey | null;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	choices: Record<DictKey, SelectValueFieldChoice>;
	field_type: "select_value";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
}

/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `using` property as a discriminator.
 */
export type SelectValueFieldChoice = {
	label: Label;
	choice_type: "choice";
	stat: StatKey;
	/**
	 * A reference to the value of a standard player character stat.
	 */
	using: "stat";
} | {
	label: Label;
	choice_type: "choice";
	condition_meter: ConditionMeterKey;
	/**
	 * A reference to the value of a standard player condition meter.
	 */
	using: "condition_meter";
} | {
	label: Label;
	choice_type: "choice";
	/**
	 * Asset IDs (which may be wildcarded) that may provide the control field. For asset ability enhancements, `null` is used to represent the asset's own control fields.
	 * @default null
	 */
	assets: AssetIdWildcard[] | null;
	/**
	 * The dictionary key of the asset control field.
	 * @example "health"
	 * @example "integrity"
	 */
	control: DictKey;
	/**
	 * A reference to the value of an asset control.
	 */
	using: "asset_control";
} | {
	label: Label;
	choice_type: "choice";
	/**
	 * Asset IDs (which may be wildcarded) that may provide the option field. For asset ability enhancements, `null` is used to represent the asset's own option fields.
	 * @default null
	 */
	assets: AssetIdWildcard[] | null;
	/**
	 * The dictionary key of the asset option field.
	 */
	option: DictKey;
	/**
	 * A reference to the value of an asset option.
	 */
	using: "asset_option";
} | {
	label: Label;
	choice_type: "choice";
	/**
	 * The dictionary key of the asset control field.
	 * @example "health"
	 * @example "integrity"
	 */
	control: DictKey;
	/**
	 * A reference to the value of an attached asset control. For example, a Module asset could use this to roll using the `integrity` control of an attached Vehicle.
	 */
	using: "attached_asset_control";
} | {
	label: Label;
	choice_type: "choice";
	/**
	 * The dictionary key of the asset option field.
	 */
	option: DictKey;
	/**
	 * A reference to the value of an attached asset option.
	 */
	using: "attached_asset_option";
} | {
	label: Label;
	choice_type: "choice";
	value: number;
	/**
	 * An arbitrary static integer value with a label.
	 */
	using: "custom";
}

/**
 * @pattern ```javascript
 * /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
 * ```
 */
export type SemanticVersion = string

/**
 * Metadata describing the original source of this node
 */
export interface SourceInfo {
	/**
	 * The title of the source document.
	 * @example "Ironsworn Rulebook"
	 * @example "Ironsworn Assets Master Set"
	 * @example "Ironsworn: Delve"
	 * @example "Ironsworn: Starforged Rulebook"
	 * @example "Ironsworn: Starforged Assets"
	 * @example "Sundered Isles"
	 */
	title: Label;
	/**
	 * The page number where this content is described in full.
	 */
	page?: PageNumber;
	/**
	 * Lists authors credited by the source material.
	 */
	authors: AuthorInfo[];
	/**
	 * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
	 * @remarks You may prefer to deserialize this as a Date object.
	 * @pattern ```javascript
	 * /[0-9]{4}-((0[0-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))/
	 * ```
	 */
	date: string;
	/**
	 * A URL where the source document is available.
	 * @example "https://ironswornrpg.com"
	 */
	url: WebUrl;
	/**
	 * An URL pointing to the location where this content's license can be found.
	 * 
	 * A `null` here indicates that the content provides __no__ license, and is not intended for redistribution.
	 * @example "https://creativecommons.org/licenses/by/4.0"
	 * @example "https://creativecommons.org/licenses/by-nc-sa/4.0"
	 */
	license: WebUrl | null;
}

/**
 *   - `miss`: An automatic miss.
 *   - `weak_hit`: An automatic weak hit.
 *   - `strong_hit`: An automatic strong hit.
 *   - `player_choice`: The player chooses which roll option to use.
 *   - `highest`: Use the roll option with the best/highest value.
 *   - `lowest`: Use the roll option with the worst/lowest value.
 *   - `all`: Use _every_ roll option at once.
 */
export type SpecialTrackRollMethod = "miss" | "weak_hit" | "strong_hit" | "player_choice" | "highest" | "lowest" | "all"

/**
 * Describes a special track like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
 */
export interface SpecialTrackRule {
	/**
	 * A label for this special track.
	 */
	label: Label;
	/**
	 * A description of this special track.
	 */
	description: MarkdownString;
	/**
	 * Is this track shared by all players?
	 * @default false
	 */
	shared: boolean;
	/**
	 * Is this track an optional rule?
	 * @default false
	 */
	optional: boolean;
	/**
	 * @experimental
	 */
	tags?: Tags;
}

/**
 * Special, ruleset-specific progress tracks. Usually, one exists per player character, and they persist through the life of the player character.
 * 'Canonical' examples:
 *   * `bonds_track`, described in the Ironsworn Rulebook. For the Starforged legacy track, use `bonds_legacy` instead.
 *   * `failure_track`, described in Ironsworn: Delve
 *   * `quests_legacy`, `bonds_legacy`, and `discoveries_legacy`, described Ironsworn: Starforged
 * 
 * 
 * @example "bonds_track"
 * @example "failure_track"
 * @example "quests_legacy"
 * @example "bonds_legacy"
 * @example "discoveries_legacy"
 */
export type SpecialTrackType = DictKey

/**
 * A basic player character stat.
 * @example "edge"
 * @example "heart"
 * @example "iron"
 * @example "shadow"
 * @example "wits"
 */
export type StatKey = DictKey

/**
 * Describes a standard player character stat.
 */
export interface StatRule {
	/**
	 * A label for this stat.
	 * @example "edge"
	 */
	label: Label;
	/**
	 * A description of this stat.
	 * @example "Quickness, agility, and prowess when fighting at a distance."
	 */
	description: MarkdownString;
	/**
	 * @experimental
	 */
	tags?: Tags;
}

/**
 * A reference to the value of a standard player character stat.
 */
export interface StatValueRef {
	stat: StatKey;
	/**
	 * A reference to the value of a standard player character stat.
	 */
	using: "stat";
}

/**
 * @experimental
 */
export type Suggestions = AnyIdWildcard[]

/**
 * A relative (local) URL pointing to a vector image in the SVG format.
 * @pattern ```javascript
 * /\.svg$/
 * ```
 */
export type SvgImageUrl = string

export type Tag = boolean | number | DictKey | DiceExpression | AtlasEntryId | NpcId | OracleRollableId | AssetId | MoveId | AtlasCollectionId | NpcCollectionId | OracleCollectionId | AssetCollectionId | MoveCategoryId | DelveSiteId | DelveSiteDomainId | DelveSiteThemeId | RarityId | TruthId | Array<AtlasEntryIdWildcard | NpcIdWildcard | OracleRollableIdWildcard | AssetIdWildcard | MoveIdWildcard | AtlasCollectionIdWildcard | NpcCollectionIdWildcard | OracleCollectionIdWildcard | AssetCollectionIdWildcard | MoveCategoryIdWildcard | DelveSiteIdWildcard | DelveSiteDomainIdWildcard | DelveSiteThemeIdWildcard | RarityIdWildcard | TruthIdWildcard>

export type TaggableNodeType = CollectableType | NonCollectableType | CollectionType | EmbedOnlyType | RuleType

export interface TagRule {
	/**
	 * Types of object that can receive this tag, or `null` if any type of object accepts it.
	 * @default null
	 */
	node_types: TaggableNodeType[] | null;
	/**
	 * The JSON schema for this tag value.
	 */
	$schema: TagSchema;
}

/**
 * A dictionary of tags, keyed by the RulesPackageId that the tags are from.
 * @experimental
 */
export type Tags = Record<DictKey, Record<DictKey, Tag>>

export type TagSchema = Record<string, unknown>

/**
 * Represents an input that accepts plain text.
 * @remarks Semantics are similar to the HTML `<input type="text">` element.
 */
export interface TextField {
	label: Label;
	/**
	 * The content of this text input, or `null` if it's empty
	 * @default null
	 */
	value: string | null;
	field_type: "text";
	/**
	 * An icon associated with this input.
	 */
	icon?: SvgImageUrl;
}

/**
 * Describes trigger conditions for a move that makes an action roll.
 */
export interface TriggerActionRoll {
	/**
	 * A markdown string containing the primary trigger text for this move.
	 * 
	 * Secondary trigger text (for specific stats or uses of an asset ability) may be described in individual trigger conditions.
	 */
	text: MarkdownString;
	/**
	 * Specific conditions that qualify for this trigger.
	 */
	conditions: TriggerActionRollCondition[];
}

export interface TriggerActionRollCondition {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	method: ActionRollMethod;
	/**
	 * The options available when rolling with this trigger condition.
	 */
	roll_options: RollableValue[];
}

export interface TriggerActionRollConditionEnhancement {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	/**
	 * A `null` value means this condition provides no roll mechanic of its own; it must be used with another trigger condition that provides a non-null `method`.
	 * @default null
	 */
	method: ActionRollMethod | null;
	/**
	 * @default null
	 */
	roll_options: RollableValue[] | null;
}

/**
 * Describes changes/additions made to the enhanced move's trigger conditions.
 */
export interface TriggerActionRollEnhancement {
	/**
	 * Trigger conditions added to the enhanced move.
	 */
	conditions: TriggerActionRollConditionEnhancement[];
}

/**
 * Information on who can activate this trigger condition. Usually this is just the player, but some asset abilities can trigger from an ally's move.
 */
export interface TriggerBy {
	/**
	 * Can this trigger be activated by the player who owns this?
	 * @default true
	 */
	player: boolean;
	/**
	 * Can this trigger be activated by one of the player's allies?
	 * @default false
	 */
	ally: boolean;
}

/**
 * Describes trigger conditions for a move that makes no rolls.
 */
export interface TriggerNoRoll {
	/**
	 * A markdown string containing the primary trigger text for this move.
	 * 
	 * Secondary trigger text (for specific stats or uses of an asset ability) may be described in individual trigger conditions.
	 */
	text: MarkdownString;
	/**
	 * Specific conditions that qualify for this trigger.
	 * @default []
	 */
	conditions: TriggerNoRollCondition[];
}

export interface TriggerNoRollCondition {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	/**
	 * @default null
	 */
	method: null;
	/**
	 * The options available when rolling with this trigger condition.
	 * @default null
	 */
	roll_options: null;
}

/**
 * Describes changes/additions made to the enhanced move's trigger conditions.
 */
export interface TriggerNoRollEnhancement {
	/**
	 * Trigger conditions added to the enhanced move.
	 */
	conditions: TriggerNoRollCondition[];
}

export interface TriggerProgressRoll {
	/**
	 * A markdown string containing the primary trigger text for this move.
	 * 
	 * Secondary trigger text (for specific stats or uses of an asset ability) may be described in individual trigger conditions.
	 */
	text: MarkdownString;
	/**
	 * Specific conditions that qualify for this trigger.
	 */
	conditions: TriggerProgressRollCondition[];
}

export interface TriggerProgressRollCondition {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	/**
	 * @default "progress_roll"
	 */
	method: ProgressRollMethod;
	/**
	 * The options available when rolling with this trigger condition.
	 */
	roll_options: ProgressRollOption[];
}

export interface TriggerProgressRollConditionEnhancement {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	/**
	 * A `null` value means this condition provides no roll mechanic of its own; it must be used with another trigger condition that provides a non-null `method`.
	 * @default null
	 */
	method: ProgressRollMethod | null;
	/**
	 * @default null
	 */
	roll_options: ProgressRollOption[] | null;
}

/**
 * Describes changes/additions made to the enhanced move's trigger conditions.
 */
export interface TriggerProgressRollEnhancement {
	/**
	 * Trigger conditions added to the enhanced move.
	 */
	conditions: TriggerProgressRollConditionEnhancement[];
}

export interface TriggerSpecialTrack {
	/**
	 * A markdown string containing the primary trigger text for this move.
	 * 
	 * Secondary trigger text (for specific stats or uses of an asset ability) may be described in individual trigger conditions.
	 */
	text: MarkdownString;
	/**
	 * Specific conditions that qualify for this trigger.
	 */
	conditions: TriggerSpecialTrackCondition[];
}

export interface TriggerSpecialTrackCondition {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	method: SpecialTrackRollMethod;
	/**
	 * The options available when rolling with this trigger condition.
	 */
	roll_options: TriggerSpecialTrackConditionOption[];
}

/**
 * A progress move that rolls on one or more special tracks, like Bonds (classic Ironsworn), Failure (Delve), or Legacy (Starforged).
 */
export interface TriggerSpecialTrackConditionEnhancement {
	/**
	 * A markdown string of any trigger text specific to this trigger condition.
	 */
	text?: MarkdownString;
	by?: TriggerBy;
	/**
	 * A `null` value means this condition provides no roll mechanic of its own; it must be used with another trigger condition that provides a non-null `method`.
	 * @default null
	 */
	method: SpecialTrackRollMethod | null;
	/**
	 * @default null
	 */
	roll_options: TriggerSpecialTrackConditionOption[] | null;
}

export interface TriggerSpecialTrackConditionOption {
	using: SpecialTrackType;
}

/**
 * Describes changes/additions made to the enhanced move's trigger conditions.
 */
export interface TriggerSpecialTrackEnhancement {
	/**
	 * Trigger conditions added to the enhanced move.
	 */
	conditions: TriggerSpecialTrackConditionEnhancement[];
}

/**
 * A setting truth category.
 */
export interface Truth {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: TruthId;
	_comment?: Documentation;
	/**
	 * The primary name/label for this node.
	 */
	name: Label;
	/**
	 * The name of this node as it appears on the page in the book, if it's different from `name`.
	 */
	canonical_name?: Label;
	/**
	 * Attribution for the original source (such as a book or website) of this node, including the author and licensing information.
	 */
	_source: SourceInfo;
	suggestions?: Suggestions;
	tags?: Tags;
	/**
	 * This node replaces all nodes that match these wildcards. References to the replaced nodes can be considered equivalent to this node.
	 */
	replaces?: TruthIdWildcard[];
	/**
	 * A thematic color associated with this node.
	 */
	color?: CssColor;
	images?: WebpImageUrl[];
	/**
	 * An SVG icon associated with this collection.
	 */
	icon?: SvgImageUrl;
	/**
	 * @default "1d100"
	 */
	dice: DiceExpression;
	options: TruthOption[];
	your_character?: MarkdownString;
	/**
	 * Prompts for factions related to this truth, like those presented in standard isles. This is presented as a single paragraph in the original text; Datasworn uses an array (one faction prompt per string) to represent them in order to make them more suitable for programmatic use.
	 * 
	 * This property is a placeholder and may see signficant changes in v0.2.0.
	 * @experimental
	 */
	factions?: EntityPrompt[];
	type: "truth";
}

/**
 * A unique ID representing a Truth object.
 * @pattern ```javascript
 * /^truth:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)$/
 * ```
 */
export type TruthId = string

/**
 * A wildcarded TruthId that can be used to match multiple Truth objects.
 * @pattern ```javascript
 * /^truth:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)$/
 * ```
 */
export type TruthIdWildcard = string

export interface TruthOption {
	/**
	 * The unique Datasworn ID for this node.
	 */
	_id: TruthOptionId;
	_comment?: Documentation;
	roll: DiceRange;
	summary?: MarkdownString;
	description: MarkdownString;
	quest_starter: MarkdownString;
	/**
	 * @remarks Deserialize as a dictionary object.
	 * @default {}
	 */
	oracles?: Record<DictKey, EmbeddedOracleRollable>;
}

/**
 * A unique ID representing a TruthOption object.
 * @pattern ```javascript
 * /^truth\.option:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)$/
 * ```
 */
export type TruthOptionId = string

/**
 * A wildcarded TruthOptionId that can be used to match multiple TruthOption objects.
 * @pattern ```javascript
 * /^truth\.option:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)$/
 * ```
 */
export type TruthOptionIdWildcard = string

/**
 * A unique ID representing a TruthOptionOracleRollable object.
 * @pattern ```javascript
 * /^truth\.option\.oracle_rollable:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type TruthOptionOracleRollableId = string

/**
 * A wildcarded TruthOptionOracleRollableId that can be used to match multiple TruthOptionOracleRollable objects.
 * @pattern ```javascript
 * /^truth\.option\.oracle_rollable:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)\.([a-z][a-z0-9_]*|\*)$/
 * ```
 */
export type TruthOptionOracleRollableIdWildcard = string

/**
 * A unique ID representing a TruthOptionOracleRollableRow object.
 * @pattern ```javascript
 * /^truth\.option\.oracle_rollable\.row:([a-z][a-z0-9_]*\/[a-z][a-z0-9_]*)\.(\d+)\.([a-z][a-z0-9_]*|\*)\.(\d+)$/
 * ```
 */
export type TruthOptionOracleRollableRowId = string

/**
 * A wildcarded TruthOptionOracleRollableRowId that can be used to match multiple TruthOptionOracleRollableRow objects.
 * @pattern ```javascript
 * /^truth\.option\.oracle_rollable\.row:((?:[a-z][a-z0-9_]*|\*)\/[a-z][a-z0-9_]*|\/\*|\/\*\*)\.(\d+|\*)\.([a-z][a-z0-9_]*|\*)\.(\d+|\*)$/
 * ```
 */
export type TruthOptionOracleRollableRowIdWildcard = string

/**
 * A relative (local) URL pointing to a raster image in the WEBP format.
 * @pattern ```javascript
 * /\.webp$/
 * ```
 */
export type WebpImageUrl = string

/**
 * An absolute URL pointing to a website.
 */
export type WebUrl = string