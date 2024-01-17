"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Datasworn ID elements that represent specific types of Datasworn object.
 */
var TypeElements;
(function (TypeElements) {
    /**
     * ID type element representing a collection. It must be followed by a second ID element indicating its subtype.
     */
    TypeElements.Collection = 'collections';
    let Collectable;
    (function (Collectable) {
        /** ID type elements for types that can exist in recursive collections. */
        Collectable.Recursive = ['oracles', 'atlas', 'npcs'];
        /** ID type elements for types that can exist in non-recursive collections. */
        Collectable.NonRecursive = ['moves', 'assets'];
        /** Union of ID type elements for types that can exist in recursive or non-recursive collections. */
        Collectable.Any = [...Collectable.NonRecursive, ...Collectable.Recursive];
    })(Collectable = TypeElements.Collectable || (TypeElements.Collectable = {}));
    /** ID type elements for types that don't use collections at all. */
    TypeElements.NonCollectable = [
        'delve_sites',
        'site_themes',
        'site_domains',
        'truths',
        'rarities'
    ];
    TypeElements.AnyPrimary = [
        ...Collectable.Any,
        ...TypeElements.NonCollectable,
        TypeElements.Collection
    ];
})(TypeElements || (TypeElements = {}));
exports.default = TypeElements;
