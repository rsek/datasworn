import type TypeId from '../IdElements/TypeId.js';
import type TypeNode from '../TypeNode.js';
import { type Datasworn, type DataswornSource } from '../index.js';
export type SchemaValidator<TTarget> = (data: unknown) => data is TTarget;
export type Logger = Record<'warn' | 'info' | 'debug' | 'error', (message?: any, ...optionalParams: any[]) => any>;
/**
 * Merges, assigns IDs to, and validates multiple {@link DataswornSource.RulesPackage}s to create a complete {@link Datasworn.RulesPackage} object.
 * */
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
    countType(typeId: TypeId.Any): number;
    mergeFiles(force?: boolean): this;
    toJSON(): TTarget;
    validate(force?: boolean): this;
    build(force?: boolean): this;
    /** Top-level RulesPackage properties to omit from key sorting. */
    static readonly topLevelKeysBlackList: ["rules"];
    /** Separator character used for JSON pointers. */
    static readonly pointerSep: "/";
    /** Hash character that prepends generated JSON pointers. */
    static readonly hashChar: "#";
    /**
     *
     * @param id The `_id` of the RulesPackage to be constructed.
     * @param validator A function that validates the completed RulesPackage against the Datasworn JSON schema.
     * @param sourceValidator A function that validates the individual package file contents against the DataswornSource JSON schema.
     * @param logger The destination for logging build messages.
     */
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
    index: Map<string, TypeNode.Primary<TypeId.Primary>>;
    get data(): TSource;
    set data(value: TSource);
    get isValidated(): boolean;
    validate(): boolean;
    constructor({ data, name }: RulesPackagePartData<TSource>, validator: SchemaValidator<TSource>, logger: Logger);
    init(): void;
}
export {};
