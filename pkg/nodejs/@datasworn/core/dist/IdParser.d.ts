import type * as Datasworn from './Datasworn.js';
import { CONST, TypeElements } from './IdElements/index.js';
import ObjectGlobber from './ObjectGlobPath/ObjectGlobber.js';
import type * as Strings from './Id/Strings.js';
import { type CollectableType, type CollectionSubtype, type TypeForTypeComposite } from './Id/TypeMaps.js';
import type * as Utils from './Id/Utils.js';
export type DataswornTree = Record<string, Datasworn.RulesPackage> | Map<string, Datasworn.RulesPackage>;
/**
 * Creates, parses, and locates Datasworn IDs in the Datasworn tree. Id utilities are collected here as static methods.
 * @see
 * @remarks Set the {@linkcode #datasworn} static property to provide a default value for {@link get} and {@link getMatches}
 * @example
 * // create a collectable ID valid as a child of a given collection ID
 * IdParser.from('my_oracles/collections/oracles/core').createChildCollectableId('theme') // returns parser subclass instance for an OracleRollable ID: 'my_oracles/oracles/core/theme'
 */
declare abstract class IdParser<RulesPackage extends string = string, TypeKeys extends IdParser.UnknownTypeKeys = IdParser.UnknownTypeKeys, PathKeys extends IdParser.UnknownPathKeys = IdParser.UnknownPathKeys, IdentifiedObject extends object = object> implements IdParser.Options<RulesPackage, TypeKeys, PathKeys>, IdParser.Any {
    #private;
    /**
     * @param options Options for construction of an ID.
     */
    constructor(options: IdParser.Options<RulesPackage, TypeKeys, PathKeys>);
    /** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
    static get datasworn(): DataswornTree;
    static set datasworn(value: DataswornTree);
    get id(): string;
    get pathKeys(): PathKeys;
    toString(): this['id'];
    /** The parsed elements of the ID as an array of strings. */
    get elements(): string[];
    /** The regular expression that matches for a wildcard ID. */
    get matcher(): RegExp;
    static readonly NamespacePattern: RegExp;
    static readonly DictKeyPattern: RegExp;
    static readonly RecursiveDictKeyPattern: RegExp;
    get rulesPackage(): RulesPackage;
    set rulesPackage(value: RulesPackage);
    get typeKeys(): TypeKeys;
    /** The subtype element for this ID, or `null` if it has no subtype. */
    get subtype(): string | null;
    /** The primary type element for this ID. */
    get type(): string;
    /** Key elements that represent ancestor collection keys. */
    get ancestorCollectionKeys(): string[] | [];
    /** The last `pathKey` element, which represents the key for the identified object. */
    get key(): string;
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard(): boolean;
    /** Does this ID contain recursive elements? */
    get isRecursive(): boolean;
    /** Does this ID refer to a collectable object? */
    get isCollectable(): boolean;
    /** Does this ID refer to a collection? */
    get isCollection(): boolean;
    /** The key of the root object for this type within a RulesPackage. */
    get typeRootKey(): keyof Datasworn.RulesPackage;
    toPath(): ObjectGlobber;
    /**
     * Retrieves the object referenced by this ID.
     * @throws If the ID is a wildcard ID (use {@link getMatches} instead), or if the referenced object doesn't exist.
     */
    get(tree?: DataswornTree): IdentifiedObject;
    /**
     * Retrieves all objects matched by this wildcard ID.
     */
    getMatches(tree?: DataswornTree): IdentifiedObject[];
    /**
     * Create an Id parser instance of the appropriate subclass from a RecursiveCollectionId.
     * @throws If `id` is invalid.
     */
    static from<T extends Strings.RecursiveCollectionId>(id: T): RecursiveCollectionId.FromString<T>;
    /**
     * Create an Id parser subclass instance from a NonRecursiveCollectionId.
     * @throws If `id` is invalid.
     */
    static from<T extends Strings.NonRecursiveCollectionId>(id: T): NonRecursiveCollectionId.FromString<T>;
    /**
     * Create an Id parser subclass instance from a NonCollectableId.
     * @throws If `id` is invalid.
     */
    static from<T extends Strings.NonCollectableId>(id: T): NonCollectableId.FromString<T>;
    /**
     * Create an Id parser subclass instance from a RecursiveCollectableId.
     * @throws If `id` is invalid.
     */
    static from<T extends Strings.RecursiveCollectableId>(id: T): RecursiveCollectableId.FromString<T>;
    /**
     * Create an Id parser subclass instance from a NonRecursiveCollectableId.
     * @throws If `id` is invalid.
     */
    static from<T extends Strings.NonRecursiveCollectableId>(id: T): NonRecursiveCollectableId.FromString<T>;
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
     */
    static get<T extends Strings.AnyId>(id: T, tree?: (typeof IdParser)['datasworn']): Utils.TypeForId<T>;
    static get<T extends IdParser<any, any, any, any>>(id: T, tree?: (typeof IdParser)['datasworn']): ReturnType<T['get']>;
    /**
     * Get all nodes that match a wildcard ID.
     * @throws If the wildcard ID is invalid; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
     */
    static getMatches<T extends Strings.AnyId>(id: T, tree?: (typeof IdParser)['datasworn']): Utils.TypeForId<T>[];
    static getMatches<T extends IdParser<any, any, any, any>>(id: T, tree?: (typeof IdParser)['datasworn']): ReturnType<T['get']>[];
    static toString<T extends IdParser.AnyParsedId>({ rulesPackage, typeKeys, pathKeys }: T): T extends IdParser.Parsed<infer U extends Strings.AnyId> ? U : Utils.Join<[T["rulesPackage"], ...T["typeKeys"], ...T["pathKeys"]], "/">;
    /**
     * Parses a Datasworn string ID into substrings and returns an object identifying each substring.
     * @param id The Datasworn ID to parse.
     * @throws If `id` is an invalid Datasworn ID.
     */
    static parse<T extends Strings.NonRecursiveCollectionId>(id: T): IdParser.Parsed<T>;
    static parse<T extends Strings.NonRecursiveCollectableId>(id: T): IdParser.Parsed<T>;
    static parse<T extends Strings.RecursiveCollectionId>(id: T): IdParser.Parsed<T>;
    static parse<T extends Strings.RecursiveCollectableId>(id: T): IdParser.Parsed<T>;
    static parse<T extends Strings.NonCollectableId>(id: T): IdParser.Parsed<T>;
    static parse<T extends Strings.AnyId>(id: T): IdParser.Parsed<T>;
    static fromOptions<T extends IdParser.AnyParsedId>(options: T): IdParser<T['rulesPackage'], T['typeKeys'], T['pathKeys']>;
    static fromOptions<RulesPackage extends string, TypeKeys extends IdParser.UnknownTypeKeys, PathKeys extends IdParser.UnknownPathKeys>({ rulesPackage, typeKeys, pathKeys }: {
        rulesPackage: RulesPackage;
        typeKeys: TypeKeys;
        pathKeys: PathKeys;
    }): IdParser<RulesPackage, TypeKeys, PathKeys>;
    /** Converts an ID to an array of strings representing the property keys that must be traversed to reach the identified object. */
    static toPath<T extends Strings.AnyId>(id: T): ObjectGlobber;
    static toPath<T extends IdParser.AnyParsedId>(options: T): ObjectGlobber;
    static toPath<T extends IdParser>(id: T): ObjectGlobber;
}
declare namespace IdParser {
    /** A generic, un-narrowed ID object with lenient typings. */
    interface Any extends IdParser.Options {
        readonly id: string;
        toString(): string;
        readonly elements: string[];
        readonly subtype: string | null;
        readonly type: string;
        readonly ancestorCollectionKeys: string[];
        readonly key: string;
        readonly isWildcard: boolean;
        readonly isRecursive: boolean;
        readonly isCollectable: boolean;
        readonly isCollection: boolean;
        readonly typeRootKey: keyof Datasworn.RulesPackage;
        toPath(): ObjectGlobber;
        get(tree?: DataswornTree | null): object;
        getMatches(tree?: DataswornTree | null): object[];
    }
    type Parsed<T extends Strings.AnyId = Strings.AnyId> = Options<Utils.ExtractRulesPackage<T>, Utils.ExtractTypeKeys<T>, Utils.ExtractPathKeys<T>>;
    type UnknownTypeKeys = [string] | [string, string];
    type UnknownPathKeys = Strings.DictKey[];
    type Options<RulesPackage extends string = string, TypeKeys extends UnknownTypeKeys = UnknownTypeKeys, PathKeys extends UnknownPathKeys = UnknownPathKeys> = {
        /**
         * The first element of the ID, representing the RulesPackage that the object is from.
         * @example "classic"
         * @example "delve"
         * @example "starforged"
         */
        rulesPackage: RulesPackage;
        /**
         * 1-2 elements following the RulesPackage element, which indicate the object's type (and possibly subtype)
         * @example ['oracles']
         * @example ['collections', 'oracles']
         */
        typeKeys: TypeKeys;
        pathKeys: PathKeys;
    };
    type ToStringArray<RulesPackage extends string, TypeKeys extends Utils.AnyTypeKeys, PathKeys extends Utils.AnyPathKeys> = [RulesPackage, ...TypeKeys, ...PathKeys];
    type ToString<RulesPackage extends string, TypeKeys extends Utils.AnyTypeKeys, PathKeys extends Utils.AnyPathKeys> = Utils.Join<ToStringArray<RulesPackage, TypeKeys, PathKeys>, CONST.Sep>;
    type AnyParsedId = IdParser.Parsed<Strings.AnyCollectableId> | IdParser.Parsed<Strings.AnyCollectionId> | IdParser.Parsed<Strings.NonCollectableId>;
}
declare abstract class CollectionId<RulesPackage extends string = string, Subtype extends TypeElements.Collectable.Any = TypeElements.Collectable.Any, AncestorKeys extends Strings.DictKey[] | [] = Strings.DictKey[], Key extends Strings.DictKey = Strings.DictKey> extends IdParser<RulesPackage, [
    TypeElements.Collection,
    Subtype
], [
    ...AncestorKeys,
    Key
], CollectionSubtype<Subtype>> implements CollectionId.Any {
    constructor(rulesPackage: RulesPackage, subtype: Subtype, ...pathKeys: [...AncestorKeys, Key]);
    abstract createChildCollectableId<ChildKey extends string>(key: ChildKey): CollectableId<RulesPackage, Subtype>;
}
declare namespace CollectionId {
    type Options<T extends Strings.AnyCollectionId = Strings.AnyCollectionId> = Omit<IdParser.Parsed<T>, 'type'>;
    type CollectionKeys = [] | [string] | [string, string];
}
interface CollectionId<RulesPackage extends string = string, Subtype extends TypeElements.Collectable.Any = TypeElements.Collectable.Any, AncestorKeys extends Strings.DictKey[] | [] = Strings.DictKey[], Key extends Strings.DictKey = Strings.DictKey> extends IdParser<RulesPackage, [
    TypeElements.Collection,
    Subtype
], [
    ...AncestorKeys,
    Key
], CollectionSubtype<Subtype>> {
    get id(): Strings.CollectionId<RulesPackage, Subtype, AncestorKeys, Key>;
    get elements(): [
        RulesPackage,
        TypeElements.Collection,
        Subtype,
        ...AncestorKeys,
        Key
    ];
    get isCollectable(): false;
    get isCollection(): true;
    get typeRootKey(): Subtype;
    get type(): TypeElements.Collection;
    get subtype(): Subtype;
    get ancestorCollectionKeys(): AncestorKeys;
    get pathKeys(): [...AncestorKeys, Key];
    get key(): Key;
}
declare namespace CollectionId {
    /** A lenient typing for a parsed ID representing any collection object. */
    interface Any extends IdParser.Any {
        readonly id: `${string}${CONST.Sep}${TypeElements.Collection}${CONST.Sep}${TypeElements.Collectable.Any}${CONST.Sep}${string}`;
        readonly ancestorCollectionKeys: string[];
        readonly typeRootKey: TypeElements.Collectable.Any;
        readonly elements: [
            string,
            TypeElements.Collection,
            TypeElements.Collectable.Any,
            ...string[]
        ];
        readonly type: TypeElements.Collection;
        readonly subtype: TypeElements.Collectable.Any;
        readonly typeKeys: [TypeElements.Collection, TypeElements.Collectable.Any];
        readonly isCollectable: false;
        readonly isCollection: true;
        get(tree?: DataswornTree | null): CollectionSubtype;
        getMatches(tree?: DataswornTree | null): CollectionSubtype[];
    }
}
declare abstract class CollectableId<RulesPackage extends string = string, Type extends TypeElements.Collectable.Any = TypeElements.Collectable.Any, AncestorKeys extends Strings.DictKey[] = Strings.DictKey[], Key extends Strings.DictKey = Strings.DictKey> extends IdParser<RulesPackage, [
    Type
], [
    ...AncestorKeys,
    Key
], CollectableType<Type>> implements CollectableId.Any {
    constructor(rulesPackage: RulesPackage, type: Type, ...pathKeys: [...AncestorKeys, Key]);
    /** Returns a new {@link IdParser} instance for the ID of this object's parent collection, if one exists. */
    abstract getParentCollectionId(): unknown;
}
interface CollectableId<RulesPackage extends string = string, Type extends TypeElements.Collectable.Any = TypeElements.Collectable.Any, AncestorKeys extends Strings.DictKey[] = Strings.DictKey[], Key extends Strings.DictKey = Strings.DictKey> extends IdParser<RulesPackage, [
    Type
], [
    ...AncestorKeys,
    Key
], CollectableType<Type>> {
    get elements(): [RulesPackage, Type, ...AncestorKeys, Key];
    get isCollectable(): true;
    get isCollection(): false;
    get typeRootKey(): Type;
    get type(): Type;
    get subtype(): null;
    get ancestorCollectionKeys(): AncestorKeys;
    get key(): Key;
}
declare namespace CollectableId {
    /** A lenient typing for a parsed ID representing any collectable object. */
    interface Any extends IdParser.Any {
        readonly typeKeys: [TypeElements.Collectable.Any];
        readonly ancestorCollectionKeys: string[];
        readonly type: TypeElements.Collectable.Any;
        readonly typeRootKey: TypeElements.Collectable.Any;
        readonly elements: [string, TypeElements.Collectable.Any, ...string[]];
        readonly subtype: null;
        readonly isCollectable: true;
        readonly isCollection: false;
        get(tree?: DataswornTree | null): CollectableType;
        getMatches(tree?: DataswornTree | null): CollectableType[];
    }
}
/**
 * Represents an ID for a non-collectable Datasworn object (a {@link Truth}, {@link DelveSite}, {@link DelveSiteTheme}, {@link DelveSiteDomain}, or {@link Rarity}).
 */
declare class NonCollectableId<RulesPackage extends string = string, Type extends TypeElements.NonCollectable = TypeElements.NonCollectable, Key extends string = string> extends IdParser<RulesPackage, [Type], [Key], TypeForTypeComposite<Type>> implements IdParser.Any {
    constructor(rulesPackage: RulesPackage, type: Type, key: Key);
}
declare namespace NonCollectableId {
    type FromString<T extends Strings.NonCollectableId> = T extends `${infer RulesPackage}${CONST.Sep}${infer Type extends TypeElements.NonCollectable}${CONST.Sep}${infer Key}` ? NonCollectableId<RulesPackage, Type, Key> & {
        id: T;
    } : never;
}
interface NonCollectableId<RulesPackage extends string = string, Type extends TypeElements.NonCollectable = TypeElements.NonCollectable, Key extends string = string> extends IdParser<RulesPackage, [Type], [Key], TypeForTypeComposite<Type>> {
    get elements(): [RulesPackage, Type, Key];
    get id(): Strings.NonCollectableId<RulesPackage, Type, Key>;
    get isCollectable(): false;
    get isCollection(): false;
    get isRecursive(): false;
    get typeRootKey(): Type;
    get type(): Type;
    get subtype(): null;
    get ancestorCollectionKeys(): [];
    get key(): Key;
}
/**
 * Represents an ID for a {@link Move} or {@link Asset}
 */
declare class NonRecursiveCollectableId<RulesPackage extends string, Type extends TypeElements.Collectable.NonRecursive, ParentKey extends string, Key extends string> extends CollectableId<RulesPackage, Type, [ParentKey], Key> {
    getParentCollectionId(): NonRecursiveCollectionId<RulesPackage, Type, ParentKey>;
}
interface NonRecursiveCollectableId<RulesPackage extends string, Type extends TypeElements.Collectable.NonRecursive, ParentKey extends string, Key extends string> extends CollectableId<RulesPackage, Type, [ParentKey], Key> {
    get isRecursive(): false;
    get elements(): [RulesPackage, Type, ParentKey, Key];
    get id(): Strings.NonRecursiveCollectableId<RulesPackage, Type, ParentKey, Key>;
}
declare namespace NonRecursiveCollectableId {
    type FromString<T extends Strings.NonRecursiveCollectableId> = T extends `${infer RulesPackage}${CONST.Sep}${infer Type extends TypeElements.Collectable.NonRecursive}${CONST.Sep}${infer ParentKey}${CONST.Sep}${infer Key}` ? NonRecursiveCollectableId<RulesPackage, Type, ParentKey, Key> & {
        id: T;
    } : never;
}
/** Represents an ID for a {@link MoveCategory} or {@link AssetCollection} */
declare class NonRecursiveCollectionId<RulesPackage extends string, Subtype extends TypeElements.Collectable.NonRecursive, Key extends string> extends CollectionId<RulesPackage, Subtype, [], Key> {
    createChildCollectableId<ChildKey extends string>(key: ChildKey): NonRecursiveCollectableId<RulesPackage, Subtype, Key, ChildKey>;
}
interface NonRecursiveCollectionId<RulesPackage extends string, Subtype extends TypeElements.Collectable.NonRecursive, Key extends string> extends CollectionId<RulesPackage, Subtype, [], Key> {
    get isRecursive(): false;
    get elements(): [RulesPackage, TypeElements.Collection, Subtype, Key];
    get id(): Strings.NonRecursiveCollectionId<RulesPackage, Subtype, Key>;
}
declare namespace NonRecursiveCollectionId {
    type FromString<T extends Strings.NonRecursiveCollectionId> = T extends `${infer RulesPackage}${CONST.Sep}${TypeElements.Collection}${CONST.Sep}${infer Subtype extends TypeElements.Collectable.NonRecursive}${CONST.Sep}${infer Key}` ? NonRecursiveCollectionId<RulesPackage, Subtype, Key> & {
        id: T;
    } : never;
}
declare class RecursiveCollectableId<RulesPackage extends string = string, Type extends TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive, AncestorKeys extends Strings.CollectionPathKeys = Strings.CollectionPathKeys, Key extends string = string> extends CollectableId<RulesPackage, Type, AncestorKeys, Key> {
    getParentCollectionId(): RecursiveCollectionId<RulesPackage, Type, Strings.CollectionAncestorKeys, string>;
}
interface RecursiveCollectableId<RulesPackage extends string = string, Type extends TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive, AncestorKeys extends Strings.CollectionPathKeys = Strings.CollectionPathKeys, Key extends string = string> extends CollectableId<RulesPackage, Type, AncestorKeys, Key> {
    get elements(): [RulesPackage, Type, ...AncestorKeys, Key];
    get id(): Strings.RecursiveCollectableId<RulesPackage, Type, AncestorKeys, Key>;
    get isRecursive(): true;
    get ancestorCollectionKeys(): AncestorKeys;
}
declare namespace RecursiveCollectableId {
    type FromString<T extends Strings.RecursiveCollectableId> = T extends `${infer RulesPackage}${CONST.Sep}${infer Type extends TypeElements.Collectable.Recursive}${CONST.Sep}${string}` ? RecursiveCollectableId<RulesPackage, Type, Utils.ExtractAncestorPathElements<T>, Utils.ExtractKey<T>> & {
        id: T;
    } : never;
}
/**
 * Represents an ID for a {@link OracleCollection}, {@link NpcCollection}, or {@link AtlasCollection}
 */
declare class RecursiveCollectionId<RulesPackage extends string = string, Subtype extends TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive, AncestorKeys extends Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys, Key extends string = string> extends CollectionId<RulesPackage, Subtype, AncestorKeys, Key> {
    createChildCollectableId<ChildKey extends string>(childKey: ChildKey): RecursiveCollectableId<RulesPackage, Subtype, [...AncestorKeys, Key], ChildKey>;
    /**
     * Create an ID to represent a child collection of this recursive collection ID.
     * @param childKey The key to use for the child collection.
     * @returns A new IdParser instance for the child collection ID.
     * @throws If this collection has already reached its maximum recursion depth (3).
     * @example
     * ```typescript
     * const collectionId = new IdParser('starforged/collections/oracles/planets')
     * const childCollectionId = collectionId.createChildCollectionId('furnace')
     * console.log(childCollectionId.id) // "starforged/collections/oracles/planets/furnace"
     * ```
     */
    createChildCollectionId<ChildKey extends string>(childKey: ChildKey): this['canHaveCollectionChild'] extends true ? RecursiveCollectionId<RulesPackage, Subtype, AncestorKeys extends [string] | [] ? [...AncestorKeys, Key] : never, ChildKey> : never;
    /**
     * Returns a new {@link RecursiveCollectionId} instance for the ID of this object's parent RecursiveCollection, if one exists.
     */
    getParentCollectionId(): AncestorKeys extends [] ? never : RecursiveCollectionId<RulesPackage, Subtype, Utils.DropLast<AncestorKeys>, Utils.Last<AncestorKeys>>;
    get canHaveCollectionChild(): AncestorKeys extends string[] & {
        length: 1 | 2;
    } ? true : false;
}
interface RecursiveCollectionId<RulesPackage extends string = string, Subtype extends TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive, AncestorKeys extends Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys, Key extends string = string> extends CollectionId<RulesPackage, Subtype, AncestorKeys, Key> {
    get id(): Strings.RecursiveCollectionId<RulesPackage, Subtype, AncestorKeys, Key>;
    get isRecursive(): true;
}
declare namespace RecursiveCollectionId {
    type FromString<T extends Strings.RecursiveCollectionId> = T extends `${infer RulesPackage}${CONST.Sep}${TypeElements.Collection}${CONST.Sep}${infer Subtype extends TypeElements.Collectable.Recursive}${CONST.Sep}${string}` ? RecursiveCollectionId<RulesPackage, Subtype, Utils.ExtractAncestorCollectionPathElements<T>, Utils.ExtractKey<T>> & {
        id: T;
    } : never;
    interface Options<T extends Strings.RecursiveCollectionId> extends CollectionId.Options<T> {
    }
}
export { IdParser, NonCollectableId, NonRecursiveCollectableId, NonRecursiveCollectionId, RecursiveCollectableId, RecursiveCollectionId };
