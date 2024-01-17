"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataswornTree = void 0;
/** The Datasworn data tree. This is the root object that contains all RulesPackage objects, keyed by their IDs. */
class DataswornTree extends Map {
    constructor(...rulesPackages) {
        super();
        this.add(...rulesPackages);
    }
    /** Adds rules packages to the tree, using their id property as the key. */
    add(...rulesPackages) {
        for (const rulesPackage of rulesPackages)
            this.set(rulesPackage.id, rulesPackage);
        return this;
    }
    set(key, value) {
        if (value.id !== key)
            throw new Error(`Expected a Datasworn RulesPackage object with ID "${key}", but the RulesPackage ID is ${value.id}`);
        return super.set(key, value);
    }
}
exports.DataswornTree = DataswornTree;
