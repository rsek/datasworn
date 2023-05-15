/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type PageNumber = number;
/**
 * A localized plain text name or label.
 */
export type Label = string;
export type Suggestions = SuggestionsClassic | SuggestionsStarforged;
export type OracleTableID = string;
export type AssetID = string;
/**
 * A move ID, for a standard move or a unique asset move
 */
export type MoveID = string;
export type DelveSiteDomainID = string;
export type DelveSiteThemeID = string;
export type EncounterClassicID = string;
export type RegionEntryID = string;
export type EncounterStarforgedID = string;
export type OracleCollectionID = string;
/**
 * Indicates that this collection's content should be inserted into another collection.
 */
export type OracleCollectionID1 = string;
/**
 * The collection imported by this collection.
 */
export type OracleCollectionID2 = string;
/**
 * Oracle table wildcards can also use '**' to represent any number of collection levels in the oracle tree. For example, 'starforged/oracles/** /location' represents any starforged table with the "location" key.
 */
export type OracleTableIDWildcard = string;
/**
 * A CSS color value. See: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 */
export type CSSColor = string;
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString = string;
export type DiceNotation = string;
/**
 * Normally, rows will end with two numbers separated by a dash, indicating their dice range.
 *
 * Rows with a single number represent unrollable rows that are sometimes included for rendering purposes; in this case, the number represents the row's index.
 */
export type OracleTableRowID = string;
/**
 * A relative URL pointing to a vector image in the SVG format.
 */
export type SVGImageURL = string;
/**
 * The ID of the oracle table to be rolled. If omitted, it defaults to the ID of this oracle table.
 */
export type OracleTableID1 = string;
export type OracleTableRollMethod = "no_duplicates" | "keep_duplicates" | "make_it_worse";
/**
 * A string template that may be used in place of OracleTableRow#result.
 */
export type TemplateString = string;
/**
 * A string template that may be used in place of OracleTableRow#summary.
 */
export type TemplateString1 = string;
/**
 * A string template that may be used in place of OracleTableRow#description.
 */
export type TemplateString2 = string;
export type OracleTableStyle = "table" | "embed_in_row" | "embed_as_column";
export type OracleColumnContentType = "range" | "result" | "summary" | "description";
export type OracleCollectionStyle = "multi_table";
/**
 * A relative URL pointing to a raster image in the WEBP format.
 */
export type WEBPImageURL = string;
export type MoveCategoryID = string;
/**
 * Indicates that this collection's content should be inserted into another collection.
 */
export type MoveCategoryID1 = string;
/**
 * The collection imported by this collection.
 */
export type MoveCategoryID2 = string;
/**
 * A move ID with wildcards
 */
export type MoveIDWithWildcard = string;
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 *
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export type Move =
  | {
      id: MoveID;
      name: Label;
      trigger: {
        text: MarkdownString1;
      } & TriggerNoRoll;
      text: MarkdownString;
      outcomes?: MoveOutcomes;
      oracles?: OracleTableID[];
      suggestions?: Suggestions;
      source: Source;
      move_type: "no_roll";
    }
  | {
      id: MoveID;
      name: Label;
      trigger: {
        text: MarkdownString3;
      } & TriggerActionRoll;
      text: MarkdownString;
      outcomes: MoveOutcomes;
      oracles?: OracleTableID[];
      suggestions?: Suggestions;
      source: Source;
      move_type: "action_roll";
    }
  | {
      id: MoveID;
      name: Label;
      trigger: {
        text: MarkdownString5;
      } & TriggerProgressRoll;
      text: MarkdownString;
      outcomes: MoveOutcomes;
      oracles?: OracleTableID[];
      suggestions?: Suggestions;
      source: Source;
      move_type: "progress_roll";
    };
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString1 = string;
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString2 = string;
export type MoveOutcomeType = "miss" | "weak_hit" | "strong_hit";
export type MoveRerollMethod = "any" | "all" | "challenge_die" | "challenge_dice" | "action_die";
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString3 = string;
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString4 = string;
/**
 * `any`: When rolling with this move trigger condition, the player picks which stat to use.
 *
 * `all`: When rolling with this move trigger condition, *every* stat or progress track of the `using` key is rolled.
 *
 * `highest`: When rolling with this move trigger condition, use the highest/best option from the `using` key.
 *
 * `lowest`: When rolling with this move trigger condition, use the lowest/worst option from the `using` key.
 */
export type MoveRollMethod = "any" | "all" | "highest" | "lowest";
export type TriggerActionRollConditionOption =
  | TriggerActionRollConditionOptionStat
  | TriggerActionRollConditionOptionRef
  | TriggerActionRollConditionOptionAttachedAssetRef
  | TriggerActionRollConditionOptionCustomValue;
export type PlayerStat = "edge" | "heart" | "iron" | "shadow" | "wits";
export type PlayerConditionMeter = "health" | "spirit" | "supply";
export type AssetConditionMeterIDWildcard = string;
export type AssetOptionFieldIDWildcard = string;
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString5 = string;
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there part of the source material.
 */
export type MarkdownString6 = string;
export type ProgressType = ProgressTypeClassic | ProgressTypeStarforged;
export type ProgressTypeClassic =
  | "combat_progress"
  | "vow_progress"
  | "scene_challenge_progress"
  | "journey_progress"
  | "delve_progress"
  | "bonds_progress"
  | "failure_track";
export type ProgressTypeStarforged =
  | LegacyTypeStarforged
  | ("combat_progress" | "vow_progress" | "scene_challenge_progress" | "expedition_progress" | "connection_progress");
export type LegacyTypeStarforged = "quests_legacy" | "bonds_legacy" | "discoveries_legacy";
export type AssetTypeID = string;
/**
 * Indicates that this collection's content should be inserted into another collection.
 */
export type AssetTypeID1 = string;
/**
 * The collection imported by this collection.
 */
export type AssetTypeID2 = string;
export type AssetIDWildcard = string;
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export type AssetOptionField = SelectFieldPlayerStat | TextField;
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export type AssetControlField = CheckboxField;
export type AssetAbilityID = string;
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export type AssetAbilityOptionField = TextField;
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export type AssetAbilityControlField = ClockField | CounterField | CheckboxField;
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 *
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export type AssetConditionMeterControlField = CheckboxField;
export type MoveRollType = "action_roll" | "progress_roll" | "no_roll";
export type AssetConditionMeterID = string;
/**
 * Challenge rank, represented as a number: 1 = Troublesome, 2 = Dangerous, 3 = Formidable, 4 = Extreme, 5 = Epic
 */
export type ChallengeRank = 1 | 2 | 3 | 4 | 5;
export type EncounterNatureStarforged = string;
export type SettingTruthOptionID = string;
export type SettingTruthID = string;

/**
 * Describes game rules elements compatible with the Ironsworn: Starforged tabletop role-playing game by Shawn Tomkin.
 */
export interface SourcebookStarforged {
  id: string;
  ruleset: "starforged";
  source: Source;
  /**
   * A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.
   */
  oracles?: {
    [k: string]: OracleCollection;
  };
  /**
   * A dictionary object containing move categories, which contain moves.
   */
  moves?: {
    [k: string]: MoveCategory;
  };
  /**
   * A dictionary object containing asset types, which contain assets.
   */
  assets?: {
    [k: string]: AssetType;
  };
  /**
   * A dictionary object containing Starforged-style encounter entries.
   */
  encounters?: {
    [k: string]: EncounterStarforged;
  };
  /**
   * A dictionary object containing Starforged-style setting truths.
   */
  setting_truths?: {
    [k: string]: SettingTruth;
  };
}
/**
 * Metadata describing the original source of this item
 */
export interface Source {
  /**
   * The title of the source document.
   */
  title: string;
  page?: PageNumber;
  /**
   * @minItems 1
   */
  authors: [
    {
      name: string;
      /**
       * An optional email contact for the author
       */
      email?: string;
    },
    ...{
      name: string;
      /**
       * An optional email contact for the author
       */
      email?: string;
    }[]
  ];
  /**
   * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
   */
  date: string;
  /**
   * An absolute URL where the source document is available.
   */
  url: string;
  /**
   * An absolute URL pointing to the location where this element's license can be found.
   *
   * A `null` here indicates that the content provides **no** license, and is not intended for redistribution.  Dataforged's build process skips unlicensed content by default.
   */
  license: string | null;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface OracleCollection {
  name: Label;
  canonical_name?: Label;
  source: Source;
  suggestions?: Suggestions;
  id: OracleCollectionID;
  augments?: OracleCollectionID1;
  /**
   * Collection borrows content from another collection. The target collection should be cloned, and this collection's values then merged to the clone as overrides.
   */
  imports?: {
    from: OracleCollectionID2;
    /**
     * IDs (which may be wildcarded) for the items to import, or `null` if the entire collection should be imported.
     */
    include: null | OracleTableIDWildcard[];
  };
  color?: CSSColor;
  summary?: MarkdownString;
  description?: MarkdownString;
  contents?: {
    [k: string]: OracleTable;
  };
  collections?: {
    [k: string]: OracleCollection;
  };
  rendering?: OracleCollectionRendering;
  images?: WEBPImageURL[];
  sample_names?: Label[];
}
export interface SuggestionsClassic {
  oracles?: OracleTableID[];
  assets?: AssetID[];
  moves?: MoveID[];
  site_domains?: DelveSiteDomainID[];
  site_themes?: DelveSiteThemeID[];
  encounters?: EncounterClassicID[];
  regions?: RegionEntryID[];
}
export interface SuggestionsStarforged {
  oracles?: OracleTableID[];
  assets?: AssetID[];
  moves?: MoveID[];
  encounters?: EncounterStarforgedID[];
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface OracleTable {
  name: Label;
  canonical_name?: Label;
  source: Source;
  suggestions?: Suggestions;
  id: OracleTableID;
  dice: DiceNotation;
  summary?: MarkdownString;
  description?: MarkdownString;
  match?: MatchBehavior;
  table: OracleTableRow[];
  rendering?: OracleTableRendering;
}
export interface MatchBehavior {
  text: MarkdownString;
}
export interface OracleTableRow {
  id: OracleTableRowID;
  /**
   * Low end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
   */
  low: number | null;
  /**
   * High end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
   */
  high: number | null;
  result: MarkdownString;
  icon?: SVGImageURL;
  summary?: MarkdownString;
  description?: MarkdownString;
  rolls?: OracleTableRoll[];
  suggestions?: Suggestions;
  embed_table?: OracleTableID;
  template?: OracleRollTemplate;
}
export interface OracleTableRoll {
  oracle?: OracleTableID1;
  times: number;
  method?: OracleTableRollMethod;
}
/**
 * Provides string templates that may be used in place of the static row text from `OracleTableRow#result`, `OracleTableRow#summary`, and `OracleTableRow#description`.
 *
 *   These strings are formatted in Markdown, but use a special syntax for their placeholders: `{{result:some_oracle_table_id}}`. The placeholder should be replaced with the value of a rolled (or selected) `OracleTableRow#result` from the target oracle table ID.
 */
export interface OracleRollTemplate {
  result?: TemplateString;
  summary?: TemplateString1;
  description?: TemplateString2;
}
export interface OracleTableRendering {
  icon?: SVGImageURL;
  style?: OracleTableStyle;
  color?: CSSColor;
}
export interface OracleCollectionRendering {
  columns: {
    [k: string]: OracleTableColumn;
  } & {
    [k: string]: OracleCollectionColumn;
  };
  color?: CSSColor;
  style?: OracleCollectionStyle;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface OracleTableColumn {
  label?: Label;
  content_type: OracleColumnContentType;
}
/**
 * A column's default label is the title of the source table.
 *
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface OracleCollectionColumn {
  label?: Label;
  content_type: OracleColumnContentType;
  table_key: string;
  color?: CSSColor;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface MoveCategory {
  name: Label;
  canonical_name?: Label;
  source: Source;
  suggestions?: Suggestions;
  id: MoveCategoryID;
  augments?: MoveCategoryID1;
  /**
   * Collection borrows content from another collection. The target collection should be cloned, and this collection's values then merged to the clone as overrides.
   */
  imports?: {
    from: MoveCategoryID2;
    /**
     * IDs (which may be wildcarded) for the items to import, or `null` if the entire collection should be imported.
     */
    include: null | MoveIDWithWildcard[];
  };
  color?: CSSColor;
  summary?: MarkdownString;
  description?: MarkdownString;
  contents?: {
    [k: string]: Move;
  };
}
export interface TriggerNoRoll {
  text: MarkdownString2;
  conditions?: TriggerNoRollCondition[];
}
export interface TriggerNoRollCondition {
  text?: MarkdownString;
  by?: TriggerBy;
}
/**
 * Information on who can trigger this trigger condition. Usually this is just the player, but some asset abilities can trigger from an ally's move.
 */
export interface TriggerBy {
  player: boolean;
  ally: boolean;
}
export interface MoveOutcomes {
  miss: MoveOutcomeMatchable;
  weak_hit: MoveOutcome;
  strong_hit: MoveOutcomeMatchable;
}
export interface MoveOutcomeMatchable {
  text: MarkdownString;
  count_as?: MoveOutcomeType;
  reroll?: MoveReroll;
  match?: MoveOutcome;
}
export interface MoveReroll {
  text?: MarkdownString;
  method: MoveRerollMethod;
}
export interface MoveOutcome {
  text: MarkdownString;
  count_as?: MoveOutcomeType;
  reroll?: MoveReroll;
}
export interface TriggerActionRoll {
  text: MarkdownString4;
  conditions: TriggerActionRollCondition[];
}
export interface TriggerActionRollCondition {
  text?: MarkdownString;
  method: MoveRollMethod | MoveOutcomeType;
  by?: TriggerBy;
  roll_options: TriggerActionRollConditionOption[];
}
export interface TriggerActionRollConditionOptionStat {
  using: PlayerStat | PlayerConditionMeter;
}
export interface TriggerActionRollConditionOptionRef {
  using: "ref";
  ref: AssetConditionMeterIDWildcard | AssetOptionFieldIDWildcard;
}
export interface TriggerActionRollConditionOptionAttachedAssetRef {
  using: "attached_asset_meter";
}
export interface TriggerActionRollConditionOptionCustomValue {
  using: "custom_value";
  label: Label;
  value: number;
}
export interface TriggerProgressRoll {
  text: MarkdownString6;
  conditions: TriggerProgressRollCondition[];
}
export interface TriggerProgressRollCondition {
  text?: MarkdownString;
  method: MoveRollMethod | MoveOutcomeType;
  by?: TriggerBy;
  roll_options: TriggerProgressRollConditionOption[];
}
export interface TriggerProgressRollConditionOption {
  using: ProgressType;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface AssetType {
  name: Label;
  canonical_name?: Label;
  source: Source;
  suggestions?: Suggestions;
  id: AssetTypeID;
  augments?: AssetTypeID1;
  /**
   * Collection borrows content from another collection. The target collection should be cloned, and this collection's values then merged to the clone as overrides.
   */
  imports?: {
    from: AssetTypeID2;
    /**
     * IDs (which may be wildcarded) for the items to import, or `null` if the entire collection should be imported.
     */
    include: null | AssetIDWildcard[];
  };
  color?: CSSColor;
  summary?: MarkdownString;
  description?: MarkdownString;
  contents?: {
    [k: string]: Asset;
  };
  member_label?: Label;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface Asset {
  id: AssetID;
  name: Label;
  source: Source;
  icon?: SVGImageURL;
  color?: CSSColor;
  options?: {
    [k: string]: AssetOptionField;
  };
  controls?: {
    [k: string]: AssetControlField;
  };
  suggestions?: Suggestions;
  requirement?: MarkdownString;
  /**
   * @minItems 3
   * @maxItems 3
   */
  abilities: [AssetAbility, AssetAbility, AssetAbility];
  condition_meter?: AssetConditionMeter1;
  /**
   * If `true`, this asset counts as an impact (Starforged) or a debility (classic Ironsworn).
   */
  count_as_impact: boolean;
  attachments?: AssetAttachment;
  /**
   * Most assets only benefit to their owner, but certain assets (like Starforged's module and command vehicle assets) are shared amongst the player's allies, too.
   */
  shared: boolean;
}
/**
 * Select a standard player stat or condition meter.
 */
export interface SelectFieldPlayerStat {
  id: string;
  label: Label;
  field_type: "select_stat";
  value?: PlayerStat | PlayerConditionMeter;
  choices: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^[a-z][a-z_]*$".
     */
    [k: string]: {
      label: Label;
      value: PlayerStat | PlayerConditionMeter;
      selected?: boolean;
    };
  };
}
export interface TextField {
  id: string;
  label: Label;
  field_type: "text";
  value?: string;
}
export interface CheckboxField {
  id: string;
  label: Label;
  field_type: "checkbox";
  value?: boolean;
}
export interface AssetAbility {
  id: AssetAbilityID;
  name?: Label;
  text: MarkdownString;
  enabled: boolean;
  /**
   * Unique moves added by this asset ability.
   */
  moves?: {
    [k: string]: Move;
  };
  options?: {
    [k: string]: AssetAbilityOptionField;
  };
  controls?: {
    [k: string]: AssetAbilityControlField;
  };
  augment_asset?: {
    icon?: SVGImageURL;
    color?: CSSColor;
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
  } & {
    condition_meter?: AssetConditionMeter;
  };
  augment_moves?: MoveAugment[];
}
export interface ClockField {
  id: string;
  label: Label;
  field_type: "clock";
  value: number;
  min: 0;
  max: 4 | 6 | 8 | 10;
}
export interface CounterField {
  id: string;
  label: Label;
  field_type: "counter";
  value: number;
  min: 0;
  max?: number;
}
/**
 * Describes which assets can be attached to this asset. Example: Starforged's Module assets, which can be equipped by Command Vehicle assets. See p. 55 of Starforged for more info.
 */
export interface AssetAttachment {
  /**
   * Asset IDs (which may be wildcards) that may be attached to this asset
   */
  assets: AssetIDWildcard[];
  /**
   * Omit if there's no upper limit to the number of attached assets.
   */
  max?: number;
}
export interface AssetConditionMeter {
  min?: number;
  max?: number;
  controls?: {
    [k: string]: AssetConditionMeterControlField;
  };
}
export interface MoveAugment {
  text?: MarkdownString;
  oracles?: OracleTableID[];
  augments?: MoveIDWithWildcard[];
  trigger?: unknown;
  move_type: MoveRollType;
  outcomes?: unknown;
}
export interface AssetConditionMeter1 {
  min: number;
  max: number;
  value?: number;
  id: AssetConditionMeterID;
  label: Label;
  controls?: {
    [k: string]: AssetConditionMeterControlField;
  };
}
/**
 * An encounter entry similar to those in Chapter 4 of Ironsworn: Starforged.
 *
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface EncounterStarforged {
  name: Label;
  canonical_name?: Label;
  source: Source;
  suggestions?: Suggestions;
  features: MarkdownString[];
  summary: MarkdownString;
  description: MarkdownString;
  quest_starter: MarkdownString;
  rank: ChallengeRank;
  drives: MarkdownString[];
  tactics: MarkdownString[];
  id: EncounterStarforgedID;
  nature: EncounterNatureStarforged;
  variants?: {
    [k: string]: EncounterVariantStarforged;
  };
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface EncounterVariantStarforged {
  name: Label;
  rank: ChallengeRank;
  description: MarkdownString;
  id: EncounterStarforgedID;
  nature: EncounterNatureStarforged;
}
/**
 * A setting truth category in the format used by Starforged.
 *
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z][a-z_]*$".
 */
export interface SettingTruth {
  name: Label;
  canonical_name?: Label;
  source: Source;
  suggestions?: Suggestions;
  options: SettingTruthOption[];
  icon?: SVGImageURL;
  id: SettingTruthID;
}
export interface SettingTruthOption {
  description: MarkdownString;
  quest_starter: MarkdownString;
  id: SettingTruthOptionID;
  summary: MarkdownString;
}
