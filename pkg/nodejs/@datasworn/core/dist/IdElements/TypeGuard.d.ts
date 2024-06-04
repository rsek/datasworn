/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */
import CONST from './CONST.js';
import type * as Id from '../StringId.js';
import type { DictKey } from '../Datasworn.js';
import NodeTypeId from './NodeTypeId.js';
declare namespace TypeGuard {
    function DictKey(value: unknown): value is DictKey;
    function RulesPackageId(value: unknown): value is Id.RulesPackageId;
    function Wildcard(value: unknown): value is CONST.WildcardString;
    function Globstar(value: unknown): value is CONST.GlobstarString;
    function AnyWildcard(value: unknown): value is CONST.WildcardString | CONST.GlobstarString;
    function RecursiveCollectionType(value: unknown): value is NodeTypeId.Collection.Recursive;
    function NonRecursiveCollectionType(value: unknown): value is NodeTypeId.Collection.NonRecursive;
    function CollectionType(value: unknown): value is NodeTypeId.Collection.Any;
    function NonCollectableType(value: unknown): value is NodeTypeId.NonCollectable;
    function RecursiveCollectableType(value: unknown): value is NodeTypeId.Collectable.Recursive;
    function NonRecursiveCollectableType(value: unknown): value is NodeTypeId.Collectable.NonRecursive;
    function CollectableType(value: unknown): value is NodeTypeId.Collectable.Any;
    function AnyType(value: unknown): value is NodeTypeId.NonCollectable | NodeTypeId.Collectable.Any | NodeTypeId.Collection.Any;
}
export default TypeGuard;
