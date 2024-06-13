import type TypeNode from '../TypeNode.js';
export declare function validate<T extends TypeNode.Collection, TChild extends TypeNode.CollectableOf<T>>(obj: T, collectionValidator: (childCollection: T) => boolean, collectableValidator: (child: TChild) => boolean): boolean;
