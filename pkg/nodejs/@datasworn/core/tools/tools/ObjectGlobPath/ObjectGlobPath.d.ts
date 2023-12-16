import { type RulesPackage } from '../../../Datasworn.js'
import type * as Path from './Path.js';
import { type TypeForId } from '../Id/Utils.js';
import * as Id from '../Id/index.js';
import CONST from '../Id/IdElements/CONST.js';
type MatchTest<T = unknown> = (value: T, thisKey: PropertyKey, matchedWith: PropertyKey) => boolean;
/**
 * @internal
 */
declare class ObjectGlobPath<TTuple extends Array<PropertyKey> = Array<PropertyKey>> extends Array<TTuple[number]> {
    constructor(...items: TTuple);
    /** Does this path contain any wildcard or globstar elements? */
    get wildcard(): boolean;
    toJSON(): unknown[];
    clone(): ObjectGlobPath<[...this]>;
    partitionStaticPath(): [ObjectGlobPath, ObjectGlobPath];
    nearestStaticPath(): ObjectGlobPath<PropertyKey[]>;
    step(steps?: number): ObjectGlobPath<TTuple[number][]>;
    getParent(): ObjectGlobPath<TTuple[number][]>;
    getMatches<T>(from: object, matchTest?: MatchTest, matches?: unknown[], includeArrays?: boolean): T[];
    walk<T>(from: object, forEach?: ObjectGlobPath.WalkIteratee): T;
    is<T extends ObjectGlobPath>(path: T): path is T & typeof this;
    static isGlobElement(element: unknown): boolean;
    first(): TTuple[number];
    last(): TTuple[number];
    head(): TTuple[number][];
    tail(): TTuple[number][];
    static fromId<T extends Id.AnyId>(id: T): ObjectGlobPath<Path.PathForId<T>>;
    static getMatches(from: object, keys: PropertyKey[], { matchTest, includeArrays }?: {
        matchTest?: MatchTest;
        includeArrays: boolean;
    }): unknown[];
    static getKeyMatches(from: object, matchKey: PropertyKey, { forEachMatch, matchTest, includeArrays }?: {
        forEachMatch?: ObjectGlobPath.WalkIteratee;
        matchTest?: MatchTest;
        includeArrays: boolean;
    }): unknown[];
    /** Is this value an object with recursable keys? */
    static isWalkable(value: unknown, includeArrays?: boolean): boolean;
    /** Is the value valid as an object property key? */
    static isPropertyKey(key: unknown): key is PropertyKey;
    /**
     * Navigates an object hierarchy by recursively following a series of property keys.
     * @param from The object to walk.
     * @param path An array of object property to follow.
     * @param forEach An optional function to run on every walked value.
     * @throws If a key is an invalid type, or if a key can't be found.
     */
    static walk<T extends Id.AnyId>(from: Record<string, RulesPackage>, path: ObjectGlobPath<Path.PathForId<T>>, forEach?: ObjectGlobPath.WalkIteratee): TypeForId<T>;
    static getObjectPaths(object: object, includeArrays?: boolean, currentPath?: ObjectGlobPath): ObjectGlobPath<PropertyKey[]>[];
    /** Replace a wildcard/globstar string with a Symbol */
    static replaceGlobString<T extends PropertyKey>(item: T): T extends typeof CONST.WildcardString ? (typeof ObjectGlobPath)['WILDCARD'] : T extends typeof CONST.GlobstarString ? (typeof ObjectGlobPath)['GLOBSTAR'] : T;
    /** Replace a wildcard or globstar Symbol with a string representation. */
    static replaceGlobSymbol<T extends PropertyKey>(item: T): T extends (typeof ObjectGlobPath)['WILDCARD'] ? typeof CONST.WildcardString : T extends (typeof ObjectGlobPath)['GLOBSTAR'] ? typeof CONST.GlobstarString : T;
}
declare namespace ObjectGlobPath {
    /** Represents a glob wildcard path element, usually expressed as `*` */
    const WILDCARD: unique symbol;
    /** Represents a globstar (recursive wildcard) path element, usually expressed as `**` */
    const GLOBSTAR: unique symbol;
    type WalkIteratee = (value: unknown, path: PropertyKey[]) => void;
}
export default ObjectGlobPath;
