import type TypeId from '../IdElements/TypeId.js';
import { type AnyId, type RulesPackageId, type NonCollectableId, type CollectableId, type CollectionId } from '../StringId.js';
import { type CollectionAncestorKeys, type CollectionPathKeys, type CollectableAncestorKeys } from '../IdElements/PathKeys.js';
import { type Split } from './String.js';
import type CONST from '../IdElements/CONST.js';
import type { PathKeys } from '../IdElements/index.js';
export type AnyCollectionKeys = CollectionAncestorKeys | CollectionPathKeys;
export type ExtractTypeId<T extends AnyId> = T extends NonCollectableId ? ExtractNonCollectableTypeId<T> : T extends CollectableId ? ExtractCollectableTypeId<T> : T extends CollectionId ? ExtractCollectionTypeId<T> : never;
type ExtractNonCollectableTypeId<T extends NonCollectableId> = Split<T, CONST.PrefixSep> extends [
    infer TypeId extends TypeId.NonCollectable,
    ...string[]
] ? TypeId : never;
type ExtractCollectableTypeId<T extends CollectableId> = Split<T, CONST.PrefixSep> extends [
    infer TypeId extends TypeId.Collectable,
    ...string[]
] ? TypeId : never;
type ExtractCollectionTypeId<T extends CollectionId> = Split<T, CONST.PrefixSep> extends [
    infer TypeId extends TypeId.Collection,
    ...string[]
] ? TypeId : never;
type ExtractPath<T extends AnyId> = Split<T, CONST.PrefixSep> extends [string, infer U extends string] ? U : never;
type ExtractPrimaryPath<T extends AnyId> = Split<ExtractPath<T>, CONST.PathTypeSep> extends [
    infer U extends string,
    ...string[]
] ? U : Split<ExtractPath<T>, CONST.PathTypeSep> extends [infer U extends string] ? U : never;
export type ExtractRulesPackage<T extends AnyId> = Split<ExtractPrimaryPath<T>> extends [
    infer RulesPackage extends RulesPackageId,
    TypeId.AnyPrimary,
    ...string[]
] ? RulesPackage : never;
export type ExtractPathKeys<T extends AnyId> = Split<ExtractPath<T>>;
export type ExtractPrimaryPathKeys<T extends AnyId> = Split<ExtractPrimaryPath<T>>;
export type ExtractPrimaryKey<T extends AnyId> = ExtractPrimaryPathKeys<T> extends [infer U extends string] ? U : ExtractPrimaryPathKeys<T> extends [...string[], infer U extends string] ? U : never;
export type ExtractPrimaryAncestorKeys<T extends AnyId> = T extends CollectionId ? ExtractPrimaryPathKeys<T> extends [
    ...infer U extends PathKeys.CollectionAncestorKeys,
    string
] ? U : T extends CollectableId ? ExtractPrimaryPathKeys<T> extends [
    ...infer U extends PathKeys.CollectableAncestorKeys,
    string
] ? U : never : T extends NonCollectableId ? [] : never : never;
export type ExtractKey<T extends AnyId> = Split<T> extends [
    TypeId.AnyPrimary,
    RulesPackageId,
    ...string[],
    infer Key extends string
] ? Key : Split<T> extends [
    TypeId.AnyPrimary,
    RulesPackageId,
    infer Key extends string
] ? Key : never;
export type ExtractAncestorKeys<T extends AnyId> = T extends CollectableId ? ExtractCollectionAncestorKeys<T> : T extends CollectableId ? ExtractCollectableAncestorKeys<T> : Split<T> extends [
    RulesPackageId,
    TypeId.AnyPrimary,
    ...infer AncestorKeys extends string[],
    string
] ? AncestorKeys : Split<T> extends [RulesPackageId, TypeId.AnyPrimary, string] ? [] : never;
export type ExtractParentCollectionKey<T extends CollectableId> = Split<T> extends [
    RulesPackageId,
    TypeId.Collectable,
    infer ParentCollectionKey extends string,
    string
] ? ParentCollectionKey : never;
type ExtractCollectionAncestorKeys<T extends CollectableId> = Split<T> extends [
    RulesPackageId,
    TypeId.Collection,
    ...infer AncestorKeys extends CollectionAncestorKeys,
    string
] ? AncestorKeys : never;
type ExtractCollectableAncestorKeys<T extends CollectableId> = Split<T> extends [
    RulesPackageId,
    TypeId.Collectable,
    ...infer AncestorKeys extends CollectableAncestorKeys,
    string
] ? AncestorKeys : never;
export {};
