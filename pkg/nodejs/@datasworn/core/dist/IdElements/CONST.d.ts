declare namespace CONST {
    /** The maximum depth for nesting collections, relative to the root dictionary for its type */
    const RECURSIVE_PATH_ELEMENTS_MAX = 3;
    const RECURSIVE_PATH_ELEMENTS_MIN = 1;
    const PACKAGE_ID_LENGTH_MIN = 3;
    /** The separator character for Datasworn IDs. */
    const Sep: "/";
    type Sep = typeof Sep;
    const PropSep: ".";
    type PropSep = typeof PropSep;
    const KeySep: "/";
    type KeySep = typeof KeySep;
    /** The wildcard character for Datasworn IDs that matches any key in a dictionary object. */
    const WildcardString: "*";
    type WildcardString = typeof WildcardString;
    /** A globstar (recursive wildcard) representing any number of levels of in recursive collections. */
    const GlobstarString: "**";
    type GlobstarString = typeof GlobstarString;
    /** Key in RecursiveCollection that contains a dictionary object of child collections. */
    const CollectionsKey = "collections";
    type CollectionsKey = typeof CollectionsKey;
    /** Key in Collection that contains a dictionary object of collectable items. */
    const ContentsKey: "contents";
    type ContentsKey = typeof ContentsKey;
}
export default CONST;
