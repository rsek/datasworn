"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST;
(function (CONST) {
    /** The maximum depth for nesting collections, relative to the root dictionary for its type */
    CONST.RECURSIVE_PATH_ELEMENTS_MAX = 3;
    CONST.RECURSIVE_PATH_ELEMENTS_MIN = 1;
    CONST.PACKAGE_ID_LENGTH_MIN = 3;
    /** The separator character for Datasworn IDs. */
    CONST.Sep = '/';
    CONST.PropSep = '.';
    CONST.KeySep = CONST.Sep;
    /** The wildcard character for Datasworn IDs that matches any key in a dictionary object. */
    CONST.WildcardString = '*';
    /** A globstar (recursive wildcard) representing any number of levels of in recursive collections. */
    CONST.GlobstarString = '**';
    /** Key in RecursiveCollection that contains a dictionary object of child collections. */
    CONST.CollectionsKey = 'collections';
    /** Key in Collection that contains a dictionary object of collectable items. */
    CONST.ContentsKey = 'contents';
})(CONST || (CONST = {}));
exports.default = CONST;
