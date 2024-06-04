import type { DropLast, Last } from './Utils/Array.js';
import type { ExtractAncestorKeys, ExtractKey, ExtractParentCollectionKey, ExtractRulesPackage, ExtractTypeId } from './Utils/Id.js';
import type * as StringId from './StringId.js';
import { NodeTypeId, type PathKeys } from './IdElements/index.js';
import ObjectGlobber from './ObjectGlobber.js';
import type * as Datasworn from './Datasworn.js';
import type DataswornNode from './DataswornNode.js';
import type { Tree } from './Tree.js';
declare namespace IdParser {
    type FormatType = 'non_collectable' | 'recursive_collectable' | 'non_recursive_collectable' | 'recursive_collection' | 'non_recursive_collection';
    type Options<RulesPackage extends string = string, TypeId extends NodeTypeId.Any = NodeTypeId.Any, PathKeys extends Datasworn.DictKey[] = Datasworn.DictKey[]> = {
        /**
         * The first element of the ID, representing the RulesPackage that the identified node is from.
         * @example "classic"
         * @example "delve"
         * @example "starforged"
         */
        rulesPackage: RulesPackage;
        /**
         * The second element of the ID, representing the {@link DataswornNode}'s type. This is the same value as the `type` property of the node.
         * @example "oracle_rollable"
         * @example "oracle_collection"
         * @example "asset"
         */
        typeId: TypeId;
        pathKeys: PathKeys;
    };
}
declare abstract class IdParser<RulesPackage extends string = string, TypeId extends NodeTypeId.Any = NodeTypeId.Any, PathKeys extends string[] = string[]> implements IdParser.Options<RulesPackage, TypeId, PathKeys> {
    #private;
    constructor({ rulesPackage, typeId, pathKeys }: IdParser.Options<RulesPackage, TypeId, PathKeys>);
    get rulesPackage(): RulesPackage;
    set rulesPackage(value: RulesPackage);
    get typeId(): TypeId;
    get pathKeys(): PathKeys;
    get typeRootKey(): NodeTypeId.RootKey<TypeId>;
    /** The parsed elements of the ID as an array of strings. */
    get elements(): [RulesPackage, TypeId, ...PathKeys];
    /**
     * Returns a string representation of the ID.
     */
    get id(): string;
    /**
     * Returns a string representation of the ID. Effectively an alias for {@link IdParser.id}
     */
    toString(): this['id'];
    /** Key elements that represent ancestor collection keys. */
    get collectionAncestorKeys(): string[];
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
    /** The regular expression that matches for a wildcard ID. */
    get matcher(): RegExp;
    /** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
     * @internal
     */
    toPath(): ObjectGlobber;
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.datasworn} or as an argument).
     */
    get(tree?: (typeof IdParser)['datasworn']): DataswornNode.ByType<TypeId>;
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
     */
    static get<T extends StringId.AnyId>(id: T, tree?: (typeof IdParser)['datasworn']): DataswornNode.ByType<ExtractTypeId<T>>;
    static get<T extends IdParser>(id: T, tree?: (typeof IdParser)['datasworn']): ReturnType<T['get']>;
    /**
     * Creates an IdParser from an {@link IdParser.Options} object. The appropriate subclass is inferred from the TypeId.
     */
    static fromOptions<RulesPackage extends string, TypeId extends NodeTypeId.Collection.Recursive, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys, Key extends string>(options: IdParser.Options<RulesPackage, TypeId, [
        ...CollectionAncestorKeys,
        Key
    ]>): RecursiveCollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key>;
    static fromOptions<RulesPackage extends string, TypeId extends NodeTypeId.Collection.NonRecursive, Key extends string>(options: IdParser.Options<RulesPackage, TypeId, [Key]>): NonRecursiveCollectionId<RulesPackage, TypeId, Key>;
    static fromOptions<RulesPackage extends string, TypeId extends NodeTypeId.Collectable.Recursive, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys, Key extends string>(options: IdParser.Options<RulesPackage, TypeId, [
        ...CollectableAncestorKeys,
        Key
    ]>): RecursiveCollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key>;
    static fromOptions<RulesPackage extends string, TypeId extends NodeTypeId.Collectable.NonRecursive, CollectionKey extends string, Key extends string>(options: IdParser.Options<RulesPackage, TypeId, [CollectionKey, Key]>): NonRecursiveCollectableId<RulesPackage, TypeId, CollectionKey, Key>;
    static fromOptions<RulesPackage extends string, TypeId extends NodeTypeId.NonCollectable, Key extends string>(options: IdParser.Options<RulesPackage, TypeId, [Key]>): NonCollectableId<RulesPackage, TypeId, Key>;
    static toPath(options: IdParser): ObjectGlobber;
    static toPath(options: IdParser.Options): ObjectGlobber;
    static toPath(options: StringId.AnyId): ObjectGlobber;
    /**
     * Parses a Datasworn ID string into an IdParser of the appropriate subclass.
     * @throws If it receives an invalid ID.
     */
    static fromString<T extends StringId.NonRecursiveCollectableId>(id: T): NonRecursiveCollectableId.FromString<T>;
    static fromString<T extends StringId.RecursiveCollectableId>(id: T): RecursiveCollectableId.FromString<T>;
    static fromString<T extends StringId.NonRecursiveCollectionId>(id: T): NonRecursiveCollectionId.FromString<T>;
    static fromString<T extends StringId.RecursiveCollectionId>(id: T): RecursiveCollectionId.FromString<T>;
    static fromString<T extends StringId.NonCollectableId>(id: T): NonCollectableId.FromString<T>;
    /** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
    static datasworn: Tree | null;
    static readonly RulesPackagePattern: RegExp;
    static readonly DictKeyPattern: RegExp;
    static readonly RecursiveDictKeyPattern: RegExp;
}
declare class NonCollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.NonCollectable = NodeTypeId.NonCollectable, Key extends string = string> extends IdParser<RulesPackage, TypeId, [Key]> {
    constructor(rulesPackage: RulesPackage, type: TypeId, key: Key);
}
interface NonCollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.NonCollectable = NodeTypeId.NonCollectable, Key extends string = string> extends IdParser<RulesPackage, TypeId, [Key]> {
    get id(): StringId.NonCollectableId<RulesPackage, TypeId, Key>;
    get isCollectable(): false;
    get elements(): [RulesPackage, TypeId, Key];
    get isCollection(): false;
    get typeRootKey(): NodeTypeId.RootKey<TypeId>;
    get collectionAncestorKeys(): [];
    get pathKeys(): [Key];
    get key(): Key;
}
declare abstract class CollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collectable.Any = NodeTypeId.Collectable.Any, CollectionPathKeys extends string[] = string[], Key extends string = string> extends IdParser<RulesPackage, TypeId, [...CollectionPathKeys, Key]> {
}
interface CollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collectable.Any = NodeTypeId.Collectable.Any, CollectionPathKeys extends string[] = string[], Key extends string = string> extends IdParser<RulesPackage, TypeId, [...CollectionPathKeys, Key]> {
    get isCollectable(): true;
    get elements(): [RulesPackage, TypeId, ...CollectionPathKeys, Key];
    get isCollection(): false;
    get typeRootKey(): NodeTypeId.RootKey<TypeId>;
    get collectionAncestorKeys(): CollectionPathKeys;
    get pathKeys(): [...CollectionPathKeys, Key];
    get key(): Key;
}
interface RecursiveId extends IdParser {
    /** The current collection recursion depth. */
    get recursionDepth(): number;
    get isRecursive(): true;
}
declare class NonRecursiveCollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collectable.NonRecursive = NodeTypeId.Collectable.NonRecursive, CollectionKey extends string = string, Key extends string = string> extends CollectableId<RulesPackage, TypeId, [CollectionKey], Key> {
    constructor(rulesPackage: RulesPackage, type: TypeId, collectionKey: CollectionKey, key: Key);
}
interface NonRecursiveCollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collectable.NonRecursive = NodeTypeId.Collectable.NonRecursive, CollectionKey extends string = string, Key extends string = string> extends CollectableId<RulesPackage, TypeId, [CollectionKey], Key> {
    get id(): StringId.NonRecursiveCollectableId<RulesPackage, TypeId, CollectionKey, Key>;
    get isRecursive(): false;
}
declare class RecursiveCollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collectable.Recursive = NodeTypeId.Collectable.Recursive, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys, Key extends string = string> extends CollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key> implements RecursiveId {
    constructor(rulesPackage: RulesPackage, type: TypeId, ...pathKeys: [...CollectableAncestorKeys, Key]);
    get recursionDepth(): number;
}
interface RecursiveCollectableId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collectable.Recursive = NodeTypeId.Collectable.Recursive, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys, Key extends string = string> extends CollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key> {
    get id(): StringId.RecursiveCollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key>;
    get isRecursive(): true;
    get pathKeys(): [...CollectableAncestorKeys, Key];
    get collectionAncestorKeys(): CollectableAncestorKeys;
    get elements(): [RulesPackage, TypeId, ...CollectableAncestorKeys, Key];
}
declare abstract class CollectionId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collection.Any = NodeTypeId.Collection.Any, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends IdParser<RulesPackage, TypeId, [...CollectionAncestorKeys, Key]> {
    constructor(rulesPackage: RulesPackage, type: TypeId, ...pathKeys: [...CollectionAncestorKeys, Key]);
    abstract createChild<ChildKey extends string>(key: ChildKey): CollectableId<RulesPackage, NodeTypeId.CollectedBy<TypeId>, [
        ...CollectionAncestorKeys,
        Key
    ], ChildKey>;
}
interface CollectionId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collection.Any = NodeTypeId.Collection.Any, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends IdParser<RulesPackage, TypeId, [...CollectionAncestorKeys, Key]> {
    get elements(): [RulesPackage, TypeId, ...CollectionAncestorKeys, Key];
    get isCollectable(): false;
    get isCollection(): true;
    get typeRootKey(): NodeTypeId.RootKey<TypeId>;
    get collectionAncestorKeys(): CollectionAncestorKeys;
    get pathKeys(): [...CollectionAncestorKeys, Key];
    get key(): Key;
}
declare class RecursiveCollectionId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collection.Recursive = NodeTypeId.Collection.Recursive, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends CollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key> implements RecursiveId {
    createChild<ChildKey extends string>(key: ChildKey): RecursiveCollectableId<RulesPackage, NodeTypeId.CollectedBy<TypeId>, [
        ...CollectionAncestorKeys,
        Key
    ], ChildKey>;
    createCollectionChild<ChildKey extends string>(key: ChildKey): this['pathKeys'] extends PathKeys.CollectionAncestorKeys ? RecursiveCollectionId<RulesPackage, TypeId, this['pathKeys'], ChildKey> : never;
    /**
     * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
     */
    getParent(): this['collectionAncestorKeys'] extends PathKeys.CollectionPathKeys ? RecursiveCollectionId<RulesPackage, TypeId, DropLast<CollectionAncestorKeys>, Last<CollectionAncestorKeys>> : never;
    get recursionDepth(): number;
}
interface RecursiveCollectionId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collection.Recursive = NodeTypeId.Collection.Recursive, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends CollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key> {
    get pathKeys(): [...CollectionAncestorKeys, Key];
    get id(): StringId.RecursiveCollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key>;
    get isRecursive(): true;
    get collectionAncestorKeys(): CollectionAncestorKeys;
    get elements(): [RulesPackage, TypeId, ...CollectionAncestorKeys, Key];
}
declare class NonRecursiveCollectionId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collection.NonRecursive = NodeTypeId.Collection.NonRecursive, Key extends string = string> extends CollectionId<RulesPackage, TypeId, [], Key> {
    createChild<ChildKey extends string>(key: ChildKey): NonRecursiveCollectableId<RulesPackage, NodeTypeId.CollectedBy<TypeId>, Key, ChildKey>;
}
interface NonRecursiveCollectionId<RulesPackage extends string = string, TypeId extends NodeTypeId.Collection.NonRecursive = NodeTypeId.Collection.NonRecursive, Key extends string = string> extends CollectionId<RulesPackage, TypeId, [], Key> {
    get id(): StringId.NonRecursiveCollectionId<RulesPackage, TypeId, Key>;
    get isRecursive(): false;
    get pathKeys(): [Key];
    get collectionAncestorKeys(): [];
    get elements(): [RulesPackage, TypeId, Key];
}
declare namespace NonCollectableId {
    type FromString<T extends StringId.NonCollectableId> = NonCollectableId<ExtractRulesPackage<T>, ExtractTypeId<T>, ExtractKey<T>>;
}
declare namespace NonRecursiveCollectableId {
    type FromString<T extends StringId.NonRecursiveCollectableId> = NonRecursiveCollectableId<ExtractRulesPackage<T>, ExtractTypeId<T>, ExtractParentCollectionKey<T>, ExtractKey<T>>;
}
declare namespace RecursiveCollectableId {
    type FromString<T extends StringId.RecursiveCollectableId> = RecursiveCollectableId<ExtractRulesPackage<T>, ExtractTypeId<T>, ExtractAncestorKeys<T>, ExtractKey<T>>;
}
declare namespace RecursiveCollectionId {
    type FromString<T extends StringId.RecursiveCollectionId> = RecursiveCollectionId<ExtractRulesPackage<T>, ExtractTypeId<T>, ExtractAncestorKeys<T>, ExtractKey<T>>;
}
declare namespace NonRecursiveCollectionId {
    type FromString<T extends StringId.NonRecursiveCollectionId> = NonRecursiveCollectionId<ExtractRulesPackage<T>, ExtractTypeId<T>, ExtractKey<T>>;
}
export { IdParser, NonCollectableId, NonRecursiveCollectableId, NonRecursiveCollectionId, RecursiveCollectableId, RecursiveCollectionId };
