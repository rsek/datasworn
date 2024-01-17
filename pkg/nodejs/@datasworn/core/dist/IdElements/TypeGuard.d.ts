/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */
import CONST from './CONST.js';
import TypeElements from './TypeElements.js';
import type * as Id from '../Id/Strings.js';
declare namespace TypeGuard {
    function DictKey(value: unknown): value is Id.DictKey;
    function RulesPackageId(value: unknown): value is Id.RulesPackageId;
    function Wildcard(value: unknown): value is CONST.WildcardString;
    function Globstar(value: unknown): value is CONST.GlobstarString;
    function AnyWildcard(value: unknown): value is CONST.WildcardString | CONST.GlobstarString;
    function CollectionType(value: unknown): value is TypeElements.Collection;
    function NonCollectableType(value: unknown): value is TypeElements.NonCollectable;
    function CollectionSubtype(typeTuple: unknown[]): typeTuple is [TypeElements.Collection, TypeElements.Collectable.Any];
    function RecursiveCollectionSubtype(typeTuple: unknown[]): typeTuple is [
        TypeElements.Collection,
        TypeElements.Collectable.Recursive
    ];
    function NonRecursiveCollectionSubtype(typeTuple: unknown[]): typeTuple is [
        TypeElements.Collection,
        TypeElements.Collectable.NonRecursive
    ];
    function CollectableType(value: unknown): value is TypeElements.Collectable.Any;
    function AnyType(value: unknown): value is TypeElements.NonCollectable | TypeElements.Collectable.Any | TypeElements.Collection;
    function RecursiveCollectableType(value: unknown): value is TypeElements.Collectable.Recursive;
    function NonRecursiveCollectableType(value: unknown): value is TypeElements.Collectable.NonRecursive;
}
export default TypeGuard;
