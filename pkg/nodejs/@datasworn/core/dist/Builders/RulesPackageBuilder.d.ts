import type TypeNode from '../TypeNode.js';
import { type Datasworn, type DataswornSource } from '../index.js';
export type SchemaValidator<TTarget> = (data: unknown) => data is TTarget;
export type Logger = Record<'warn' | 'info' | 'debug' | 'error', (message?: any, ...optionalParams: any[]) => any>;
/** Merges and validates JSON data from multiple DataswornSource files. */
export declare class RulesPackageBuilder<TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage, TTarget extends Datasworn.RulesPackage = Datasworn.RulesPackage> {
    #private;
    id: string;
    static readonly postSchemaValidators: {
        readonly oracle_rollable: typeof import("../Validators/OracleRollable.js").validate;
        readonly oracle_collection: typeof import("../Validators/OracleCollection.js").validate;
    };
    readonly schemaValidator: SchemaValidator<TTarget>;
    readonly sourceSchemaValidator: SchemaValidator<TSource>;
    readonly logger: Logger;
    readonly files: Map<string, RulesPackagePart<TSource>>;
    readonly index: Map<string, unknown>;
    get mergedSource(): TTarget;
    mergeFiles(force?: boolean): this;
    toJSON(): TTarget;
    validate(force?: boolean): this;
    validateIdPointers(index: Map<string, unknown> | Set<string>): boolean;
    build(force?: boolean): this;
    static sortDataswornKeys<T extends object>(object: T, sortOrder?: readonly ["_id", "_key", "_index", "datasworn_version", "type", "ruleset", "title", "name", "canonical_name", "label", "type", "category", "field_type", "roll_type", "choice_type", "oracle_type", "value_type", "using", "email", "authors", "date", "license", "page", "title", "url", "rules", "condition_meters", "stats", "impacts", "special_tracks", "rollable", "prevents_recovery", "permanent", "optional", "control", "option", "condition_meter", "stat", "tracks", "conditions", "recover", "suffer", "choices", "xp_cost", "replaces", "enhances", "oracle", "asset", "region", "theme", "domain", "name_oracle", "npc", "extra_card", "min", "max", "value", "rank", "nature", "color", "icon", "images", "track", "dice", "enabled", "frequency", "options", "count_as_impact", "auto", "duplicates", "number_of_rolls", "by", "method", "roll_options", "ally", "player", "is_impact", "disables_asset", "shared", "attachments", "trigger", "roll", "result", "summary", "detail", "requirement", "features", "dangers", "drives", "tactics", "strong_hit", "weak_hit", "miss", "variants", "text", "text2", "text3", "description", "your_character", "abilities", "template", "rolls", "contents", "collections", "outcomes", "quest_starter", "your_truth", "controls", "date", "page", "authors", "license", "url", "embed_table", "match", "recommended_rolls", "column_labels", "oracles", "suggestions", "enhance_asset", "oracle_rolls", "tags", "_comment", "denizens", "enhance_moves", "rows", "table", "assets", "atlas", "moves", "npcs", "rarities", "delve_sites", "site_domains", "site_themes", "truths", "_source", "_i18n"]): T;
    /** Top-level RulesPackage properties to omit from key sorting. */
    static readonly topLevelKeysBlackList: ["rules"];
    /** Separator character used for JSON pointers. */
    static readonly pointerSep: "/";
    /** Hash character that prepends generated JSON pointers. */
    static readonly hashChar: "#";
    constructor(id: string, validator: SchemaValidator<TTarget>, sourceValidator: SchemaValidator<TSource>, logger: Logger);
    addFiles(...files: (RulesPackagePartData<TSource> | RulesPackagePart<TSource>)[]): this;
}
interface RulesPackagePartData<TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage> {
    name: string;
    data: TSource;
}
declare class RulesPackagePart<TSource extends DataswornSource.RulesPackage = DataswornSource.RulesPackage> implements RulesPackagePartData<TSource> {
    #private;
    readonly logger: Logger;
    readonly validator: SchemaValidator<TSource>;
    name: string;
    index: Map<string, TypeNode.AnyPrimary>;
    get data(): TSource;
    set data(value: TSource);
    get isValidated(): boolean;
    validate(): boolean;
    constructor({ data, name }: RulesPackagePartData<TSource>, validator: SchemaValidator<TSource>, logger: Logger);
    init(): void;
}
export {};
