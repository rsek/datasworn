/**
 * The root object for a Datasworn source file, whose schema is discriminated by the `type` property. Unlike the JSON schema for distribution, this may be a standalone object (Asset, Npc, Move, OracleRollable, DelveSite, DelveSiteTheme, DelveSiteDomain, or Rarity), but it still must specify its `ruleset` and `datasworn_version`.
 */
export type SourceRoot = RulesPackage | ((Asset | Npc | Move | OracleRollable | DelveSite | DelveSiteTheme | DelveSiteDomain | Rarity) & {
    /**
     * The version of the Datasworn format used by this data.
     * @pattern ```javascript
     * /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
     * ```
     */
    datasworn_version: '0.0.10';
    ruleset: RulesetId;
});
/**
 * Describes game rules compatible with the Ironsworn tabletop role-playing game by Shawn Tomkin.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `type` property as a discriminator.
 */
export type RulesPackage = Ruleset | Expansion;
/**
 * A standalone Datasworn package that describes its own ruleset.
 */
export interface Ruleset {
    _id: RulesetId;
    type: 'ruleset';
    /**
     * The version of the Datasworn format used by this data.
     * @pattern ```javascript
     * /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
     * ```
     */
    datasworn_version: '0.0.10';
    description?: MarkdownString;
    title?: SourceTitle;
    /**
     * Lists authors credited by the source material.
     */
    authors?: AuthorInfo[];
    /**
     * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
     */
    date?: Date;
    /**
     * A URL where the source document is available.
     * @example "https://ironswornrpg.com"
     */
    url?: WebUrl;
    license?: License;
    rules?: Rules;
    /**
     * A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.
     * @remarks Deserialize as a dictionary object.
     */
    oracles?: Record<DictKey, OracleTablesCollection>;
    /**
     * A dictionary object containing move categories, which contain moves.
     * @remarks Deserialize as a dictionary object.
     */
    moves?: Record<DictKey, MoveCategory>;
    /**
     * A dictionary object containing asset collections, which contain assets.
     * @remarks Deserialize as a dictionary object.
     */
    assets?: Record<DictKey, AssetCollection>;
    /**
     * A dictionary object containing atlas collections, which contain atlas entries.
     * @remarks Deserialize as a dictionary object.
     */
    atlas?: Record<DictKey, AtlasCollection>;
    /**
     * A dictionary object containing NPC collections, which contain NPCs.
     * @remarks Deserialize as a dictionary object.
     */
    npcs?: Record<DictKey, NpcCollection>;
    /**
     * A dictionary object of truth categories.
     * @remarks Deserialize as a dictionary object.
     */
    truths?: Record<DictKey, Truth>;
    /**
     * A dictionary object containing rarities, like those presented in Ironsworn: Delve.
     * @remarks Deserialize as a dictionary object.
     */
    rarities?: Record<DictKey, Rarity>;
    /**
     * A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve
     * @remarks Deserialize as a dictionary object.
     */
    delve_sites?: Record<DictKey, DelveSite>;
    /**
     * A dictionary object containing delve site themes.
     * @remarks Deserialize as a dictionary object.
     */
    site_themes?: Record<DictKey, DelveSiteTheme>;
    /**
     * A dictionary object containing delve site domains.
     * @remarks Deserialize as a dictionary object.
     */
    site_domains?: Record<DictKey, DelveSiteDomain>;
}
/**
 * A Datasworn package that relies on an external package to provide its ruleset.
 */
export interface Expansion {
    description?: MarkdownString;
    title?: SourceTitle;
    /**
     * Lists authors credited by the source material.
     */
    authors?: AuthorInfo[];
    /**
     * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
     */
    date?: Date;
    /**
     * A URL where the source document is available.
     * @example "https://ironswornrpg.com"
     */
    url?: WebUrl;
    license?: License;
    /**
     * A dictionary object containing oracle collections, which may contain oracle tables and/or oracle collections.
     * @remarks Deserialize as a dictionary object.
     */
    oracles?: Record<DictKey, OracleTablesCollection>;
    /**
     * A dictionary object containing move categories, which contain moves.
     * @remarks Deserialize as a dictionary object.
     */
    moves?: Record<DictKey, MoveCategory>;
    /**
     * A dictionary object containing asset collections, which contain assets.
     * @remarks Deserialize as a dictionary object.
     */
    assets?: Record<DictKey, AssetCollection>;
    /**
     * A dictionary object containing atlas collections, which contain atlas entries.
     * @remarks Deserialize as a dictionary object.
     */
    atlas?: Record<DictKey, AtlasCollection>;
    /**
     * A dictionary object containing NPC collections, which contain NPCs.
     * @remarks Deserialize as a dictionary object.
     */
    npcs?: Record<DictKey, NpcCollection>;
    /**
     * A dictionary object of truth categories.
     * @remarks Deserialize as a dictionary object.
     */
    truths?: Record<DictKey, Truth>;
    /**
     * A dictionary object containing rarities, like those presented in Ironsworn: Delve.
     * @remarks Deserialize as a dictionary object.
     */
    rarities?: Record<DictKey, Rarity>;
    /**
     * A dictionary object of delve sites, like the premade delve sites presented in Ironsworn: Delve
     * @remarks Deserialize as a dictionary object.
     */
    delve_sites?: Record<DictKey, DelveSite>;
    /**
     * A dictionary object containing delve site themes.
     * @remarks Deserialize as a dictionary object.
     */
    site_themes?: Record<DictKey, DelveSiteTheme>;
    /**
     * A dictionary object containing delve site domains.
     * @remarks Deserialize as a dictionary object.
     */
    site_domains?: Record<DictKey, DelveSiteDomain>;
    _id: ExpansionId;
    type: 'expansion';
    /**
     * The version of the Datasworn format used by this data.
     * @pattern ```javascript
     * /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
     * ```
     */
    datasworn_version: '0.0.10';
    ruleset: RulesetId;
    rules?: RulesExpansion;
}
/**
 * A unique ID for an AssetAbility.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/assets\/([a-z][a-z_]*)\/([a-z][a-z_]*)\/abilities\/(0|[1-9][0-9]*)$/
 * ```
 */
export type AssetAbilityId = string;
/**
 * A unique ID for an AssetCollection.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/collections\/assets\/([a-z][a-z_]*)$/
 * ```
 */
export type AssetCollectionId = string;
/**
 * A wildcarded ID that can be used to match multiple AssetCollections.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/collections\/assets\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type AssetCollectionIdWildcard = string;
/**
 * A unique ID for an Asset.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/assets\/([a-z][a-z_]*)\/([a-z][a-z_]*)$/
 * ```
 */
export type AssetId = string;
/**
 * A wildcarded ID that can be used to match multiple Assets.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/assets\/(\*|([a-z][a-z_]*))\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type AssetIdWildcard = string;
/**
 * A unique ID for an AtlasCollection.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/collections\/atlas\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/collections/atlas/ironlands"
 */
export type AtlasCollectionId = string;
/**
 * A wildcarded ID that can be used to match multiple AtlasCollections.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/collections\/atlas\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type AtlasCollectionIdWildcard = string;
/**
 * A unique ID for an AtlasEntry.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/atlas\/([a-z][a-z_]*)\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/atlas/ironlands/hinterlands"
 */
export type AtlasEntryId = string;
/**
 * A wildcarded ID that can be used to match multiple AtlasEntrys.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/atlas\/(\*|([a-z][a-z_]*))\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type AtlasEntryIdWildcard = string;
/**
 * A unique ID for a ConditionMeterRule.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/rules\/condition_meters\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/rules/condition_meters/health"
 * @example "starforged/rules/condition_meters/spirit"
 */
export type ConditionMeterRuleId = string;
/**
 * A unique ID for a DelveSiteDomain.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/site_domains\/([a-z][a-z_]*)$/
 * ```
 * @example "delve/site_domains/shadowfen"
 */
export type DelveSiteDomainId = string;
/**
 * A wildcarded ID that can be used to match multiple DelveSiteDomains.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/site_domains\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type DelveSiteDomainIdWildcard = string;
/**
 * A unique ID for a DelveSite.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/delve_sites\/([a-z][a-z_]*)$/
 * ```
 * @example "delve/delve_sites/alvas_rest"
 */
export type DelveSiteId = string;
/**
 * A wildcarded ID that can be used to match multiple DelveSites.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/delve_sites\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type DelveSiteIdWildcard = string;
/**
 * A unique ID for a DelveSiteTheme.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/site_themes\/([a-z][a-z_]*)$/
 * ```
 * @example "delve/site_themes/hallowed"
 */
export type DelveSiteThemeId = string;
/**
 * A wildcarded ID that can be used to match multiple DelveSiteThemes.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/site_themes\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type DelveSiteThemeIdWildcard = string;
/**
 * A `snake_case` key used in a Datasworn dictionary object.
 * @remarks If you need to generate a key from a user-provided label, it's recommended to use a 'slugify' function/library, e.g. https://www.npmjs.com/package/slugify for NodeJS.
 * @pattern ```javascript
 * /^([a-z][a-z_]*)$/
 * ```
 */
export type DictKey = string;
/**
 * The ID of a Datasworn package that relies on an external package to provide its ruleset.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})$/
 * ```
 * @example "delve"
 */
export type ExpansionId = string;
/**
 * A unique ID for an ImpactRuleCollection.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/collections\/rules\/impacts\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/collections/rules/impacts/conditions"
 * @example "starforged/collections/rules/impacts/vehicle_troubles"
 */
export type ImpactRuleCollectionId = string;
/**
 * A unique ID for an ImpactRule.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/rules\/impacts\/([a-z][a-z_]*)\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/rules/impacts/conditions/wounded"
 * @example "starforged/rules/impacts/vehicle_troubles/battered"
 */
export type ImpactRuleId = string;
/**
 * A unique ID for a MoveCategory.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/collections\/moves\/([a-z][a-z_]*)$/
 * ```
 * @example "starforged/collections/moves/adventure"
 */
export type MoveCategoryId = string;
/**
 * A wildcarded ID that can be used to match multiple MoveCategorys.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/collections\/moves\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type MoveCategoryIdWildcard = string;
/**
 * A move ID, for a standard move or a unique asset move
 * @example "classic/moves/combat/strike"
 * @example "starforged/assets/module/grappler/abilities/0/moves/ready_grappler"
 */
export type MoveId = string;
/**
 * A move ID with wildcards.
 */
export type MoveIdWildcard = string;
/**
 * A unique ID for a NpcCollection.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/collections\/npcs\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/collections/npcs/firstborn"
 * @example "starforged/collections/npcs/sample_npcs"
 */
export type NpcCollectionId = string;
/**
 * A wildcarded ID that can be used to match multiple NpcCollections.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/collections\/npcs\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type NpcCollectionIdWildcard = string;
/**
 * A unique ID for a Npc.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/npcs\/([a-z][a-z_]*)\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/npcs/firstborn/elf"
 * @example "starforged/npcs/sample_npcs/chiton"
 */
export type NpcId = string;
/**
 * A wildcarded ID that can be used to match multiple Npcs.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/npcs\/(\*|([a-z][a-z_]*))\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type NpcIdWildcard = string;
/**
 * A unique ID for a NpcVariant.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/npcs\/([a-z][a-z_]*)\/([a-z][a-z_]*)\/variants\/([a-z][a-z_]*)$/
 * ```
 * @example "starforged/npcs/sample_npcs/chiton/variants/chiton_drone_pack"
 */
export type NpcVariantId = string;
/**
 * A unique ID for an OracleCollection.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/collections\/oracles(\/([a-z][a-z_]*)){1,3}$/
 * ```
 * @example "starforged/collections/oracles/core"
 * @example "starforged/collections/oracles/character/names"
 * @example "starforged/collections/oracles/planets/furnace/settlements"
 */
export type OracleCollectionId = string;
/**
 * A wildcarded ID that can be used to match multiple OracleCollections.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/collections\/oracles((\/([a-z][a-z_]*)){1,3}|\/\*\*|\/\*\*\/([a-z][a-z_]*)|\/([a-z][a-z_]*)\/\*\*)$/
 * ```
 */
export type OracleCollectionIdWildcard = string;
/**
 * @example "starforged/oracles/core/action"
 * @example "starforged/oracles/character/names/given"
 * @example "starforged/oracles/planets/furnace/settlements/terminus"
 */
export type OracleRollableId = string;
/**
 * Oracle table wildcards can also use '**' to represent any number of collection levels in the oracle tree.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/oracles((\/([a-z][a-z_]*)){1,3}|\/\*\*|\/\*\*\/([a-z][a-z_]*)|\/([a-z][a-z_]*)\/\*\*)\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type OracleRollableIdWildcard = string;
/**
 * A unique ID for a Rarity.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/rarities\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/rarities/ayethins_journal"
 */
export type RarityId = string;
/**
 * A wildcarded ID that can be used to match multiple Raritys.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/rarities\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type RarityIdWildcard = string;
/**
 * The ID of standalone Datasworn package that describes its own ruleset.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})$/
 * ```
 * @example "classic"
 * @example "starforged"
 * @example "sundered_isles"
 */
export type RulesetId = string;
/**
 * A unique ID for a SpecialTrackRule.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/rules\/special_tracks\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/rules/special_tracks/bonds"
 * @example "delve/rules/special_tracks/failure"
 * @example "starforged/rules/special_tracks/bonds_legacy"
 */
export type SpecialTrackRuleId = string;
/**
 * A unique ID for a StatRule.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/rules\/stats\/([a-z][a-z_]*)$/
 * ```
 */
export type StatRuleId = string;
/**
 * A unique ID for a Truth.
 * @pattern ```javascript
 * /^([a-z0-9_]{3,})\/truths\/([a-z][a-z_]*)$/
 * ```
 * @example "classic/truths/iron"
 * @example "starforged/truths/iron"
 */
export type TruthId = string;
/**
 * A wildcarded ID that can be used to match multiple Truths.
 * @pattern ```javascript
 * /^(\*|([a-z0-9_]{3,}))\/truths\/(\*|([a-z][a-z_]*))$/
 * ```
 */
export type TruthIdWildcard = string;
/**
 * Information on the original creator of this material.
 * @example {}
 */
export interface AuthorInfo {
    /**
     * @example "Shawn Tomkin"
     */
    name: string;
    /**
     * An optional email contact for the author
     */
    email?: string;
    /**
     * An optional URL for the author's website.
     */
    url?: string;
}
/**
 * A CSS color value.
 * @remarks See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 */
export type CssColor = string;
/**
 * A date formatted YYYY-MM-DD.
 * @remarks You may prefer to deserialize this as a Date object.
 * @pattern ```javascript
 * /[0-9]{4}-((0[0-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))/
 * ```
 */
export type Date = string;
/**
 * An URL pointing to the location where this element's license can be found.
 *
 * A `null` here indicates that the content provides __no__ license, and is not intended for redistribution.
 * @example "https://creativecommons.org/licenses/by/4.0"
 * @example "https://creativecommons.org/licenses/by-nc-sa/4.0"
 */
export type License = WebUrl | null;
/**
 * Represents a page number in a book.
 * @minimum 1
 */
export type PageNumber = number;
/**
 * Metadata describing the original source of this item
 */
export interface SourceInfo {
    title: SourceTitle;
    /**
     * The page number where this item is described in full.
     */
    page?: PageNumber;
    /**
     * Lists authors credited by the source material.
     */
    authors: AuthorInfo[];
    /**
     * The date of the source documents's last update, formatted YYYY-MM-DD. Required because it's used to determine whether the data needs updating.
     */
    date: Date;
    /**
     * A URL where the source document is available.
     * @example "https://ironswornrpg.com"
     */
    url: WebUrl;
    license: License;
}
/**
 * The title of the source document.
 * @example "Ironsworn Rulebook"
 * @example "Ironsworn Assets Master Set"
 * @example "Ironsworn: Delve"
 * @example "Ironsworn: Starforged Rulebook"
 * @example "Ironsworn: Starforged Assets"
 * @example "Sundered Isles"
 */
export type SourceTitle = string;
/**
 * @experimental
 */
export interface Suggestions {
    oracles?: OracleRollableId[];
    assets?: AssetId[];
    moves?: MoveId[];
    site_domains?: DelveSiteDomainId[];
    site_themes?: DelveSiteThemeId[];
    npcs?: NpcId[];
    atlas?: AtlasEntryId[];
    rarities?: RarityId[];
}
/**
 * A relative (local) URL pointing to a vector image in the SVG format.
 * @pattern ```javascript
 * /\.svg$/
 * ```
 */
export type SvgImageUrl = string;
/**
 * An absolute URL pointing to a website.
 */
export type WebUrl = string;
/**
 * A relative (local) URL pointing to a raster image in the WEBP format.
 * @pattern ```javascript
 * /\.webp$/
 * ```
 */
export type WebpImageUrl = string;
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
 * A localized label for an input. In some contexts it may be undesirable to render this text, but it should always be exposed to assistive technology (e.g. with `aria-label` in HTML).
 * @pattern ```javascript
 * /^[^A-Z]+$/
 * ```
 * @i18n
 */
export type InputLabel = string;
/**
 * A localized plain text name or label.
 * @i18n
 */
export type Label = string;
/**
 * Localized text, formatted in Markdown.
 *
 * It uses some custom syntax; e.g. `{{table:some_oracle_table_id}}` indicates that the referenced oracle table is rendered there in the source material.
 * @i18n
 */
export type MarkdownString = string;
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
 */
export type PartOfSpeech = 'common_noun' | 'proper_noun' | 'adjunct_common_noun' | 'adjunct_proper_noun' | 'verb' | 'gerund' | 'adjective' | 'attributive_verb' | 'adjective_as_proper_noun' | 'common_noun_as_proper_noun';
/**
 * A rich text string in Markdown with replaced values from oracle roll results.
 *
 * The custom syntax `{{some_row_key:some_oracle_table_id}}` should be replaced by the `some_row_key` string of a rolled oracle table. This is usually the `result` key, for example `{{result:starforged/oracles/core/action}}`
 *
 * @i18n
 * @experimental
 */
export type TemplateString = string;
export type CollectableType = 'oracle_rollable' | 'move' | 'asset' | 'atlas_entry' | 'npc';
export type CollectionType = 'oracle_collection' | 'move_category' | 'asset_collection' | 'atlas_collection' | 'npc_collection';
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
    shared?: boolean;
    label: InputLabel;
    /**
     * The current value of this meter.
     * @default 0
     */
    value?: number;
    /**
     * The minimum value of this meter.
     * @default 0
     */
    min?: number;
    /**
     * The maximum value of this meter.
     */
    max: number;
    /**
     * Is this meter's `value` usable as a stat in an action roll?
     */
    rollable?: true;
}
/**
 * Describes a category of standard impacts/debilities.
 */
export interface ImpactCategory {
    /**
     * A label for this impact category.
     */
    label: InputLabel;
    /**
     * A description of this impact category.
     */
    description: MarkdownString;
    /**
     * A dictionary object of the Impacts in this category.
     * @remarks Deserialize as a dictionary object.
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
    label: InputLabel;
    /**
     * A description of this impact.
     */
    description: MarkdownString;
    /**
     * Is this impact applied to all players at once?
     * @default false
     */
    shared?: boolean;
    /**
     * Any ruleset condition meters that can't recover when this impact is active.
     * @default []
     */
    prevents_recovery?: ConditionMeterKey[];
    /**
     * Is this impact permanent?
     * @default false
     */
    permanent?: boolean;
}
export type NonCollectableType = 'delve_site' | 'delve_site_theme' | 'delve_site_domain' | 'truth' | 'rarity';
export type ObjectType = CollectableType | NonCollectableType | CollectionType;
/**
 * Describes rules for player characters in this ruleset, such as stats and condition meters.
 * @experimental
 */
export interface Rules {
    /**
     * Describes the standard stats used by player characters in this ruleset.
     * @remarks Deserialize as a dictionary object.
     */
    stats: Record<DictKey, StatRule>;
    /**
     * Describes the standard condition meters used by player characters in this ruleset.
     * @remarks Deserialize as a dictionary object.
     */
    condition_meters: Record<DictKey, ConditionMeterRule>;
    /**
     * Describes the standard impacts/debilities used by player characters in this ruleset.
     * @remarks Deserialize as a dictionary object.
     */
    impacts: Record<DictKey, ImpactCategory>;
    /**
     * Describes the special tracks used by player characters in this ruleset, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
     * @remarks Deserialize as a dictionary object.
     */
    special_tracks: Record<DictKey, SpecialTrackRule>;
    /**
     * @remarks Deserialize as a dictionary object.
     * @default
     * ```javascript
     * 	{
     *
     * 	}
     * ```
     * @experimental
     */
    tags?: Record<DictKey, TagRule>;
}
/**
 * Describes rules for player characters in this ruleset, such as stats and condition meters.
 * @experimental
 */
export interface RulesExpansion {
    /**
     * Describes the standard stats used by player characters in this ruleset.
     * @remarks Deserialize as a dictionary object.
     */
    stats?: Record<DictKey, StatRule>;
    /**
     * Describes the standard condition meters used by player characters in this ruleset.
     * @remarks Deserialize as a dictionary object.
     */
    condition_meters?: Record<DictKey, ConditionMeterRule>;
    /**
     * Describes the standard impacts/debilities used by player characters in this ruleset.
     * @remarks Deserialize as a dictionary object.
     */
    impacts?: Record<DictKey, ImpactCategory>;
    /**
     * Describes the special tracks used by player characters in this ruleset, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
     * @remarks Deserialize as a dictionary object.
     */
    special_tracks?: Record<DictKey, SpecialTrackRule>;
    /**
     * @remarks Deserialize as a dictionary object.
     * @default
     * ```javascript
     * 	{
     *
     * 	}
     * ```
     * @experimental
     */
    tags?: Record<DictKey, TagRule>;
}
/**
 * Describes a special track like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
 */
export interface SpecialTrackRule {
    /**
     * A label for this special track.
     */
    label: InputLabel;
    /**
     * A description of this special track.
     */
    description: MarkdownString;
    /**
     * Is this track shared by all players?
     * @default false
     */
    shared?: boolean;
    /**
     * Is this track an optional rule?
     * @default false
     */
    optional?: boolean;
}
/**
 * Describes a standard player character stat.
 */
export interface StatRule {
    /**
     * A label for this stat.
     * @example "edge"
     */
    label: InputLabel;
    /**
     * A description of this stat.
     * @example "Quickness, agility, and prowess when fighting at a distance."
     */
    description: MarkdownString;
}
export type Tag = boolean | number | DictKey | DiceExpression | OracleRollableId | MoveId | AssetId | AtlasEntryId | NpcId | OracleCollectionId | MoveCategoryId | AssetCollectionId | AtlasCollectionId | NpcCollectionId | DelveSiteId | DelveSiteThemeId | DelveSiteDomainId | TruthId | RarityId | Array<OracleRollableIdWildcard | MoveIdWildcard | AssetIdWildcard | AtlasEntryIdWildcard | NpcIdWildcard | OracleCollectionIdWildcard | MoveCategoryIdWildcard | AssetCollectionIdWildcard | AtlasCollectionIdWildcard | NpcCollectionIdWildcard | DelveSiteIdWildcard | DelveSiteThemeIdWildcard | DelveSiteDomainIdWildcard | TruthIdWildcard | RarityIdWildcard>;
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `value_type` property as a discriminator.
 */
export type TagRule = {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * @default false
     */
    array?: boolean;
    value_type: 'boolean';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * @default false
     */
    array?: boolean;
    value_type: 'integer';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'oracle_rollable';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'move';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'asset';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'atlas_entry';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'npc';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'oracle_collection';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'move_category';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'asset_collection';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'atlas_collection';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'npc_collection';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'delve_site';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'delve_site_theme';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'delve_site_domain';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'truth';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this field accepts a single non-wildcard ID.
     * @default false
     */
    wildcard?: boolean;
    value_type: 'rarity';
} | {
    /**
     * Types of object that can receive this tag, or `null` if any type of object accepts it.
     * @default null
     */
    applies_to?: ObjectType[] | null;
    description: MarkdownString;
    /**
     * @default false
     */
    array?: boolean;
    value_type: 'enum';
    enum: DictKey[];
};
/**
 * Challenge rank, represented as an integer from 1 (troublesome) to 5 (epic).
 *
 *   - `1`: Troublesome
 *   - `2`: Dangerous
 *   - `3`: Formidable
 *   - `4`: Extreme
 *   - `5`: Epic
 */
export type ChallengeRank = 1 | 2 | 3 | 4 | 5;
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
     */
    controls?: Record<DictKey, {}>;
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
export type SpecialTrackType = DictKey;
/**
 * A reference to the value of an asset control.
 */
export interface AssetControlValueRef {
    /**
     * Asset IDs (which may be wildcarded) that may provide the control field. For asset ability enhancements, `null` is used to represent the asset's own control fields.
     * @default null
     */
    assets?: AssetIdWildcard[] | null;
    /**
     * The dictionary key of the asset control field.
     * @example "health"
     * @example "integrity"
     */
    control: DictKey;
    /**
     * A reference to the value of an asset control.
     */
    using: 'asset_control';
}
/**
 * A reference to the value of an asset option.
 */
export interface AssetOptionValueRef {
    /**
     * Asset IDs (which may be wildcarded) that may provide the option field. For asset ability enhancements, `null` is used to represent the asset's own option fields.
     * @default null
     */
    assets?: AssetIdWildcard[] | null;
    /**
     * The dictionary key of the asset option field.
     */
    option: DictKey;
    /**
     * A reference to the value of an asset option.
     */
    using: 'asset_option';
}
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
    using: 'attached_asset_control';
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
    using: 'attached_asset_option';
}
/**
 * A reference to the value of a standard player condition meter.
 */
export interface ConditionMeterValueRef {
    condition_meter: ConditionMeterKey;
    /**
     * A reference to the value of a standard player condition meter.
     */
    using: 'condition_meter';
}
/**
 * An arbitrary static integer value with a label.
 */
export interface CustomValue {
    label: InputLabel;
    value: number;
    /**
     * An arbitrary static integer value with a label.
     */
    using: 'custom';
}
/**
 * Provides a value like a stat, condition meter, or other number (usually for use in an action roll). The expected value is an integer, or null.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `using` property as a discriminator.
 */
export type RollableValue = StatValueRef | ConditionMeterValueRef | AssetControlValueRef | AssetOptionValueRef | AttachedAssetControlValueRef | AttachedAssetOptionValueRef | CustomValue;
/**
 * A reference to the value of a standard player character stat.
 */
export interface StatValueRef {
    stat: StatKey;
    /**
     * A reference to the value of a standard player character stat.
     */
    using: 'stat';
}
/**
 * A non-player character entry, similar to those in Chapter 5 of the Ironsworn Rulebook, or Chapter 4 of Starforged.
 */
export interface Npc {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: NpcId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
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
     */
    variants?: Record<DictKey, NpcVariant>;
    type: 'npc';
}
export interface NpcCollection {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: NpcCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'npc_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: NpcCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: NpcCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, Npc>;
}
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
export type NpcNature = Label;
export interface NpcVariant {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: NpcVariantId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
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
 * A simple dice roll expression with an optional modifer.
 * @pattern ```javascript
 * /([1-9][0-9]*)d([1-9][0-9]*)([+-]([1-9][0-9]*))?/
 * ```
 * @example "1d100"
 * @example "1d6+2"
 */
export type DiceExpression = string;
/**
 * Special roll instructions to use when rolling multiple times on a single oracle.
 *
 *   - `reroll`: Duplicate results should be re-rolled.
 *   - `keep`: Duplicates results should be kept.
 *   - `make_it_worse`: Duplicate results should be kept, and they compound to make things worse.
 */
export type OracleDuplicateBehavior = 'reroll' | 'keep' | 'make_it_worse';
export interface OracleMatchBehavior {
    text: MarkdownString;
}
export interface OracleRoll {
    /**
     * The ID of the oracle to be rolled. A `null` value indicates that it's a roll on the same table.
     * @default null
     */
    oracle?: OracleRollableId | null;
    /**
     * Both Ironsworn and Starforged explicitly recommend *against* rolling all details at once. That said, some oracle results only provide useful information once a secondary roll occurs, such as "Action + Theme" or "Roll twice".
     * @default false
     */
    auto?: boolean;
    /**
     * Special rules on how to handle duplicate results, when rolling multiple times.
     * @default "reroll"
     */
    duplicates?: OracleDuplicateBehavior;
    /**
     * The dice roll to make on the oracle table. Set it to `null` if you just want the table's default.
     * @default null
     */
    dice?: DiceExpression | null;
    /**
     * The number of times to roll.
     * @default 1
     * @minimum 1
     */
    number_of_rolls?: number;
}
/**
 * Provides string templates that may be used in place of the static row text from `OracleTableRow#text`, `OracleTableRow#text2`, and `OracleTableRow#text3`.
 *
 *   These strings are formatted in Markdown, but use a special syntax for their placeholders: `{{text:some_oracle_table_id}}`. The placeholder should be replaced with the value of a rolled (or selected) `OracleTableRow#text` from the target oracle table ID.
 * @experimental
 */
export interface OracleRollTemplate {
    /**
     * A string template that may be used in place of OracleTableRow#text.
     * @example "{{text:starforged/oracles/factions/affiliation}} of the {{text:starforged/oracles/factions/legacy}} {{text:starforged/oracles/factions/identity}}"
     */
    text?: TemplateString;
    /**
     * A string template that may be used in place of OracleTableRow#text2.
     */
    text2?: TemplateString;
    /**
     * A string template that may be used in place of OracleTableRow#text3.
     */
    text3?: TemplateString;
}
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type OracleCollection = OracleTablesCollection | OracleTableSharedRolls | OracleTableSharedText | OracleTableSharedText2 | OracleTableSharedText3;
/**
 * Represents a single column in an OracleCollection.
 */
export interface OracleColumnText {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleRollableId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary label at the head of this column.
     */
    name: Label;
    /**
     * Optional secondary text at the head of this column. For best results, this should be no more than a few words in length.
     */
    summary?: MarkdownString;
    /**
     * An optional thematic color for this column. For an example, see "Basic Creature Form" (Starforged p. 337)
     */
    color?: CssColor;
    /**
     * An optional icon for this column.
     */
    icon?: SvgImageUrl;
    /**
     * Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.
     */
    replaces?: OracleRollableId;
    /**
     * The roll used to select a result on this oracle.
     * @default "1d100"
     */
    dice?: DiceExpression;
    /**
     * Most oracle tables are insensitive to matches, but a few define special match behavior.
     */
    match?: OracleMatchBehavior;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    suggestions?: Suggestions;
    type: 'oracle_rollable';
    /**
     * An array of objects, each representing a single row of the table.
     */
    rows: OracleTableRowText[];
    oracle_type: 'column_text';
}
export interface OracleColumnText2 {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleRollableId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary label at the head of this column.
     */
    name: Label;
    /**
     * Optional secondary text at the head of this column. For best results, this should be no more than a few words in length.
     */
    summary?: MarkdownString;
    /**
     * An optional thematic color for this column. For an example, see "Basic Creature Form" (Starforged p. 337)
     */
    color?: CssColor;
    /**
     * An optional icon for this column.
     */
    icon?: SvgImageUrl;
    /**
     * Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.
     */
    replaces?: OracleRollableId;
    /**
     * The roll used to select a result on this oracle.
     * @default "1d100"
     */
    dice?: DiceExpression;
    /**
     * Most oracle tables are insensitive to matches, but a few define special match behavior.
     */
    match?: OracleMatchBehavior;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    suggestions?: Suggestions;
    type: 'oracle_rollable';
    /**
     * An array of objects, each representing a single row of the table.
     */
    rows: Array<OracleTableRowText2>;
    oracle_type: 'column_text2';
}
export interface OracleColumnText3 {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleRollableId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary label at the head of this column.
     */
    name: Label;
    /**
     * Optional secondary text at the head of this column. For best results, this should be no more than a few words in length.
     */
    summary?: MarkdownString;
    /**
     * An optional thematic color for this column. For an example, see "Basic Creature Form" (Starforged p. 337)
     */
    color?: CssColor;
    /**
     * An optional icon for this column.
     */
    icon?: SvgImageUrl;
    /**
     * Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.
     */
    replaces?: OracleRollableId;
    /**
     * The roll used to select a result on this oracle.
     * @default "1d100"
     */
    dice?: DiceExpression;
    /**
     * Most oracle tables are insensitive to matches, but a few define special match behavior.
     */
    match?: OracleMatchBehavior;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    suggestions?: Suggestions;
    type: 'oracle_rollable';
    /**
     * An array of objects, each representing a single row of the table.
     */
    rows: Array<OracleTableRowText3>;
    oracle_type: 'column_text3';
}
/**
 * A collection of table rows from which random results may be rolled. This may represent a standalone table, or a column in a larger table.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type OracleRollable = OracleTableText | OracleTableText2 | OracleTableText3 | OracleColumnText | OracleColumnText2 | OracleColumnText3;
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `oracle_type` property as a discriminator.
 */
export type OracleTableRollable = OracleTableText | OracleTableText2 | OracleTableText3;
export type OracleTableRow = OracleTableRowText | OracleTableRowText2 | OracleTableRowText3;
/**
 * Represents a row in an oracle table, with a single text cell.
 */
export interface OracleTableRowText {
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
     * Low end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
     * @default null
     */
    min?: number | null;
    /**
     * High end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
     * @default null
     */
    max?: number | null;
}
/**
 * Represents a row in an oracle table that provides a secondary text field.
 */
export interface OracleTableRowText2 {
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
     * Low end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
     * @default null
     */
    min?: number | null;
    /**
     * High end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
     * @default null
     */
    max?: number | null;
    /**
     * The secondary text for this row. Use `null` to represent a cell with a blank or empty vlue.
     */
    text2: MarkdownString | null;
}
/**
 * Represents a row in an oracle table with 3 text cells.
 */
export interface OracleTableRowText3 {
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
     * Low end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
     * @default null
     */
    min?: number | null;
    /**
     * High end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.
     * @default null
     */
    max?: number | null;
    /**
     * The secondary text for this row. Use `null` to represent a cell with a blank or empty vlue.
     */
    text2: MarkdownString | null;
    /**
     * The tertiary text for this row. Use `null` to represent a cell with a blank or empty vlue.
     */
    text3: MarkdownString | null;
}
/**
 * An OracleCollection representing a single table with one roll column and multiple `result` columns.
 */
export interface OracleTableSharedRolls {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'oracle_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: OracleCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: OracleCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, OracleColumnText>;
    /**
     * Provides column labels for this table. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row). For all other column labels, see the `name` property of each child `OracleColumn`.
     * @default {}
     */
    column_labels?: {
        /**
         * @default "Roll"
         */
        roll: Label;
    };
    /**
     * A table with one shared roll column, and multiple unique text columns.
     */
    oracle_type?: 'table_shared_rolls';
}
/**
 * An OracleCollection representing a single table with multiple roll columns and one `result` column.
 */
export interface OracleTableSharedText {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'oracle_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: OracleCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: OracleCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, OracleColumnText>;
    /**
     * The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).
     * @default {}
     */
    column_labels?: {
        /**
         * @default "Result"
         */
        text: Label;
    };
    /**
     * A table with multiple unique roll columns, and one shared text column.
     */
    oracle_type: 'table_shared_text';
}
/**
 * An OracleCollection representing a single table with multiple roll columns, and 2 shared text columns.
 */
export interface OracleTableSharedText2 {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'oracle_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: OracleCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: OracleCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, OracleColumnText2>;
    /**
     * The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).
     * @default {}
     */
    column_labels?: {
        /**
         * @default "Result"
         */
        text: Label;
        /**
         * @default "Details"
         */
        text2: Label;
    };
    /**
     * A table with multiple unique roll columns, and 2 shared text columns.
     */
    oracle_type: 'table_shared_text2';
}
/**
 * An OracleCollection representing a single table with multiple roll columns, and 2 shared text columns.
 */
export interface OracleTableSharedText3 {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'oracle_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: OracleCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: OracleCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, OracleColumnText3>;
    /**
     * The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).
     * @default {}
     */
    column_labels?: {
        /**
         * @default "Result"
         */
        text: Label;
    };
    /**
     * A table with multiple unique roll columns, and 3 shared text columns.
     */
    oracle_type: 'table_shared_text3';
}
/**
 * Represents a basic rollable oracle table with one roll column and one text result column.
 */
export interface OracleTableText {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleRollableId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    oracle_type: 'table_text';
    /**
     * Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.
     */
    replaces?: OracleRollableId;
    /**
     * The roll used to select a result on this oracle.
     * @default "1d100"
     */
    dice?: DiceExpression;
    /**
     * Most oracle tables are insensitive to matches, but a few define special match behavior.
     */
    match?: OracleMatchBehavior;
    type: 'oracle_rollable';
    /**
     * An array of objects, each representing a single row of the table.
     */
    rows: OracleTableRowText[];
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
     * An icon that represents this table.
     */
    icon?: SvgImageUrl;
    /**
     * A brief summary of the oracle table's intended usage, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of the oracle table's intended usage, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    /**
     * The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).
     * @default {}
     */
    column_labels?: {
        /**
         * @default "Roll"
         */
        roll: Label;
        /**
         * @default "Result"
         */
        text: Label;
    };
}
/**
 * A rollable oracle table with one roll column and two text columns.
 */
export interface OracleTableText2 {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleRollableId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    oracle_type: 'table_text2';
    /**
     * Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.
     */
    replaces?: OracleRollableId;
    /**
     * The roll used to select a result on this oracle.
     * @default "1d100"
     */
    dice?: DiceExpression;
    /**
     * Most oracle tables are insensitive to matches, but a few define special match behavior.
     */
    match?: OracleMatchBehavior;
    type: 'oracle_rollable';
    /**
     * An array of objects, each representing a single row of the table.
     */
    rows: Array<OracleTableRowText2>;
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
     * An icon that represents this table.
     */
    icon?: SvgImageUrl;
    /**
     * A brief summary of the oracle table's intended usage, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of the oracle table's intended usage, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    /**
     * The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).
     * @default {}
     */
    column_labels?: {
        /**
         * @default "Roll"
         */
        roll: Label;
        /**
         * @default "Result"
         */
        text: Label;
        /**
         * @default "Details"
         */
        text2: Label;
    };
}
/**
 * A rollable oracle table with one roll column and 3 text columns.
 */
export interface OracleTableText3 {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleRollableId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    oracle_type: 'table_text3';
    /**
     * Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.
     */
    replaces?: OracleRollableId;
    /**
     * The roll used to select a result on this oracle.
     * @default "1d100"
     */
    dice?: DiceExpression;
    /**
     * Most oracle tables are insensitive to matches, but a few define special match behavior.
     */
    match?: OracleMatchBehavior;
    type: 'oracle_rollable';
    /**
     * An array of objects, each representing a single row of the table.
     */
    rows: Array<OracleTableRowText3>;
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
     * An icon that represents this table.
     */
    icon?: SvgImageUrl;
    /**
     * A brief summary of the oracle table's intended usage, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of the oracle table's intended usage, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    /**
     * The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).
     * @default {}
     */
    column_labels?: {
        roll: Label;
        text: Label;
        text2: Label;
        text3: Label;
    };
}
/**
 * An OracleCollection that represents a category or grouping of tables, which may themselves be `OracleTablesCollection`s.
 */
export interface OracleTablesCollection {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: OracleCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'oracle_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: OracleCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: OracleCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, OracleTableRollable>;
    /**
     * A grouping of separate tables.
     */
    oracle_type?: 'tables';
    /**
     * @remarks Deserialize as a dictionary object.
     */
    collections?: Record<DictKey, OracleCollection>;
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
export type ActionRollMethod = 'miss' | 'weak_hit' | 'strong_hit' | 'player_choice' | 'highest' | 'lowest' | 'all';
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `roll_type` property as a discriminator.
 */
export type Move = MoveActionRoll | MoveNoRoll | MoveProgressRoll | MoveSpecialTrack;
/**
 * A move that makes an action roll.
 */
export interface MoveActionRoll {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: MoveId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * Indicates that this move replaces the identified move. References to the replaced move can be considered equivalent to this move.
     */
    replaces?: MoveId;
    /**
     * The complete rules text of the move.
     */
    text: MarkdownString;
    /**
     * Oracles associated with this move. It's not recommended to roll these automatically, as almost all moves present them as an option, not a requirement.
     */
    oracles?: OracleRollableId[];
    /**
     * A move that makes an action roll.
     */
    roll_type: 'action_roll';
    /**
     * Trigger conditions for this move.
     */
    trigger: TriggerActionRoll;
    outcomes: MoveOutcomes;
    type: 'move';
}
/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveActionRollEnhancement {
    /**
     * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
     * @default null
     */
    enhances?: MoveIdWildcard[] | null;
    /**
     * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
     */
    roll_type: 'action_roll';
    trigger?: TriggerActionRollEnhancement;
}
export interface MoveCategory {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: MoveCategoryId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'move_category';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: MoveCategoryId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: MoveCategoryId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, Move>;
}
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `roll_type` property as a discriminator.
 */
export type MoveEnhancement = MoveActionRollEnhancement | MoveNoRollEnhancement | MoveProgressRollEnhancement | MoveSpecialTrackEnhancement;
/**
 * A move that makes no progress rolls or action rolls.
 */
export interface MoveNoRoll {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: MoveId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * Indicates that this move replaces the identified move. References to the replaced move can be considered equivalent to this move.
     */
    replaces?: MoveId;
    /**
     * The complete rules text of the move.
     */
    text: MarkdownString;
    /**
     * Oracles associated with this move. It's not recommended to roll these automatically, as almost all moves present them as an option, not a requirement.
     */
    oracles?: OracleRollableId[];
    /**
     * A move that makes no action rolls or progress rolls.
     */
    roll_type: 'no_roll';
    /**
     * Trigger conditions for this move.
     */
    trigger: TriggerNoRoll;
    /**
     * @default null
     */
    outcomes?: null;
    type: 'move';
}
/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveNoRollEnhancement {
    /**
     * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
     * @default null
     */
    enhances?: MoveIdWildcard[] | null;
    /**
     * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
     */
    roll_type: 'no_roll';
    trigger?: TriggerNoRollEnhancement;
}
export interface MoveOutcome {
    /**
     * @pattern ```javascript
     * /On a __(strong hit|weak hit|miss)__/
     * ```
     */
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
     * The unique Datasworn ID for this item.
     */
    _id?: MoveId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * Indicates that this move replaces the identified move. References to the replaced move can be considered equivalent to this move.
     */
    replaces?: MoveId;
    /**
     * The complete rules text of the move.
     */
    text: MarkdownString;
    /**
     * Oracles associated with this move. It's not recommended to roll these automatically, as almost all moves present them as an option, not a requirement.
     */
    oracles?: OracleRollableId[];
    /**
     * A progress move that rolls on a standard progress track type (defined by this move).
     */
    roll_type: 'progress_roll';
    /**
     * Trigger conditions for this move.
     */
    trigger: TriggerProgressRoll;
    outcomes: MoveOutcomes;
    type: 'move';
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
    enhances?: MoveIdWildcard[] | null;
    /**
     * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
     */
    roll_type: 'progress_roll';
    trigger?: TriggerProgressRollEnhancement;
}
/**
 *   - `no_roll`: A move that makes no action rolls or progress rolls.
 *   - `action_roll`: A move that makes an action roll.
 *   - `progress_roll`: A progress move that rolls on a standard progress track type (defined by this move).
 *   - `special_track`: A progress move that rolls on one or more special tracks, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
 */
export type MoveRollType = 'no_roll' | 'action_roll' | 'progress_roll' | 'special_track';
/**
 * A progress move that rolls on a special track, such as Legacies (Starforged) or Bonds (classic Ironsworn). For progress moves that use standard progress tracks, see MoveProgressRoll instead.
 */
export interface MoveSpecialTrack {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: MoveId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * Indicates that this move replaces the identified move. References to the replaced move can be considered equivalent to this move.
     */
    replaces?: MoveId;
    /**
     * The complete rules text of the move.
     */
    text: MarkdownString;
    /**
     * Oracles associated with this move. It's not recommended to roll these automatically, as almost all moves present them as an option, not a requirement.
     */
    oracles?: OracleRollableId[];
    /**
     * A progress move that rolls on one or more special tracks, like Bonds (classic Ironsworn), Failure (Delve), or Legacies (Starforged).
     */
    roll_type: 'special_track';
    /**
     * Trigger conditions for this move.
     */
    trigger: TriggerSpecialTrack;
    outcomes: MoveOutcomes;
    type: 'move';
}
/**
 * An object that describes changes to a move. These changes should be applied recursively, altering only the specified properties; enhanced arrays should be concatencated with the original array value.
 */
export interface MoveSpecialTrackEnhancement {
    /**
     * An array of wildcard IDs. An item must match one of the wildcard IDs to receive this enhancement. If this is `null`, any ID is valid.
     * @default null
     */
    enhances?: MoveIdWildcard[] | null;
    /**
     * A move must have this `roll_type` to receive this enhancement. This is in addition to any other restrictions made by other properties.
     */
    roll_type: 'special_track';
    trigger?: TriggerSpecialTrackEnhancement;
}
/**
 *   - `miss`: An automatic miss.
 *   - `weak_hit`: An automatic weak hit.
 *   - `strong_hit`: An automatic strong hit.
 *   - `progress_roll`: Make a progress roll on a progress track associated with this move.
 */
export type ProgressRollMethod = 'miss' | 'weak_hit' | 'strong_hit' | 'progress_roll';
export interface ProgressRollOption {
    using: 'progress_track';
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
export type SpecialTrackRollMethod = 'miss' | 'weak_hit' | 'strong_hit' | 'player_choice' | 'highest' | 'lowest' | 'all';
/**
 * Describes trigger conditions for a move that makes an action roll.
 */
export interface TriggerActionRoll {
    /**
     * A markdown string containing the primary trigger text for this move.
     *
     * Secondary trigger text (for specific stats or uses of an asset ability) may be described in individual trigger conditions.
     * @pattern ```javascript
     * /.*\.{3}/
     * ```
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
    method?: ActionRollMethod | null;
    /**
     * @default null
     */
    roll_options?: RollableValue[] | null;
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
    player?: boolean;
    /**
     * Can this trigger be activated by one of the player's allies?
     * @default false
     */
    ally?: boolean;
}
/**
 * Describes trigger conditions for a move that makes no rolls.
 */
export interface TriggerNoRoll {
    /**
     * A markdown string containing the primary trigger text for this move.
     *
     * Secondary trigger text (for specific stats or uses of an asset ability) may be described in individual trigger conditions.
     * @pattern ```javascript
     * /.*\.{3}/
     * ```
     */
    text: MarkdownString;
    /**
     * Specific conditions that qualify for this trigger.
     * @default null
     */
    conditions?: TriggerNoRollCondition[] | null;
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
    method?: null;
    /**
     * The options available when rolling with this trigger condition.
     * @default null
     */
    roll_options?: null;
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
     * @pattern ```javascript
     * /.*\.{3}/
     * ```
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
    method?: ProgressRollMethod;
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
    method?: ProgressRollMethod | null;
    /**
     * @default null
     */
    roll_options?: ProgressRollOption[] | null;
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
     * @pattern ```javascript
     * /.*\.{3}/
     * ```
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
    method?: SpecialTrackRollMethod | null;
    /**
     * @default null
     */
    roll_options?: TriggerSpecialTrackConditionOption[] | null;
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
export interface Asset {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: AssetId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
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
     * This asset's icon.
     */
    icon?: SvgImageUrl;
    /**
     * A thematic color associated with this asset.
     */
    color?: CssColor;
    /**
     * Options are input fields set when the player purchases the asset. They're likely to remain the same through the life of the asset. Typically, they are rendered at the top of the asset card.
     * @remarks Deserialize as a dictionary object.
     */
    options?: Record<DictKey, AssetOptionField>;
    /**
     * Describes prerequisites for purchasing or using this asset.
     */
    requirement?: MarkdownString;
    abilities: AssetAbility[];
    /**
     * Controls are condition meters, clocks, counters, and other asset input fields whose values are expected to change throughout the life of the asset.
     * @remarks Deserialize as a dictionary object.
     */
    controls?: Record<DictKey, AssetControlField>;
    /**
     * If `true`, this asset counts as an impact (Starforged) or a debility (classic Ironsworn).
     * @default false
     */
    count_as_impact?: boolean;
    attachments?: AssetAttachment;
    /**
     * Most assets only benefit to their owner, but certain assets (like Starforged's module and command vehicle assets) are shared amongst the player's allies, too.
     * @default false
     */
    shared?: boolean;
    type: 'asset';
}
/**
 * An asset ability: one of the purchasable features of an asset. Most assets have three.
 */
export interface AssetAbility {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: AssetAbilityId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
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
    enabled?: boolean;
    /**
     * Unique moves added by this asset ability.
     * @remarks Deserialize as a dictionary object.
     */
    moves?: Record<DictKey, Move>;
    /**
     * Fields that are expected to be set once and remain the same through the life of the asset.
     * @remarks Deserialize as a dictionary object.
     */
    options?: Record<DictKey, AssetAbilityOptionField>;
    /**
     * Fields whose values are expected to change over the life of the asset.
     * @remarks Deserialize as a dictionary object.
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
}
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetAbilityControlField = ClockField | CounterField | AssetCheckboxField | TextField;
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetAbilityOptionField = TextField;
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
    max?: number | null;
}
export interface AssetCardFlipField {
    label: InputLabel;
    /**
     * Is the card flipped over?
     * @default false
     */
    value?: boolean;
    field_type: 'card_flip';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
    /**
     * Does this field count as an impact (Starforged) or debility (Ironsworn classic) when its value is set to `true`?
     * @default false
     */
    is_impact?: boolean;
    /**
     * Does this field disable the asset when its value is set to `true`?
     * @default false
     */
    disables_asset?: boolean;
}
export interface AssetCheckboxField {
    label: InputLabel;
    /**
     * Is the box checked?
     * @default false
     */
    value?: boolean;
    field_type: 'checkbox';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
    /**
     * Does this field count as an impact (Starforged) or debility (Ironsworn classic) when its value is set to `true`?
     * @default false
     */
    is_impact?: boolean;
    /**
     * Does this field disable the asset when its value is set to `true`?
     * @default false
     */
    disables_asset?: boolean;
}
export interface AssetCollection {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: AssetCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'asset_collection';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: AssetCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: AssetCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, Asset>;
}
/**
 * Some assets provide a special condition meter of their own. The most common example is the health meters on companion assets. Asset condition meters may also include their own controls, such as the checkboxes that Starforged companion assets use to indicate they are "out of action".
 */
export interface AssetConditionMeter {
    label: InputLabel;
    /**
     * The current value of this meter.
     * @default 0
     */
    value?: number;
    /**
     * The minimum value of this meter.
     * @default 0
     */
    min?: number;
    /**
     * The maximum value of this meter.
     */
    max: number;
    /**
     * Is this meter's `value` usable as a stat in an action roll?
     */
    rollable?: true;
    field_type: 'condition_meter';
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
        suffer?: MoveIdWildcard[];
        /**
         * The ID(s) of recovery moves associated with this meter.
         */
        recover?: MoveIdWildcard[];
    };
    /**
     * Checkbox controls rendered as part of the condition meter.
     * @remarks Deserialize as a dictionary object.
     */
    controls?: Record<DictKey, AssetConditionMeterControlField>;
}
/**
 * A checkbox control field, rendered as part of an asset condition meter.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetConditionMeterControlField = AssetCheckboxField | AssetCardFlipField;
/**
 * Some assets provide a special condition meter of their own. The most common example is the health meters on companion assets. Asset condition meters may also include their own controls, such as the checkboxes that Starforged companion assets use to indicate they are "out of action".
 */
export interface AssetConditionMeterEnhancement {
    field_type: 'condition_meter';
    /**
     * The maximum value of this meter.
     */
    max: number;
}
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetControlField = AssetConditionMeter | SelectEnhancementField | AssetCheckboxField | AssetCardFlipField;
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetControlFieldEnhancement = AssetConditionMeterEnhancement;
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
 * Options are asset input fields which are set once, usually when the character takes the asset. The most common example is the "name" field on companion assets. A more complex example is the choice of a god's stat for the Devotant asset.
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `field_type` property as a discriminator.
 */
export type AssetOptionField = SelectValueField | SelectEnhancementField | TextField;
/**
 * A clock with 4 or more segments.
 * @remarks Semantics are similar to HTML `<input type="number">`, but rendered as a clock (a circle with equally sized wedges).
 */
export interface ClockField {
    label: InputLabel;
    /**
     * The current value of this input.
     * @default 0
     */
    value?: number;
    /**
     * The minimum number of filled clock segments. This is always 0.
     */
    min?: 0;
    /**
     * The size of the clock -- in other words, the maximum number of filled clock segments. Standard clocks have 4, 6, 8, or 10 segments.
     * @minimum 2
     */
    max: number;
    rollable?: false;
    field_type: 'clock';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
}
/**
 * A meter with an integer value, bounded by a minimum and maximum.
 */
export interface ConditionMeterField {
    label: InputLabel;
    /**
     * The current value of this meter.
     * @default 0
     */
    value?: number;
    /**
     * The minimum value of this meter.
     * @default 0
     */
    min?: number;
    /**
     * The maximum value of this meter.
     */
    max: number;
    /**
     * Is this meter's `value` usable as a stat in an action roll?
     */
    rollable?: true;
    field_type: 'condition_meter';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
}
/**
 * A basic counter representing a non-rollable integer value. They usually start at 0, and may or may not have a maximum.
 * @remarks Semantics are similar to `<input type="number" step="1">`
 */
export interface CounterField {
    label: InputLabel;
    /**
     * The current value of this input.
     * @default 0
     */
    value?: number;
    /**
     * The (inclusive) minimum value.
     * @default 0
     */
    min?: number;
    /**
     * The (inclusive) maximum value, or `null` if there's no maximum.
     * @default null
     */
    max?: number | null;
    rollable?: false;
    field_type: 'counter';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
}
/**
 * Select from player and/or asset enhancements. Use it to describe modal abilities. For examples, see Ironclad (classic Ironsworn) and Windbinder (Sundered Isles).
 * @remarks Semantics are similar to the HTML `<select>` element
 */
export interface SelectEnhancementField {
    label: InputLabel;
    /**
     * The current value of this input.
     * @default null
     */
    value?: DictKey | null;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    choices: Record<DictKey, SelectEnhancementFieldChoice | SelectEnhancementFieldChoiceGroup>;
    field_type: 'select_enhancement';
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
    label: InputLabel;
    choice_type: 'choice';
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
    name: InputLabel;
    choice_type: 'choice_group';
    /**
     * @remarks Deserialize as a dictionary object.
     */
    choices: Record<DictKey, SelectEnhancementFieldChoice>;
}
/**
 * Represents a list of mutually exclusive choices.
 * @remarks Semantics are similar to the HTML `<select>` element
 */
export interface SelectValueField {
    label: InputLabel;
    /**
     * The current value of this input.
     * @default null
     */
    value?: DictKey | null;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    choices: Record<DictKey, SelectValueFieldChoice>;
    field_type: 'select_value';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
}
/**
 * @remarks Deserialize as a discriminated union/polymorphic object type, using the `using` property as a discriminator.
 */
export type SelectValueFieldChoice = {
    label: InputLabel;
    choice_type: 'choice';
    stat: StatKey;
    /**
     * A reference to the value of a standard player character stat.
     */
    using: 'stat';
} | {
    label: InputLabel;
    choice_type: 'choice';
    condition_meter: ConditionMeterKey;
    /**
     * A reference to the value of a standard player condition meter.
     */
    using: 'condition_meter';
} | {
    label: InputLabel;
    choice_type: 'choice';
    /**
     * Asset IDs (which may be wildcarded) that may provide the control field. For asset ability enhancements, `null` is used to represent the asset's own control fields.
     * @default null
     */
    assets?: AssetIdWildcard[] | null;
    /**
     * The dictionary key of the asset control field.
     * @example "health"
     * @example "integrity"
     */
    control: DictKey;
    /**
     * A reference to the value of an asset control.
     */
    using: 'asset_control';
} | {
    label: InputLabel;
    choice_type: 'choice';
    /**
     * Asset IDs (which may be wildcarded) that may provide the option field. For asset ability enhancements, `null` is used to represent the asset's own option fields.
     * @default null
     */
    assets?: AssetIdWildcard[] | null;
    /**
     * The dictionary key of the asset option field.
     */
    option: DictKey;
    /**
     * A reference to the value of an asset option.
     */
    using: 'asset_option';
} | {
    label: InputLabel;
    choice_type: 'choice';
    /**
     * The dictionary key of the asset control field.
     * @example "health"
     * @example "integrity"
     */
    control: DictKey;
    /**
     * A reference to the value of an attached asset control. For example, a Module asset could use this to roll using the `integrity` control of an attached Vehicle.
     */
    using: 'attached_asset_control';
} | {
    label: InputLabel;
    choice_type: 'choice';
    /**
     * The dictionary key of the asset option field.
     */
    option: DictKey;
    /**
     * A reference to the value of an attached asset option.
     */
    using: 'attached_asset_option';
} | {
    label: InputLabel;
    choice_type: 'choice';
    value: number;
    /**
     * An arbitrary static integer value with a label.
     */
    using: 'custom';
};
/**
 * Represents an input that accepts plain text.
 * @remarks Semantics are similar to the HTML `<input type="text">` element.
 */
export interface TextField {
    label: InputLabel;
    /**
     * The content of this text input, or `null` if it's empty
     * @default null
     */
    value?: string | null;
    field_type: 'text';
    /**
     * An icon associated with this input.
     */
    icon?: SvgImageUrl;
}
/**
 * A setting truth category.
 */
export interface Truth {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: TruthId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * @default "1d100"
     */
    dice?: DiceExpression;
    icon?: SvgImageUrl;
    summary?: MarkdownString;
    options: TruthOption[];
    your_character?: MarkdownString;
}
export interface TruthOption {
    min?: number;
    max?: number;
    summary?: MarkdownString;
    description: MarkdownString;
    quest_starter: MarkdownString;
    /**
     * Represents a basic rollable oracle table with one roll column and one text result column.
     */
    table?: {
        oracle_type: 'table_text';
        /**
         * The roll used to select a result on this oracle.
         * @default "1d100"
         */
        dice: DiceExpression;
        /**
         * An array of objects, each representing a single row of the table.
         */
        rows: OracleTableRowText[];
    };
}
export interface AtlasCollection {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: AtlasCollectionId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * A thematic color associated with this collection.
     */
    color?: CssColor;
    /**
     * A brief summary of this collection, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.
     */
    summary?: MarkdownString;
    /**
     * A longer description of this collection, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead.
     */
    description?: MarkdownString;
    images?: WebpImageUrl[];
    /**
     * An SVG icon associated with this collection.
     */
    icon?: SvgImageUrl;
    type: 'atlas';
    /**
     * This collection's content enhances the identified collection, rather than being a standalone collection of its own.
     */
    enhances?: AtlasCollectionId;
    /**
     * This collection replaces the identified collection. References to the replaced collection can be considered equivalent to this collection.
     */
    replaces?: AtlasCollectionId;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    contents?: Record<DictKey, AtlasEntry>;
    /**
     * @remarks Deserialize as a dictionary object.
     */
    collections?: Record<DictKey, AtlasCollection>;
}
/**
 * An atlas entry, like the Ironlands region entries found in classic Ironsworn.
 */
export interface AtlasEntry {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: AtlasEntryId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    features: MarkdownString[];
    summary?: MarkdownString;
    description: MarkdownString;
    quest_starter?: MarkdownString;
    your_truth?: MarkdownString;
    type: 'atlas_entry';
}
/**
 * A basic, rollable player character resource specified by the ruleset.
 * @example "health"
 * @example "spirit"
 * @example "supply"
 */
export type ConditionMeterKey = DictKey;
/**
 * A basic player character stat.
 * @example "edge"
 * @example "heart"
 * @example "iron"
 * @example "shadow"
 * @example "wits"
 */
export type StatKey = DictKey;
/**
 * A rarity, as described in Ironsworn: Delve.
 */
export interface Rarity {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: RarityId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    /**
     * The asset augmented by this rarity.
     */
    asset: AssetId;
    type: 'rarity';
    icon?: SvgImageUrl;
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
    xp_cost?: number;
    description: MarkdownString;
}
/**
 * A delve site with a theme, domain, and denizens.
 */
export interface DelveSite {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: DelveSiteId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    type: 'delve_site';
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
            min: 1;
            max: 27;
            frequency: 'very_common';
        },
        {
            min: 28;
            max: 41;
            frequency: 'common';
        },
        {
            min: 42;
            max: 55;
            frequency: 'common';
        },
        {
            min: 56;
            max: 69;
            frequency: 'common';
        },
        {
            min: 70;
            max: 75;
            frequency: 'uncommon';
        },
        {
            min: 76;
            max: 81;
            frequency: 'uncommon';
        },
        {
            min: 82;
            max: 87;
            frequency: 'uncommon';
        },
        {
            min: 88;
            max: 93;
            frequency: 'uncommon';
        },
        {
            min: 94;
            max: 95;
            frequency: 'rare';
        },
        {
            min: 96;
            max: 97;
            frequency: 'rare';
        },
        {
            min: 98;
            max: 99;
            frequency: 'rare';
        },
        {
            min: 100;
            max: 100;
            frequency: 'unforeseen';
        }
    ];
}
/**
 * Represents an entry in a site denizen matrix. Denizen matrices are described in Ironsworn: Delve.
 */
export interface DelveSiteDenizen {
    /**
     * A name for the denizen, if it's different than the `name` property of the NPC.
     */
    name?: Label;
    /**
     * Low end of the dice range for this denizen.
     */
    min: number;
    /**
     * High end of the dice range for this denizen.
     */
    max: number;
    /**
     * The ID of the relevant NPC entry, if one is specified.
     */
    npc?: NpcId;
    frequency: DelveSiteDenizenFrequency;
}
export type DelveSiteDenizenFrequency = 'very_common' | 'common' | 'uncommon' | 'rare' | 'unforeseen';
/**
 * A delve site Domain card.
 */
export interface DelveSiteDomain {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: DelveSiteDomainId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    type: 'delve_site_domain';
    /**
     * @deprecated
     */
    summary: MarkdownString;
    description?: MarkdownString;
    icon?: SvgImageUrl;
    /**
     * An oracle table ID containing place name elements. For examples, see oracle ID `delve/oracles/site_name/place/barrow`, and its siblings in oracle collection ID `delve/collections/oracles/site_name/place`. These oracles are used by the site name oracle from Ironsworn: Delve (ID: delve/oracles/site_name/format) to create random names for delve sites.
     */
    name_oracle?: OracleRollableId;
    features: OracleTableRowText[] & [
        {
            min: 21;
            max: 43;
        },
        {
            min: 44;
            max: 56;
        },
        {
            min: 57;
            max: 64;
        },
        {
            min: 65;
            max: 68;
        },
        {
            min: 69;
            max: 72;
        },
        {
            min: 73;
            max: 76;
        },
        {
            min: 77;
            max: 80;
        },
        {
            min: 81;
            max: 84;
        },
        {
            min: 85;
            max: 88;
        },
        {
            min: 89;
            max: 98;
        },
        {
            min: 99;
            max: 99;
        },
        {
            min: 100;
            max: 100;
        }
    ];
    dangers: OracleTableRowText[] & [
        {
            min: 31;
            max: 33;
        },
        {
            min: 34;
            max: 36;
        },
        {
            min: 37;
            max: 39;
        },
        {
            min: 40;
            max: 42;
        },
        {
            min: 43;
            max: 45;
        }
    ];
}
/**
 * A delve site theme card.
 */
export interface DelveSiteTheme {
    /**
     * The unique Datasworn ID for this item.
     */
    _id?: DelveSiteThemeId;
    /**
     * Any implementation hints or other developer-facing comments on this object. These should be omitted when presenting the object for gameplay.
     */
    _comment?: string;
    /**
     * The primary name/label for this item.
     */
    name: Label;
    /**
     * The name of this item as it appears on the page in the book, if it's different from `name`.
     */
    canonical_name?: Label;
    /**
     * Attribution for the original source (such as a book or website) of this item, including the author and licensing information.
     */
    _source: SourceInfo;
    suggestions?: Suggestions;
    /**
     * @experimental
     */
    tags?: Record<DictKey, Record<DictKey, Tag>>;
    type: 'delve_site_theme';
    summary: MarkdownString;
    description?: MarkdownString;
    icon?: SvgImageUrl;
    features: OracleTableRowText[] & [
        {
            min: 1;
            max: 4;
        },
        {
            min: 5;
            max: 8;
        },
        {
            min: 9;
            max: 12;
        },
        {
            min: 13;
            max: 16;
        },
        {
            min: 17;
            max: 20;
        }
    ];
    dangers: OracleTableRowText[] & [
        {
            min: 1;
            max: 5;
        },
        {
            min: 6;
            max: 10;
        },
        {
            min: 11;
            max: 12;
        },
        {
            min: 13;
            max: 14;
        },
        {
            min: 15;
            max: 16;
        },
        {
            min: 17;
            max: 18;
        },
        {
            min: 19;
            max: 20;
        },
        {
            min: 21;
            max: 22;
        },
        {
            min: 23;
            max: 24;
        },
        {
            min: 25;
            max: 26;
        },
        {
            min: 27;
            max: 28;
        },
        {
            min: 29;
            max: 30;
        }
    ];
}
