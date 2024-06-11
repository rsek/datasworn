/// <reference types="node" />
import CONST from './IdElements/CONST.js';
import TypeId from './IdElements/TypeId.js';
import GlobberPath from './ObjectGlobber.js';
import type * as StringId from './StringId.js';
import type { ExtractTypeId, ExtractAncestorKeys, ExtractKey, ExtractRulesPackage, ExtractPrimaryAncestorKeys } from './Utils/Id.js';
import type { Datasworn, DataswornSource } from './index.js';
import { type PathKeys } from './IdElements/index.js';
import type TypeNode from './TypeNode.js';
import type { Tree } from './Tree.js';
import type { Join } from './Utils/String.js';
declare abstract class IdParser<TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts, PathSegments extends string[] & {
    length: TypeIds['length'];
} = string[] & {
    length: TypeIds['length'];
}> implements IdParser.Options<TypeIds, PathSegments> {
    #private;
    /**
     * The object used for log messages.
     * @default console
     */
    static logger: Console;
    get typeIds(): TypeIds;
    set typeIds(value: TypeIds);
    get pathSegments(): PathSegments;
    set pathSegments(value: PathSegments);
    constructor(options: IdParser.Options<TypeIds, PathSegments>);
    createdEmbeddedId<TypeId extends TypeId.EmbeddableTypes, Key extends string | number>(typeId: TypeId, key: Key): EmbeddedId<this, TypeId, Key>;
    /**
     * Returns a string representation of the ID.
     */
    get id(): `${Join<TypeIds, ".">}:${Join<PathSegments, ".">}`;
    toString(): `${Join<TypeIds, ".">}:${Join<PathSegments, ".">}`;
    get primaryTypeId(): string;
    get primaryPath(): string;
    get primaryPathElements(): string[];
    get rulesPackage(): string;
    get primaryDictKeyElements(): string[];
    get fullTypeId(): Join<TypeIds, ".">;
    get fullPath(): Join<PathSegments, ".">;
    get targetTypeId(): string;
    get lastProperty(): TypeId.RootKey<TypeId.AnyPrimary>;
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard(): boolean;
    /** May this ID contain recursive elements in its path? */
    get isRecursive(): boolean;
    /** Does this ID include a collectable object in its path? */
    get isCollectable(): boolean;
    /** Does this ID include a collection object in its path? */
    get isCollection(): boolean;
    /** Assign a string ID to a Datasworn node, and all eligible descendant nodes.
     * @param node The Datasworn
     * @param recursive Should IDs be assigned to descendant objects too? (default: true)
     * @returns The mutated object.
     */
    assignIdsIn(node: TypeNode.Any, recursive?: boolean, index?: Map<string, TypeNode.Any>): TypeNode.Any;
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.datasworn} or as an argument).
     */
    get(tree?: (typeof IdParser)['datasworn']): TypeNode.Any;
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
     */
    static get<T extends StringId.AnyId>(id: T, tree?: (typeof IdParser)['datasworn']): TypeNode.ByType<ExtractTypeId<T>>;
    static get<T extends IdParser>(id: T, tree?: (typeof IdParser)['datasworn']): ReturnType<T['get']>;
    /** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
     * @internal
     */
    toGlobberPath(): GlobberPath;
    /**
     * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
     * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
     * @param index If provided, nodes that receive IDs will be indexed in the map (with their ID as the key).
     * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
     */
    static assignIdsInRulesPackage<T extends DataswornSource.RulesPackage>(rulesPackage: T, index?: Map<string, TypeNode.Any>): Extract<Datasworn.RulesPackage, Pick<T, 'type'>>;
    static parse<T extends StringId.NonCollectableId>(id: T): NonCollectableId;
    static parse<T extends StringId.CollectableId>(id: T): CollectableId;
    static parse<T extends StringId.CollectionId>(id: T): CollectionId;
    static parse<T extends StringId.EmbeddedId>(id: T): EmbeddedId;
    /** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
    static datasworn: Tree | null;
    static readonly RulesPackagePattern: RegExp;
    static readonly DictKeyPattern: RegExp;
    static readonly RecursiveDictKeyPattern: RegExp;
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
declare class NonCollectableId<TypeId extends TypeId.NonCollectable = TypeId.NonCollectable, RulesPackage extends string = string, Key extends string = string> extends IdParser<[TypeId], [Join<[RulesPackage, Key]>]> {
    constructor(typeId: TypeId, rulesPackage: RulesPackage, key: Key);
}
interface NonCollectableId<TypeId extends TypeId.NonCollectable = TypeId.NonCollectable, RulesPackage extends string = string, Key extends string = string> extends IdParser<[TypeId], [`${RulesPackage}${CONST.PathSep}${Key}`]> {
    get id(): StringId.NonCollectableId<TypeId, RulesPackage, Key>;
}
declare namespace NonCollectableId {
    type FromString<T extends StringId.NonCollectableId> = NonCollectableId<ExtractTypeId<T>, ExtractRulesPackage<T>, ExtractKey<T>>;
}
interface RecursiveId extends IdParser {
    /** The current collection recursion depth. */
    get recursionDepth(): number;
    get isRecursive(): true;
}
declare class CollectableId<TypeId extends TypeId.Collectable = TypeId.Collectable, RulesPackage extends string = string, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys, Key extends string = string> extends IdParser<[
    TypeId
], [
    Join<[RulesPackage, ...CollectableAncestorKeys, Key]>
]> implements RecursiveId {
    constructor(typeId: TypeId, rulesPackage: RulesPackage, ...pathKeys: [...CollectableAncestorKeys, Key]);
    get recursionDepth(): number;
}
interface CollectableId<TypeId extends TypeId.Collectable = TypeId.Collectable, RulesPackage extends string = string, CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys, Key extends string = string> extends IdParser<[
    TypeId
], [
    Join<[RulesPackage, ...CollectableAncestorKeys, Key]>
]>, RecursiveId {
    get id(): StringId.CollectableId<TypeId, RulesPackage, CollectableAncestorKeys, Key>;
    get primaryTypeId(): TypeId;
    get primaryPathElements(): [RulesPackage, ...CollectableAncestorKeys, Key];
    get primaryDictKeyElements(): [...CollectableAncestorKeys, Key];
    get isRecursive(): true;
    get isCollection(): false;
    get isCollectable(): true;
}
declare namespace CollectableId {
    type FromString<T extends StringId.CollectableId> = CollectableId<ExtractTypeId<T>, ExtractRulesPackage<T>, ExtractPrimaryAncestorKeys<T>, ExtractKey<T>>;
}
declare class CollectionId<TypeId extends TypeId.Collection = TypeId.Collection, RulesPackage extends string = string, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends IdParser<[
    TypeId
], [
    Join<[RulesPackage, ...CollectionAncestorKeys, Key]>
]> implements RecursiveId {
    constructor(typeId: TypeId, rulesPackage: RulesPackage, ...pathKeys: [...CollectionAncestorKeys, Key]);
    get recursionDepth(): number;
    get collectionAncestorKeys(): CollectionAncestorKeys;
    createChild<ChildKey extends string>(key: ChildKey): CollectableId<TypeId.CollectableOf<TypeId>, RulesPackage, [
        ...CollectionAncestorKeys,
        Key
    ], ChildKey>;
    assignIdsIn<T extends TypeNode.ByType<TypeId>>(node: T, recursive?: boolean, index?: Map<string, TypeNode.Any>): T;
    /**
     * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
     */
    getParentCollection(): CollectionId.ParentCollectionOf<this>;
    /**
     * @throws If a child collection ID can't be created because the maximum recursion depth has been reached.
     * @see {@link CONST.RECURSIVE_PATH_ELEMENTS_MAX}
     */
    createCollectionChild<ChildKey extends string>(key: ChildKey): CollectionId.ChildCollectionOf<this, ChildKey>;
}
interface CollectionId<TypeId extends TypeId.Collection = TypeId.Collection, RulesPackage extends string = string, CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys, Key extends string = string> extends IdParser<[
    TypeId
], [
    Join<[RulesPackage, ...CollectionAncestorKeys, Key]>
]>, RecursiveId {
    get isCollectable(): false;
    get isCollection(): true;
    get isRecursive(): true;
    get id(): StringId.CollectionId<TypeId, RulesPackage, CollectionAncestorKeys, Key>;
    get primaryTypeId(): TypeId;
    get primaryPathElements(): [RulesPackage, ...CollectionAncestorKeys, Key];
    get primaryDictKeyElements(): [...CollectionAncestorKeys, Key];
}
declare namespace CollectionId {
    type FromString<T extends StringId.CollectionId> = CollectionId<ExtractTypeId<T>, ExtractRulesPackage<T>, ExtractAncestorKeys<T>, ExtractKey<T>>;
    type ChildOf<T extends CollectionId, K extends string = string> = CollectableId<TypeId.CollectableOf<T['typeId']>, T['rulesPackage'], T['pathKeys'], K>;
    type ChildCollectionOf<T extends CollectionId, K extends string = string> = T['pathKeys'] extends PathKeys.CollectionAncestorKeys ? CollectionId<T['typeId'], T['rulesPackage'], T['pathKeys'], K> : never;
    type ParentCollectionOf<T extends CollectionId> = T['collectionAncestorKeys'] extends [infer K extends string] ? CollectionId<T['typeId'], T['rulesPackage'], [], K> : T['collectionAncestorKeys'] extends [
        infer U extends string,
        infer K extends string
    ] ? CollectionId<T['typeId'], T['rulesPackage'], [U], K> : T['collectionAncestorKeys'] extends [
        ...infer U extends PathKeys.CollectionAncestorKeys,
        infer K extends string
    ] ? CollectionId<T['typeId'], T['rulesPackage'], U, K> : never;
}
declare class EmbeddedId<Parent extends IdParser.Options = IdParser.Options, TypeId extends TypeId.EmbeddableTypes = TypeId.EmbeddableTypes, Key extends string | number = string | number> extends IdParser {
    constructor(parent: Parent, typeId: TypeId, key: string);
    constructor(parent: Parent, typeId: TypeId, index: number);
}
interface EmbeddedId<Parent extends IdParser.Options = IdParser.Options, TypeId extends TypeId.EmbeddableTypes = TypeId.EmbeddableTypes, Key extends string | number = string | number> extends IdParser {
}
export { IdParser, NonCollectableId, CollectableId, EmbeddedId, CollectionId };
