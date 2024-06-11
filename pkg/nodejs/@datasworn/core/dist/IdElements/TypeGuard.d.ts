/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */
import CONST from './CONST.js';
import type * as Id from '../StringId.js';
import type { DictKey } from '../Datasworn.js';
import TypeId from './TypeId.js';
declare namespace TypeGuard {
    function IndexKey(value: string): value is `${number}`;
    function DictKey(value: unknown): value is DictKey;
    function RulesPackageId(value: unknown): value is Id.RulesPackageId;
    function Wildcard(value: unknown): value is CONST.WildcardString;
    function Globstar(value: unknown): value is CONST.GlobstarString;
    function AnyWildcard(value: unknown): value is CONST.WildcardString | CONST.GlobstarString;
    function CollectionType(value: unknown): value is TypeId.Collection;
    function NonCollectableType(value: unknown): value is TypeId.NonCollectable;
    function CollectableType(value: unknown): value is TypeId.Collectable;
    function EmbedOnlyType(value: unknown): value is TypeId.EmbedOnlyTypes;
    function EmbeddablePrimaryType(value: unknown): value is TypeId.EmbeddablePrimaryTypes;
    function AnyPrimaryType(value: unknown): value is TypeId.NonCollectable | TypeId.Collectable | TypeId.Collection;
}
export default TypeGuard;
