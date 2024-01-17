import { type RulesPackage } from '../Datasworn.js';
import type * as Path from './Path.js';
import { type TypeForId } from '../Id/Utils.js';
import type * as Id from '../Id/index.js';
import CONST from '../IdElements/CONST.js';
/**
 * @internal
 */
declare class ObjectGlobber<TTuple extends Array<PropertyKey> = Array<PropertyKey>> extends Array<TTuple[number]> {
    #private;
    constructor(...items: TTuple);
    /** Keys that are part of the real object path, but not part of the ID */
    static readonly implicitKeys: string[];
    /** Does this path contain any wildcard or globstar elements? */
    get wildcard(): boolean;
    toJSON(): unknown[];
    clone(): ObjectGlobber<[...this]>;
    partitionStaticPath(): [ObjectGlobber, ObjectGlobber];
    nearestStaticPath(): ObjectGlobber<PropertyKey[]>;
    step(steps?: number): ObjectGlobber<TTuple[number][]>;
    getParent(): ObjectGlobber<TTuple[number][]>;
    getMatches<T>(from: object, matchTest?: ObjectGlobber.MatchTest, matches?: unknown[], includeArrays?: boolean): T[];
    walk<T>(from: object, forEach?: ObjectGlobber.WalkIteratee): T;
    is<T extends ObjectGlobber>(path: T): path is T & this;
    static isGlobElement(element: unknown): boolean;
    first(): TTuple[number];
    last(): TTuple[number];
    head(): TTuple[number][];
    tail(): TTuple[number][];
    static getMatches(from: object, keys: PropertyKey[], { matchTest, includeArrays }?: {
        matchTest?: ObjectGlobber.MatchTest;
        includeArrays: boolean;
    }): unknown[];
    static getKeyMatches(from: object, matchedKey: PropertyKey, { forEachMatch, matchTest, includeArrays }?: {
        forEachMatch?: ObjectGlobber.WalkIteratee;
        matchTest?: ObjectGlobber.MatchTest;
        includeArrays: boolean;
    }): unknown[];
    /** Is this value an object with recursable keys? */
    static isWalkable(value: unknown, includeArrays?: boolean): value is object;
    /** Is the value valid as an object property key? */
    static isPropertyKey(key: unknown): key is PropertyKey;
    /**
     * Navigates an object hierarchy by recursively following a series of property keys.
     * @param from The object to walk.
     * @param path An array of object property to follow.
     * @param forEach An optional function to run on every walked value.
     * @throws If a key is an invalid type, or if a key can't be found.
     */
    static walk<T extends Id.AnyId>(from: Record<string, RulesPackage>, path: ObjectGlobber<Path.PathForId<T>>, forEach?: ObjectGlobber.WalkIteratee): TypeForId<T>;
    /** Return all object paths in a given object. Paths that contain only a primitive value (boolean, number, string) are omitted. */
    static getObjectPaths(object: object, includeArrays?: boolean, currentPath?: ObjectGlobber): ObjectGlobber<PropertyKey[]>[];
    /** Replace a wildcard/globstar string with a Symbol */
    static replaceGlobString<T extends PropertyKey>(item: T): T extends typeof CONST.WildcardString ? (typeof ObjectGlobber)['WILDCARD'] : T extends typeof CONST.GlobstarString ? (typeof ObjectGlobber)['GLOBSTAR'] : T;
    /** Replace a wildcard or globstar Symbol with a string representation. */
    static replaceGlobSymbol<T extends PropertyKey>(item: T): T extends (typeof ObjectGlobber)['WILDCARD'] ? typeof CONST.WildcardString : T extends (typeof ObjectGlobber)['GLOBSTAR'] ? typeof CONST.GlobstarString : T;
}
declare namespace ObjectGlobber {
    /** Represents a glob wildcard path element, usually expressed as `*` */
    const WILDCARD: unique symbol;
    /** Represents a globstar (recursive wildcard) path element, usually expressed as `**` */
    const GLOBSTAR: unique symbol;
    type WalkIteratee = (value: unknown, path: PropertyKey[]) => void;
    type MatchTest<T = unknown> = (value: T, thisKey: PropertyKey, matchedWith: PropertyKey) => boolean;
}
export default ObjectGlobber;
