import type ObjectGlobPath from './ObjectGlobPath.js';
import type * as Id from '../Id/index.js';
import type CONST from '../Id/IdElements/CONST.js';
export type PathForId<T extends Id.AnyId> = (T extends Id.RecursiveCollectionId ? RecursiveCollectionPath<T> : T extends Id.RecursiveCollectableId ? RecursiveCollectablePath<T> : T extends Id.NonRecursiveCollectionId ? NonRecursiveCollectionPath<T> : T extends Id.NonRecursiveCollectableId ? NonRecursiveCollectablePath<T> : T extends Id.NonCollectableId ? NonCollectablePath<T> : never) & PropertyKey[];
export type PathForType<T extends Id.Utils.AnyIdentified> = PathForId<Id.Utils.IdForType<T>>;
type RulesPackageIdWildcard = Id.RulesPackageId | typeof ObjectGlobPath.WILDCARD;
type DictKeyWildcard = Id.DictKey | typeof ObjectGlobPath.WILDCARD;
type DictKeyGlobstar = Id.DictKey | typeof ObjectGlobPath.GLOBSTAR;
export type NonCollectablePath<T extends Id.NonCollectableId = Id.NonCollectableId> = [
    RulesPackageIdWildcard,
    Id.Utils.ExtractTypeElements<T>,
    DictKeyWildcard
];
export type NonRecursiveCollectionPath<T extends Id.NonRecursiveCollectionId = Id.NonRecursiveCollectionId> = [
    RulesPackageIdWildcard,
    Id.Utils.ExtractCollectedTypeElement<T>,
    DictKeyWildcard
];
export type NonRecursiveCollectablePath<T extends Id.NonRecursiveCollectableId = Id.NonRecursiveCollectableId> = [
    RulesPackageIdWildcard,
    Id.Utils.ExtractCollectableTypeElement<T>,
    DictKeyWildcard,
    CONST.ContentsKey,
    DictKeyWildcard
];
type RecursiveCollectionKeys = [DictKeyGlobstar] | [DictKeyWildcard, CONST.CollectionsKey, DictKeyGlobstar] | [DictKeyGlobstar, CONST.CollectionsKey, DictKeyWildcard] | [DictKeyWildcard] | [DictKeyWildcard, CONST.CollectionsKey, DictKeyWildcard] | [
    DictKeyWildcard,
    CONST.CollectionsKey,
    DictKeyWildcard,
    CONST.CollectionsKey,
    DictKeyWildcard
];
export type RecursiveCollectionPath<T extends Id.RecursiveCollectionId = Id.RecursiveCollectionId> = [
    RulesPackageIdWildcard,
    Id.Utils.ExtractCollectedTypeElement<T>,
    ...RecursiveCollectionKeys
];
export type RecursiveCollectablePath<T extends Id.RecursiveCollectableId = Id.RecursiveCollectableId> = [
    RulesPackageIdWildcard,
    Id.Utils.ExtractCollectableTypeElement<T>,
    ...RecursiveCollectionKeys,
    CONST.ContentsKey,
    DictKeyWildcard
];
export {};
