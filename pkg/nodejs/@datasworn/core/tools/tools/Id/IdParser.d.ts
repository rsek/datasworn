import type * as Datasworn from '../../../Datasworn.js';
import ObjectGlobPath from '../ObjectGlobPath/ObjectGlobPath.js';
import { type PathForId } from '../ObjectGlobPath/Path.js';
import type * as Id from './StringTemplateLiterals.js';
import { type ExtractIdAncestorKeys, type ExtractRulesPackageId, type ExtractIdSelfKey, type ExtractTypeElements, type RootKeyForId, type TypeForId } from './Utils.js';
import type * as IdElements from './IdElements/index.js';
declare class IdParser<T extends Id.AnyId = Id.AnyId> implements IdParser.Options<T> {
    #private;
    /** An optional reference to the Datasworn tree object. Used as the default value for several traversal methods. */
    static datasworn: Record<string, Datasworn.RulesPackage> | null;
    get id(): T;
    valueOf(): T;
    get matcher(): any;
    get rulesPackage(): IdParser.Options<T>['rulesPackage'];
    get typeElements(): IdParser.Options<T>['typeElements'];
    get collectionKeys(): IdParser.Options<T>['collectionKeys'];
    get key(): IdParser.Options<T>['key'];
    get recursive(): boolean;
    get wildcard(): boolean;
    get collectable(): this['typeElements'] extends [
        IdElements.TypeElements.Collectable.Any
    ] ? true : false;
    get collection(): boolean;
    get typeRootKey(): RootKeyForId<T>;
    toPath(): ObjectGlobPath<PathForId<T>>;
    /**
     * Retrieves the object referenced by this ID.
     * @throws If the ID is a wildcard ID (use {@link IdParser.getMatches} instead), or if the referenced object doesn't exist.
     */
    get(tree?: Record<string, Datasworn.RulesPackage>): TypeForId<T>;
    /**
     * Retrieves all objects referenced by this wildcard ID.
     */
    getMatches(tree?: Record<string, Datasworn.RulesPackage>): TypeForId<T>[];
    /**
     *
     * @param id The ID string to be parsed.
     */
    constructor(id: T);
    /**
     *
     * @param options Options for construction an ID.
     */
    constructor(options: IdParser.Options<T>);
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found.
     */
    static get<Id extends Id.AnyId>(id: Id | IdParser.Options<Id> | IdParser<Id>, tree?: Record<string, Datasworn.RulesPackage>): TypeForId<Id>;
    static getMatches<Id extends Id.AnyId>(id: Id | IdParser<Id>, tree?: Record<string, Datasworn.RulesPackage>): TypeForId<Id>[];
    toString(): T;
    toJSON(): T;
    /**
     * Parses a Datasworn string ID into substrings and returns an object identifying each substring.
     * @param id The Datasworn ID to parse.
     */
    static parse<Id extends Id.AnyId>(id: Id): IdParser.Options<Id>;
    /** Converts an ID to an array of strings representing the properties needed to reach the identified object. */
    static toPath<T extends Id.AnyId>(id: T | IdParser<T>): ObjectGlobPath<PathForId<T>>;
}
declare namespace IdParser {
    interface Options<T extends Id.AnyId = Id.AnyId> {
        rulesPackage: ExtractRulesPackageId<T>;
        typeElements: ExtractTypeElements<T>;
        collectionKeys: ExtractIdAncestorKeys<T>;
        key: ExtractIdSelfKey<T>;
    }
}
export default IdParser;
