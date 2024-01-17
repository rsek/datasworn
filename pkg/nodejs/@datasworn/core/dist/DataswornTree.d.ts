import { type RulesPackage } from './Datasworn.js';
/** The Datasworn data tree. This is the root object that contains all RulesPackage objects, keyed by their IDs. */
export declare class DataswornTree extends Map<string, RulesPackage> {
    constructor(...rulesPackages: RulesPackage[]);
    /** Adds rules packages to the tree, using their id property as the key. */
    add(...rulesPackages: RulesPackage[]): this;
    set(key: string, value: RulesPackage): this;
}
