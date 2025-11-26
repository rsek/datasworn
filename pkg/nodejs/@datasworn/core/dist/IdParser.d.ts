import { IdKey, PathKeySep, TypeSep, WildcardString, PrefixSep, GlobstarString } from './IdElements/CONST.js';
import TypeId from './IdElements/TypeId.js';
import type * as StringId from './StringId.js';
import type { ExtractTypeId } from './Utils/Id.js';
import type { Datasworn, DataswornSource } from './index.js';
import type { CollectableAncestorKeys, CollectionAncestorKeys } from './IdElements/PathKeys.js';
import { type PathKeys } from './IdElements/index.js';
import type { Tree } from './Tree.js';
import type TypeNode from './TypeNode.js';
import type { DropFirst, Head, LastElementOf } from './Utils/Array.js';
import type { Join, Split } from './Utils/String.js';
type DictionaryLike<T> = Record<string, T> | Map<string, T>;
type UnknownNode = {
    [IdKey]: string;
};
interface RecursiveId<TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts, PathSegments extends string[] & {
    length: TypeIds['length'];
} = string[] & {
    length: TypeIds['length'];
}, Node extends UnknownNode = UnknownNode> extends IdParser<TypeIds, PathSegments, Node> {
    /** The current collection recursion depth. */
    get recursionDepth(): this['collectionAncestorKeys']['length'];
    get collectionAncestorKeys(): string[];
    get isRecursive(): true;
    getCollectionIdParent(): CollectionId;
}
/** Performs parsing, validation, and construction of Datasworn IDs, and traverses the Datasworn hierarchy to retrieve matching node(s).  */
declare abstract class IdParser<TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts, PathSegments extends string[] & {
    length: TypeIds['length'];
} = string[] & {
    length: TypeIds['length'];
}, Node extends UnknownNode = UnknownNode> implements IdParser.Options<TypeIds, PathSegments> {
    #private;
    /**  */
    static get tree(): DictionaryLike<Datasworn.RulesPackage> | null;
    static set tree(value: Map<string, Datasworn.RulesPackage> | Record<string, Datasworn.RulesPackage> | null);
    /**
     * The object used for log messages.
     * @default console
     */
    static logger: Console;
    get typeIds(): TypeIds;
    protected set typeIds(value: TypeIds);
    get pathSegments(): PathSegments;
    protected set pathSegments(value: PathSegments);
    /**
     * This node's ancestor key on {@link Datasworn.RulesPackage}.
     */
    get typeBranchKey(): TypeId.BranchKey<TypeId.Primary>;
    constructor(options: IdParser.Options<TypeIds, PathSegments>);
    /**
     * Returns a string representation of the ID.
     */
    toString(): string;
    toJSON(): string;
    /** The type ID of the target node. For primary IDs, this is the same as {@link IdParser.typeId}. */
    get typeId(): string;
    /** The type ID of the most recent primary node. For primary IDs, this is the same as {@link IdParser.typeId} */
    get primaryTypeId(): TypeId.Primary;
    get primaryPath(): string;
    get primaryPathKeys(): string[];
    /** The ID of the {@link RulesPackage} that contains this ID, or a wildcard to represent any RulesPackage. */
    get rulesPackageId(): string;
    /** The dot-separated, fully-qualified type ID. For primary types, this is the same as {@link IdParser.typeId}  */
    get compositeTypeId(): string;
    /** The dot-separated, fully-qualified path. For primary type IDs, this is the same as {@link IdParser.primaryPath}  */
    get compositePath(): string;
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard(): boolean;
    /** Can this ID contain recursive elements in its path? */
    abstract get isRecursive(): boolean;
    /** Get an array of the types that are embeddable by this type. */
    getEmbeddableTypes(): TypeId.Embeddable[];
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is a wildcard ID; if no Datasworn tree is provided (either in {@link IdParser.tree} or as an argument).
     * @returns The identified node, or `undefined` if the node doesn't exist.
     */
    get(tree?: DictionaryLike<Datasworn.RulesPackage>): Node | undefined;
    /**
     * Get all Datasworn nodes that match this wildcard ID.
     * @remarks Non-wildcard IDs work here too; technically they're valid as wildcard IDs.
     * @param forEach Optional function to apply to each match. If it returns `true`, the matcher will exit early and return only the matches it has made so far.
     * @returns A {@link Map}
     */
    getMatches(tree?: DictionaryLike<Datasworn.RulesPackage>, forEach?: (id: string, node: unknown) => boolean): Map<string, Node>;
    /**
     * Can the target ID be matched with this ID?
     * @throws If `target` is a wildcard.
     */
    isMatch(target: IdParser | string): boolean;
    /** Is this non-wildcard ID matched by at least one of the provided wildcard IDs?
     * @throws If this instance is a wildcard ID; if it attempts a comparison with an invalid ID string
     */
    isMatchedBy(...wildcardIds: (IdParser | string)[]): boolean;
    /** @internal */
    _getPrefixRegExpSource(): string;
    get pathRegExp(): RegExp;
    get regExp(): RegExp;
    /** @internal */
    _flush(): void;
    /** @internal */
    _getPathRegExpSource(): string;
    /** Assign `_id` strings in a Datasworn node.
     * @param node The Datasworn
     * @param recursive Should IDs be assigned to descendant objects too? (default: true)
     * @param index A Map used to index items by their assigned ID.
     * @returns The mutated object.
     */
    assignIdsIn(node: object, recursive?: boolean, index?: Map<string, unknown>): object;
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if the ID is a wildcard ID; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.tree} or as an argument).
     */
    static get<T extends StringId.Primary>(id: T, tree?: (typeof IdParser)['datasworn']): TypeNode.ByType<ExtractTypeId<T>>;
    static get<T extends IdParser>(id: T, tree?: (typeof IdParser)['datasworn']): ReturnType<T['get']>;
    static get<T extends string>(id: T, tree?: (typeof IdParser)['datasworn']): UnknownNode;
    /**
     * Get all Datasworn nodes that match the provided wildcard ID.
     * @remarks Non-wildcard IDs work here too; technically they're valid as wildcard IDs. You'll just get one match (wrapped in an array).
     * @returns An array of Datasworn nodes matching the wildcard ID.
     */
    static getMatches<T extends StringId.Primary>(id: T, tree: (typeof IdParser)['datasworn'], forEach?: (id: string, node: unknown) => boolean): Map<string, TypeNode.ByType<ExtractTypeId<T>>>;
    static getMatches<T extends IdParser>(id: T, tree: (typeof IdParser)['datasworn'], forEach?: (id: string, node: unknown) => boolean): Map<string, ReturnType<T['get']>>;
    static parse(id: string): CollectionId | CollectableId | NonCollectableId | EmbeddedId;
    /**
     * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
     * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
     * @param index If provided, nodes that receive IDs will be indexed in the map (with their ID as the key).
     * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
     */
    static assignIdsInRulesPackage<T extends DataswornSource.RulesPackage>(rulesPackage: T, index?: Map<string, unknown>): Extract<Datasworn.RulesPackage, Pick<T, 'type'>>;
    protected static _validatePathSegments(typeIds: string[], pathSegments: unknown): pathSegments is string[];
    protected static _validateEmbeddedPath(typeIds: [TypeId.Primary, ...string[]], path: string): boolean;
    static _validateIndexKey(value: unknown): boolean;
    /** @internal */
    static _getPathKeyCount(typeId: TypeId.Primary): {
        min: number;
        max: number;
    };
    /**
     * @throws If the typeId isn't a primary TypeId; if the path doesn't meet the minimum or maximum length for its type; or if any of the individual elements are invalid.
     */
    protected static _validatePrimaryPath(typeId: string, path: string): boolean;
    /** @internal */
    protected static _validateDictKey(key: unknown): key is DataswornSource.DictKey;
    /** @internal */
    protected static _getMatchesFrom<V>(record: Record<string, V>, matchKey: string): Map<string, V>;
    protected static _getMatchesFrom<V>(array: Array<V>, matchKey: number | WildcardString | GlobstarString): Map<number, V>;
    protected static _getMatchesFrom<V, K extends number | string>(map: Map<K, V>, matchKey: K | WildcardString | GlobstarString): Map<K, V>;
    protected static _getMatchesFrom<V>(record: Record<string, V> | Map<string, V>, matchKey: string): Map<string, V>;
    protected static _getMatchesFrom<V, TFrom extends Record<string, V> | Array<V> | Map<string, V>>(obj: TFrom, matchKey?: string | number): Map<string | number, V>;
    /** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
    static datasworn: Tree | null;
    static readonly RulesPackagePattern: RegExp;
    static readonly DictKeyPattern: RegExp;
    static readonly RecursiveDictKeyPattern: RegExp;
    /** @internal */
    protected _getRulesPackage(tree: (typeof IdParser)['tree']): Datasworn.RulesPackage | undefined;
    /** @internal */
    protected _getTypeBranch(tree: (typeof IdParser)['tree']): DictionaryLike<UnknownNode> | undefined;
    /** @internal */
    protected _getUnsafe(tree: (typeof IdParser)['tree']): Node;
    /** @internal */
    protected _matchRulesPackages(tree?: DictionaryLike<Datasworn.RulesPackage>): Map<string, Datasworn.RulesPackage>;
    /**
     * @param forEach Optional function to apply to each match. If it returns `true`, the matcher will exit early and return whatever results it currently has.
     * @internal
     */
    _getMatchesUnsafe(tree: typeof IdParser.tree, forEach?: (id: string, node: unknown) => boolean): Map<string, Node>;
}
declare namespace IdParser {
    type FormatType = 'collectable' | 'collection' | 'non_collectable';
    type Options<TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts, PathSegments extends string[] & {
        length: TypeIds['length'];
    } = string[] & {
        length: TypeIds['length'];
    }> = {
        typeIds: TypeIds;
        pathSegments: PathSegments;
    };
}
declare abstract class EmbeddingId<TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts, PathSegments extends string[] & {
    length: TypeIds['length'];
} = string[] & {
    length: TypeIds['length'];
}, Node extends UnknownNode = UnknownNode> extends IdParser<TypeIds, PathSegments, Node> {
    #private;
    /**
     * Create a child EmbeddedId with a given type and key.
     */
    createEmbeddedIdChild(embeddedTypeId: TypeId.Embeddable, key: string): EmbeddedId;
    get embeddableTypes(): string[];
    assignIdsIn(node: object, recursive?: boolean, index?: Map<string, unknown>): object;
}
declare namespace EmbeddingId {
    type EmbeddedIn<T extends EmbeddingId = EmbeddingId, TEmbedType extends TypeId.Embeddable = TypeId.Embeddable, K extends string = string> = T extends EmbeddingId ? EmbeddedId<EmbeddingId, TEmbedType, K> : never;
}
declare class NonCollectableId<TTypeId extends TypeId.NonCollectable = TypeId.NonCollectable, RulesPackage extends string = string, Key extends string = string> extends EmbeddingId<[
    TTypeId
], [
    Join<[RulesPackage, Key]>
], TypeNode.NonCollectable<TTypeId>> {
    get isRecursive(): false;
    constructor(typeId: TTypeId, rulesPackage: RulesPackage, key: Key);
}
interface NonCollectableId<TTypeId extends TypeId.NonCollectable = TypeId.NonCollectable, RulesPackage extends string = string, Key extends string = string> {
    toString(): StringId.NonCollectable<TTypeId, RulesPackage, Key>;
    get rulesPackageId(): RulesPackage;
    get typeId(): TTypeId;
    createEmbeddedIdChild<T extends TTypeId extends TypeId.Embedding ? TypeId.EmbeddableIn<TTypeId> : never, K extends string>(embeddedTypeId: T, key: string): TTypeId extends TypeId.Embedding ? EmbeddedId<this, T, K> : never;
    /** @internal */
    _getTypeBranch(tree: (typeof IdParser)['tree']): Map<string, TypeNode.NonCollectable<TTypeId>> | Record<string, TypeNode.NonCollectable<TTypeId>> | undefined;
    get(tree: (typeof IdParser)['tree']): TypeNode.NonCollectable<TTypeId> | undefined;
    getMatches(tree: (typeof IdParser)['tree'], forEach?: (id: string, node: unknown) => boolean): Map<string, TypeNode.NonCollectable<TTypeId>>;
    /** @internal */
    _getUnsafe(tree: (typeof IdParser)['tree']): TypeNode.NonCollectable<TTypeId>;
    /** @internal */
    _getMatchesUnsafe(tree: (typeof IdParser)['tree'], forEach?: (id: string, node: unknown) => boolean): Map<string, TypeNode.NonCollectable<TTypeId>>;
}
declare namespace NonCollectableId {
    type FromString<T extends StringId.NonCollectable> = NonCollectableId<StringId.ExtractNonCollectableType<T>, StringId.ExtractPrimaryRulesPackage<T>, StringId.ExtractNonCollectableKey<T>>;
}
declare class CollectableId<TTypeId extends TypeId.Collectable = TypeId.Collectable, RulesPackage extends string = string, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys, Key extends string = string> extends EmbeddingId<[
    TTypeId
], [
    Join<[RulesPackage, ...CollectableAncestorKeys, Key]>
], TypeNode.Collectable<TTypeId>> implements RecursiveId<[
    TTypeId
], [
    Join<[RulesPackage, ...CollectableAncestorKeys, Key]>
], TypeNode.Collectable<TTypeId>> {
    get isRecursive(): true;
    get embeddableTypes(): TTypeId extends TypeId.Embedding ? [...TypeId.EmbeddableIn<TTypeId>[]] : [];
    constructor(typeId: TTypeId, rulesPackage: RulesPackage, ...pathKeys: [...CollectableAncestorKeys, Key]);
    get collectionAncestorKeys(): CollectableAncestorKeys;
    get recursionDepth(): CollectableAncestorKeys['length'];
    get parentTypeId(): TypeId.CollectionOf<TTypeId>;
    getCollectionIdParent(): CollectionId<TypeId.CollectionOf<TTypeId>, RulesPackage, Head<CollectableAncestorKeys> & CollectionAncestorKeys, LastElementOf<CollectableAncestorKeys>>;
    /** @internal */
    _getUnsafe(tree: (typeof IdParser)['tree']): TypeNode.Collectable<TTypeId>;
    /** @internal */
    _getMatchesUnsafe(tree: typeof IdParser.tree, forEach?: (id: string, node: unknown) => boolean): Map<string, TypeNode.Collectable<TTypeId>>;
}
interface CollectableId<TTypeId extends TypeId.Collectable = TypeId.Collectable, RulesPackage extends string = string, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys, Key extends string = string> {
    toString(): StringId.Collectable<TTypeId, RulesPackage, CollectableAncestorKeys, Key>;
    createEmbeddedIdChild<T extends TTypeId extends TypeId.Embedding ? TypeId.EmbeddableIn<TTypeId> : never, K extends string>(embeddedTypeId: T, key: string): TTypeId extends TypeId.Embedding ? EmbeddedId<this, T, K> : never;
    assignIdsIn<T extends TypeNode.CollectableSource<TTypeId>>(node: T, recursive?: boolean, index?: Map<string, unknown>): TypeNode.Collectable<TTypeId>;
    get typeId(): TTypeId;
    get primaryTypeId(): TTypeId;
    get primaryPathKeys(): [RulesPackage, ...CollectableAncestorKeys, Key];
    get isCollection(): false;
    get isCollectable(): true;
    get compositeTypeId(): TTypeId;
    get rulesPackageId(): RulesPackage;
    /** @internal */
    _getTypeBranch(tree: (typeof IdParser)['tree']): Record<string, TypeNode.Collection<TypeId.CollectionOf<TTypeId>>> | Map<string, TypeNode.Collection<TypeId.CollectionOf<TTypeId>>> | undefined;
    get(tree: (typeof IdParser)['tree']): TypeNode.Collectable<TTypeId> | undefined;
}
declare namespace CollectableId {
    type FromString<T extends StringId.Collectable> = T extends `${infer TypeId extends TypeId.Collectable}${PrefixSep}${infer RulesPackage extends string}${PathKeySep}${infer AncestorKeys extends Join<CollectableAncestorKeys>}${PathKeySep}${infer Key extends string}` ? CollectableId<TypeId, RulesPackage, Split<AncestorKeys>, Key> : never;
}
declare class CollectionId<TTypeId extends TypeId.Collection = TypeId.Collection, RulesPackage extends string = string, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends IdParser<[
    TTypeId
], [
    Join<[RulesPackage, ...CollectionAncestorKeys, Key]>
], TypeNode.Collection<TTypeId>> implements RecursiveId<[
    TTypeId
], [
    Join<[RulesPackage, ...CollectionAncestorKeys, Key]>
], TypeNode.Collection<TTypeId>> {
    #private;
    constructor(typeId: TTypeId, rulesPackage: RulesPackage, ...pathKeys: [...CollectionAncestorKeys, Key]);
    get isRecursive(): true;
    get recursionDepth(): CollectionAncestorKeys['length'];
    get collectionAncestorKeys(): CollectionAncestorKeys;
    /**
     * Create an ID representing a {@link CollectableId} child of this CollectionId, using the provided key.
     * @example
     * ```typescript
     * const collection = IdParser.parse('oracle_collection:starforged/core')
     * const collectable = collection.createCollectableIdChild('action')
     * console.log(collectable.toString()) // 'oracle_rollable:starforged/core/action'
     * ```
     */
    createCollectableIdChild<ChildKey extends string>(key: ChildKey): CollectableId<TypeId.CollectableOf<TTypeId>, RulesPackage, [
        ...CollectionAncestorKeys,
        Key
    ], ChildKey>;
    /**
     * Create an ID representing a Collection child of this CollectionId, using the provided key.
     * @throws If a child collection ID can't be created because the maximum recursion depth has been reached.
     * @see {@link COLLECTION_DEPTH_MAX}
     * @example
     * ```typescript
     * const collection = IdParser.parse('oracle_collection:starforged/planet')
     * const childCollection = collection.createCollectionIdChild('furnace')
     * console.log(childCollection.toString()) // 'oracle_collection:starforged/planet/furnace'
     * ```
     */
    createCollectionIdChild<ChildKey extends string>(key: ChildKey): CollectionId.ChildCollectionOf<this, ChildKey>;
    assignIdsIn<T extends TypeNode.CollectionSource<TTypeId>>(node: T, recursive?: boolean, index?: Map<string, unknown>): TypeNode.Collection<TTypeId>;
    /**
     * Returns a CollectionId representing the parent collection of this ID.
     * @throws If a parent collection ID isn't possible (because this ID doesn't have a parent collection.)
     * @example
     * ```typescript
     * const collection = IdParser.parse('oracle_collection:starforged/planet/jungle/settlements')
     * const parentCollection = collection.getCollectionIdParent()
     * console.log(parentCollection.toString()) // 'oracle_collection:starforged/planet/jungle'
     * ```
     */
    getCollectionIdParent(): CollectionId.ParentCollectionOf<this>;
    /** @internal */
    _getUnsafe(tree: Record<string, Datasworn.RulesPackage> | Map<string, Datasworn.RulesPackage>): TypeNode.Collection<TTypeId>;
    /** @internal */
    protected static _recurseMatches<T extends TypeNode.Collection>(from: T, currentPath: string[], nextPath: string[], matches?: Map<string, T>, forEach?: (id: string, node: unknown) => boolean, depth?: number): Map<string, T>;
    /** @internal */
    _getMatchesUnsafe(tree: typeof IdParser.tree, forEach?: (id: string, node: unknown) => boolean): Map<string, TypeNode.Collection<TTypeId>>;
}
interface CollectionId<TTypeId extends TypeId.Collection = TypeId.Collection, RulesPackage extends string = string, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> {
    get compositeTypeId(): TTypeId;
    get rulesPackageId(): RulesPackage;
    get typeId(): TTypeId;
    get isCollectable(): false;
    get isCollection(): true;
    toString(): StringId.Collection<TTypeId, RulesPackage, CollectionAncestorKeys, Key>;
    get primaryTypeId(): TTypeId;
    get primaryPathKeys(): [RulesPackage, ...CollectionAncestorKeys, Key];
    /** @internal */
    _getTypeBranch(tree: (typeof IdParser)['tree']): Record<string, TypeNode.Collection<TTypeId>> | Map<string, TypeNode.Collection<TTypeId>> | undefined;
    get(tree: (typeof IdParser)['tree']): TypeNode.Collection<TTypeId> | undefined;
}
declare namespace CollectionId {
    type FromString<T extends StringId.Collection> = T extends `${infer TypeId extends TypeId.Collection}${PrefixSep}${infer RulesPackage extends string}${PathKeySep}${infer AncestorKeys extends Join<CollectionAncestorKeys>}${PathKeySep}${infer Key extends string}` ? CollectionId<TypeId, RulesPackage, Split<AncestorKeys>, Key> : never;
    type ChildOf<T extends CollectionId, K extends string = string> = CollectableId<TypeId.CollectableOf<T['primaryTypeId']>, T['rulesPackageId'], T extends CollectionId<T['primaryTypeId'], T['rulesPackageId'], infer U extends CollectionAncestorKeys, infer K extends string> ? [...U, K] : never, K>;
    type ChildCollectionOf<T extends CollectionId, K extends string = string> = DropFirst<T['primaryPathKeys']> extends CollectionAncestorKeys ? CollectionId<T['typeId'], T['rulesPackageId'], DropFirst<T['primaryPathKeys']>, K> : never;
    type ParentCollectionOf<T extends CollectionId> = T['collectionAncestorKeys'] extends [infer K extends string] ? CollectionId<T['primaryTypeId'], T['rulesPackageId'], [], K> : T['collectionAncestorKeys'] extends [
        infer U extends string,
        infer K extends string
    ] ? CollectionId<T['primaryTypeId'], T['rulesPackageId'], [U], K> : T['collectionAncestorKeys'] extends [
        ...infer U extends PathKeys.CollectionAncestorKeys,
        infer K extends string
    ] ? CollectionId<T['primaryTypeId'], T['rulesPackageId'], U, K> : never;
}
declare class EmbeddedId<ParentId extends EmbeddingId = EmbeddingId, TTypeId extends TypeId.Embeddable = TypeId.Embeddable, Key extends string = string> extends EmbeddingId<[
    ...ParentId['typeIds'],
    TTypeId
], [
    ...ParentId['pathSegments'],
    Key
] & {
    length: [...ParentId['typeIds'], TTypeId]['length'];
}, TypeNode.Embedded<TTypeId>> {
    #private;
    /**
     * Returns the embedding ID parent of this ID.
     */
    getEmbeddingIdParent(): ParentId;
    _getUnsafe(tree: (typeof IdParser)['tree']): TypeNode.Embedded<TTypeId>;
    _getPathRegExpSource(): string;
    /** @internal */
    constructor(parent: ParentId, typeId: TTypeId, key: string);
    constructor(parent: ParentId, typeId: TTypeId, index: number);
}
interface EmbeddedId<ParentId extends EmbeddingId = EmbeddingId, TTypeId extends TypeId.Embeddable = TypeId.Embeddable, Key extends string = string> {
    toString(): `${this['compositeTypeId']}${PrefixSep}${Join<this['pathSegments'], TypeSep>}`;
    get embeddableTypes(): TTypeId extends TypeId.EmbeddingWhenEmbeddedType ? [...TypeId.EmbeddableInEmbeddedType<TTypeId>[]] : [];
    get(tree: (typeof IdParser)['tree']): TypeNode.Embedded<TTypeId>;
    get typeId(): TTypeId;
    get typeIds(): [...ParentId['typeIds'], TTypeId];
    get pathSegments(): [...ParentId['pathSegments'], Key];
    get primaryTypeId(): ParentId['primaryTypeId'];
    get primaryPathKeys(): ParentId['primaryPathKeys'];
    get isRecursive(): ParentId['isRecursive'];
    get compositeTypeId(): `${ParentId['compositeTypeId']}${TypeSep}${TTypeId}`;
}
export { type CollectableId, CollectionId, EmbeddedId, IdParser, type NonCollectableId };
