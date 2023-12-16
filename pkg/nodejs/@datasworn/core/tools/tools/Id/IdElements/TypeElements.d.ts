/**
 * Datasworn ID elements that represent specific types of Datasworn object.
 */
declare namespace TypeElements {
    /**
     * ID type element representing a collection. It must be followed by a second ID element indicating its subtype.
     */
    const Collection: "collections";
    type Collection = typeof Collection;
    namespace Collectable {
        /** ID type elements for types that can exist in recursive collections. */
        const Recursive: readonly ["oracles", "atlas", "npcs"];
        type Recursive = (typeof Recursive)[number];
        /** ID type elements for types that can exist in non-recursive collections. */
        const NonRecursive: readonly ["moves", "assets"];
        type NonRecursive = (typeof NonRecursive)[number];
        /** Union of ID type elements for types that can exist in recursive or non-recursive collections. */
        const Any: readonly ["moves", "assets", "oracles", "atlas", "npcs"];
        type Any = Recursive | NonRecursive;
    }
    namespace CollectionSubtype {
        type Any<T extends Collectable.Any = Collectable.Any> = [
            Collection,
            T
        ];
        type RecursiveSubtype<T extends Collectable.Recursive = Collectable.Recursive> = Any<T>;
        type NonRecursiveSubtype<T extends Collectable.NonRecursive = Collectable.NonRecursive> = Any<T>;
    }
    /** ID type elements for types that don't use collections at all. */
    const NonCollectable: readonly ["delve_sites", "site_themes", "site_domains", "truths", "rarities"];
    type NonCollectable = (typeof NonCollectable)[number];
    const AnyPrimary: readonly ["moves", "assets", "oracles", "atlas", "npcs", "delve_sites", "site_themes", "site_domains", "truths", "rarities", "collections"];
    type AnyPrimary = Collectable.Any | NonCollectable | Collection;
    /** A type element tuple representing a fully-qualified type. The first element is the primary type. Some types have a second element that indicates a subtype.  */
    type AnyTuple = [Collectable.Any] | [NonCollectable] | CollectionSubtype.Any;
}
export default TypeElements;
