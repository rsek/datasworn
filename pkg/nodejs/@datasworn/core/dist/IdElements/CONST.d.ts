declare namespace CONST {
    /** The maximum depth for nesting collections, relative to the root dictionary for its type */
    const COLLECTION_DEPTH_MAX: 4;
    type COLLECTION_DEPTH_MAX = typeof COLLECTION_DEPTH_MAX;
    const COLLECTION_DEPTH_MIN: 1;
    type COLLECTION_DEPTH_MIN = typeof COLLECTION_DEPTH_MIN;
    const PACKAGE_ID_LENGTH_MIN: 3;
    type PACKAGE_ID_LENGTH_MIN = typeof PACKAGE_ID_LENGTH_MIN;
    /** The separator character for Datasworn IDs. */
    const PathKeySep: "/";
    type PathKeySep = typeof PathKeySep;
    const TypeSep: ".";
    type TypeSep = typeof TypeSep;
    const PrefixSep: ":";
    type PrefixSep = typeof PrefixSep;
    /** The wildcard character for Datasworn IDs that matches any key in a dictionary object. */
    const WildcardString: "*";
    type WildcardString = typeof WildcardString;
    /** A globstar (recursive wildcard) representing any number of levels of in recursive collections. */
    const GlobstarString: "**";
    type GlobstarString = typeof GlobstarString;
    /** Key in Collection that contains a dictionary object of child collections. */
    const CollectionsKey = "collections";
    type CollectionsKey = typeof CollectionsKey;
    /** Key in Collection that contains a dictionary object of collectable items. */
    const ContentsKey: "contents";
    type ContentsKey = typeof ContentsKey;
}
export default CONST;
