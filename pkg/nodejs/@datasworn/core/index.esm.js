var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/pkg-core/tools/index.ts
var tools_exports = {};
__export(tools_exports, {
  Id: () => Id_exports
});

// src/pkg-core/tools/Id/index.ts
var Id_exports = {};
__export(Id_exports, {
  Errors: () => Errors_exports,
  IdElements: () => IdElements_exports,
  IdParser: () => IdParser_default,
  Utils: () => Utils_exports
});

// src/pkg-core/tools/Id/Errors.ts
var Errors_exports = {};
__export(Errors_exports, {
  ParseError: () => ParseError
});
var ParseError = class extends Error {
  constructor(id, message) {
    super(`Unable to parse Datasworn ID "${id}": ${message}`);
  }
};

// src/pkg-core/tools/Id/IdElements/index.ts
var IdElements_exports = {};
__export(IdElements_exports, {
  CONST: () => CONST_default,
  Regex: () => Regex_default,
  TypeElements: () => TypeElements_default,
  TypeGuard: () => TypeGuard_default
});

// src/pkg-core/tools/Id/IdElements/TypeElements.ts
var TypeElements;
((TypeElements2) => {
  TypeElements2.Collection = "collections";
  let Collectable;
  ((Collectable2) => {
    Collectable2.Recursive = ["oracles", "atlas", "npcs"];
    Collectable2.NonRecursive = ["moves", "assets"];
    Collectable2.Any = [...Collectable2.NonRecursive, ...Collectable2.Recursive];
  })(Collectable = TypeElements2.Collectable || (TypeElements2.Collectable = {}));
  TypeElements2.NonCollectable = [
    "delve_sites",
    "site_themes",
    "site_domains",
    "truths",
    "rarities"
  ];
  TypeElements2.AnyPrimary = [
    ...Collectable.Any,
    ...TypeElements2.NonCollectable,
    TypeElements2.Collection
  ];
})(TypeElements || (TypeElements = {}));
var TypeElements_default = TypeElements;

// src/pkg-core/tools/Id/IdElements/Regex.ts
var Regex;
((Regex2) => {
  Regex2.DictKey = /^[a-z][a-z_]*$/;
  Regex2.RulesPackageId = /^[a-z][a-z0-9_]{3,}$/;
})(Regex || (Regex = {}));
var Regex_default = Regex;

// src/pkg-core/tools/Id/IdElements/CONST.ts
var CONST;
((CONST2) => {
  CONST2.RECURSIVE_PATH_ELEMENTS_MAX = 3;
  CONST2.RECURSIVE_PATH_ELEMENTS_MIN = 1;
  CONST2.Sep = "/";
  CONST2.WildcardString = "*";
  CONST2.GlobstarString = "**";
  CONST2.CollectionsKey = "collections";
  CONST2.ContentsKey = "contents";
})(CONST || (CONST = {}));
var CONST_default = CONST;

// src/pkg-core/tools/Id/IdElements/TypeGuard.ts
var TypeGuard;
((TypeGuard2) => {
  function DictKey(value) {
    return typeof value === "string" && Regex_default.DictKey.test(value);
  }
  TypeGuard2.DictKey = DictKey;
  function RulesPackageId(value) {
    return typeof value === "string" && Regex_default.RulesPackageId.test(value);
  }
  TypeGuard2.RulesPackageId = RulesPackageId;
  function Wildcard(value) {
    return value === CONST_default.WildcardString;
  }
  TypeGuard2.Wildcard = Wildcard;
  function Globstar(value) {
    return value === CONST_default.GlobstarString;
  }
  TypeGuard2.Globstar = Globstar;
  function AnyWildcard(value) {
    return Wildcard(value) || Globstar(value);
  }
  TypeGuard2.AnyWildcard = AnyWildcard;
  function CollectionType(value) {
    return value === TypeElements_default.Collection;
  }
  TypeGuard2.CollectionType = CollectionType;
  function NonCollectableType(value) {
    return TypeElements_default.NonCollectable.includes(
      value
    );
  }
  TypeGuard2.NonCollectableType = NonCollectableType;
  function CollectionSubtype(typeTuple) {
    const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2;
    if (!isTuple)
      return false;
    const [collectionType, subtype] = typeTuple;
    return CollectionType(collectionType) && CollectableType(subtype);
  }
  TypeGuard2.CollectionSubtype = CollectionSubtype;
  function RecursiveCollectionSubtype(typeTuple) {
    const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2;
    if (!isTuple)
      return false;
    const [collectionType, subtype] = typeTuple;
    return CollectionType(collectionType) && RecursiveCollectableType(subtype);
  }
  TypeGuard2.RecursiveCollectionSubtype = RecursiveCollectionSubtype;
  function NonRecursiveCollectionSubtype(typeTuple) {
    const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2;
    if (!isTuple)
      return false;
    const [collectionType, subtype] = typeTuple;
    return CollectionType(collectionType) && NonRecursiveCollectableType(subtype);
  }
  TypeGuard2.NonRecursiveCollectionSubtype = NonRecursiveCollectionSubtype;
  function CollectableType(value) {
    return TypeElements_default.Collectable.Any.includes(
      value
    );
  }
  TypeGuard2.CollectableType = CollectableType;
  function AnyType(value) {
    return NonCollectableType(value) || CollectableType(value) || CollectionType(value);
  }
  TypeGuard2.AnyType = AnyType;
  function RecursiveCollectableType(value) {
    return TypeElements_default.Collectable.Recursive.includes(
      value
    );
  }
  TypeGuard2.RecursiveCollectableType = RecursiveCollectableType;
  function NonRecursiveCollectableType(value) {
    return TypeElements_default.Collectable.NonRecursive.includes(
      value
    );
  }
  TypeGuard2.NonRecursiveCollectableType = NonRecursiveCollectableType;
})(TypeGuard || (TypeGuard = {}));
var TypeGuard_default = TypeGuard;

// src/pkg-core/tools/Id/IdParser.ts
import nanomatch from "nanomatch";

// src/pkg-core/tools/ObjectGlobPath/arrayIs.ts
function arrayIs(a, b) {
  if (a.length !== b.length)
    return false;
  return a.every((valueA, i) => {
    const valueB = b[i];
    if (Array.isArray(valueA) && Array.isArray(valueB))
      return arrayIs(valueA, valueB);
    return Object.is(valueA, valueB);
  });
}

// src/pkg-core/tools/ObjectGlobPath/ObjectGlobPath.ts
var ObjectGlobPath = class _ObjectGlobPath extends Array {
  constructor(...items) {
    super(...items.map(_ObjectGlobPath.replaceGlobString));
  }
  /** Does this path contain any wildcard or globstar elements? */
  get wildcard() {
    return this.some(_ObjectGlobPath.isGlobElement);
  }
  toJSON() {
    return this.map(_ObjectGlobPath.replaceGlobSymbol);
  }
  clone() {
    return new _ObjectGlobPath(...this);
  }
  partitionStaticPath() {
    if (!this.wildcard)
      return [this.clone(), new _ObjectGlobPath()];
    const firstGlobIndex = this.findIndex(_ObjectGlobPath.isGlobElement);
    return [
      new _ObjectGlobPath(...this.slice(0, firstGlobIndex)),
      new _ObjectGlobPath(...this.slice(firstGlobIndex))
    ];
  }
  nearestStaticPath() {
    if (!this.wildcard)
      return this;
    const pathElements = new _ObjectGlobPath();
    for (const element of this) {
      if (element === _ObjectGlobPath.WILDCARD || element === _ObjectGlobPath.GLOBSTAR)
        break;
      else
        pathElements.push(element);
    }
    return pathElements;
  }
  step(steps = 1) {
    if (steps < 0)
      throw new Error("steps parameter can't be less than 0");
    return new _ObjectGlobPath(...this.slice(1));
  }
  getParent() {
    return new _ObjectGlobPath(...this.slice(0, this.length - 1));
  }
  getMatches(from, matchTest, matches = [], includeArrays = false) {
    if (!this.wildcard) {
      const match = this.walk(from);
      if (typeof matchTest === "function" && matchTest(match, this.last(), this.last()) || !matchTest)
        matches.push(match);
      return matches;
    }
    matches.push(
      ..._ObjectGlobPath.getMatches(from, this, { includeArrays, matchTest })
    );
    return matches;
  }
  walk(from, forEach) {
    if (this.wildcard)
      throw new Error(
        `Path contains wildcard/globstar elements. Use ${this.constructor.name}#${this.getMatches.name} instead.`
      );
    return _ObjectGlobPath.walk(from, this, forEach);
  }
  is(path) {
    if (path instanceof _ObjectGlobPath)
      return false;
    return this.every((valueA, i) => {
      const valueB = path[i];
      if (Array.isArray(valueA) && Array.isArray(valueB))
        return arrayIs(valueA, valueB);
      return Object.is(valueA, valueB);
    });
  }
  static isGlobElement(element) {
    return element === _ObjectGlobPath.WILDCARD || element === _ObjectGlobPath.GLOBSTAR;
  }
  first() {
    return this[0];
  }
  last() {
    return this[this.length - 1];
  }
  head() {
    return this.slice(1);
  }
  tail() {
    return this.slice(0, -1);
  }
  static fromId(id) {
    return new IdParser_default(id).toPath();
  }
  static getMatches(from, keys, {
    matchTest,
    includeArrays = false
  } = { includeArrays: false }) {
    const nextKey = keys[0];
    const nextPath = keys.slice(1);
    if (nextPath.length === 0)
      return this.getKeyMatches(from, nextKey, { includeArrays, matchTest });
    const matches = this.getKeyMatches(from, nextKey, {
      includeArrays
    });
    const results = [];
    for (const match of matches) {
      results.push(
        ...this.getMatches(match, nextPath, {
          matchTest,
          includeArrays
        })
      );
    }
    return results;
  }
  static getKeyMatches(from, matchKey, {
    forEachMatch,
    matchTest,
    includeArrays = false
  } = {
    includeArrays: false
  }) {
    if (!this.isPropertyKey(matchKey))
      throw new Error(
        `Expected a number, string, or symbol key, but got ${typeof matchKey}`
      );
    const results = [];
    const hasMatchTest = typeof matchTest === "function";
    switch (matchKey) {
      case _ObjectGlobPath.WILDCARD:
        for (const realKey in from) {
          if (!Object.hasOwn(from, realKey))
            continue;
          const element = from[realKey];
          if (!hasMatchTest || matchTest(element, realKey, matchKey))
            results.push(element);
        }
        break;
      case _ObjectGlobPath.GLOBSTAR:
        for (const realKey in from) {
          if (!Object.hasOwn(from, realKey))
            continue;
          const element = from[realKey];
          if (!hasMatchTest || matchTest(element, realKey, matchKey))
            results.push(element);
          if (this.isWalkable(element, includeArrays)) {
            results.push(
              ...this.getKeyMatches(element, matchKey, {
                matchTest,
                includeArrays
              })
            );
          }
        }
        break;
      default: {
        if (!(matchKey in from))
          throw new Error(
            `Unable to find key ${typeof matchKey === "symbol" ? matchKey.toString() : JSON.stringify(matchKey)}`
          );
        results.push(from[matchKey]);
      }
    }
    return results;
  }
  /** Is this value an object with recursable keys? */
  static isWalkable(value, includeArrays = false) {
    if (!includeArrays && Array.isArray(value))
      return false;
    return typeof value === "object" && !Object.is(value, null);
  }
  /** Is the value valid as an object property key? */
  static isPropertyKey(key) {
    return typeof key === "string" || typeof key === "number" || typeof key === "symbol";
  }
  static walk(from, path, forEach) {
    if (path.length === 0)
      return from;
    if (typeof forEach === "function")
      forEach(from, path);
    const [currentKey, ...nextPath] = path;
    if (!this.isPropertyKey(currentKey))
      throw new Error(
        `Expected a number, string, or symbol key, but got ${typeof currentKey}`
      );
    if (typeof from !== "object")
      throw new Error(`Expected an object but got ${typeof from}`);
    if (from == null)
      throw new Error(
        `Expected an object but got ${JSON.stringify(from)}`
      );
    let nextObject;
    if (Array.isArray(from)) {
      const currentIndex = Number(currentKey);
      if (!Number.isInteger(currentIndex))
        throw new Error(`Expected an array index but got ${currentIndex}`);
      nextObject = from[currentIndex];
    } else
      nextObject = from[currentKey];
    if (path.length === 0)
      return nextObject;
    else
      return _ObjectGlobPath.walk(nextObject, nextPath);
  }
  static getObjectPaths(object, includeArrays = false, currentPath = new _ObjectGlobPath()) {
    const results = [];
    for (const k in object) {
      if (!Object.hasOwn(object, k))
        continue;
      const nextObject = object[k];
      if (typeof nextObject !== "object")
        continue;
      if (Object.is(nextObject, null))
        continue;
      if (!includeArrays && Array.isArray(nextObject))
        continue;
      const nextPath = new _ObjectGlobPath(...currentPath, k);
      results.push(
        nextPath,
        ...this.getObjectPaths(nextObject, includeArrays, nextPath)
      );
    }
    return results;
  }
  /** Replace a wildcard/globstar string with a Symbol */
  static replaceGlobString(item) {
    switch (true) {
      case IdElements_exports.TypeGuard.Wildcard(item):
        return _ObjectGlobPath.WILDCARD;
      case IdElements_exports.TypeGuard.Globstar(item):
        return _ObjectGlobPath.GLOBSTAR;
      default:
        return item;
    }
  }
  /** Replace a wildcard or globstar Symbol with a string representation. */
  static replaceGlobSymbol(item) {
    switch (item) {
      case _ObjectGlobPath.WILDCARD:
      case _ObjectGlobPath.GLOBSTAR:
        return item.description();
      default:
        return item;
    }
  }
};
((ObjectGlobPath2) => {
  ObjectGlobPath2.WILDCARD = Symbol(CONST_default.WildcardString);
  ObjectGlobPath2.GLOBSTAR = Symbol(CONST_default.GlobstarString);
})(ObjectGlobPath || (ObjectGlobPath = {}));
var ObjectGlobPath_default = ObjectGlobPath;

// src/pkg-core/tools/Id/IdParser.ts
var IdParser = class _IdParser {
  static {
    /** An optional reference to the Datasworn tree object. Used as the default value for several traversal methods. */
    this.datasworn = null;
  }
  #source;
  get id() {
    return this.#elements.join(CONST_default.Sep);
  }
  valueOf() {
    return this.id;
  }
  get #elements() {
    return [
      this.rulesPackage,
      ...this.typeElements,
      ...this.collectionKeys,
      this.key
    ];
  }
  #resetLazyProperties() {
    this.#matcher = null;
    this.#matches = null;
    this.#path = null;
  }
  #matcher = null;
  get matcher() {
    if (this.#matcher == null) {
      const matcher = nanomatch.matcher(this.id);
      this.#matcher = matcher;
      return matcher;
    }
    return this.#matcher;
  }
  // TODO: setters validate the new value
  #rulesPackage;
  get rulesPackage() {
    return this.#rulesPackage;
  }
  // public set rulesPackage(value: IdParser.Options<T>['rulesPackage']) {
  // 	// if (!IdParser.fn(value)) throw new Error()
  // 	this.#resetLazyProperties()
  // 	this.#rulesPackage = value
  // }
  #typeElements;
  get typeElements() {
    return this.#typeElements;
  }
  // public set typeElements(value: ParsedIdBase<T>['typeElements']) {
  // 	// if (!IdParser.fn(value)) throw new Error()
  // 	this.#resetLazyProperties()
  // 	this.#typeElements = value
  // }
  #collectionKeys;
  get collectionKeys() {
    return this.#collectionKeys;
  }
  // public set collectionKeys(value: IdParser.Options<T>['collectionKeys']) {
  // 	// if (!IdParser.fn(value)) throw new Error()
  // 	this.#resetLazyProperties()
  // 	this.#collectionKeys = value
  // }
  #key;
  get key() {
    return this.#key;
  }
  // public set key(value: IdParser.Options<T>['key']) {
  // 	// if (!IdParser.fn(value)) throw new Error()
  // 	this.#resetLazyProperties()
  // 	this.#key = value
  // }
  // flag getters
  get recursive() {
    return TypeGuard_default.CollectionType(this.typeElements[0]) ? TypeGuard_default.RecursiveCollectionSubtype(this.typeElements) : TypeGuard_default.RecursiveCollectableType(this.typeElements[0]);
  }
  get wildcard() {
    return this.#elements.some(TypeGuard_default.AnyWildcard);
  }
  get collectable() {
    return TypeGuard_default.CollectableType(this.typeElements[0]);
  }
  get collection() {
    return TypeGuard_default.CollectionType(this.typeElements[0]);
  }
  get typeRootKey() {
    return this.collection ? this.typeElements[1] : this.typeElements[0];
  }
  #path = null;
  toPath() {
    if (this.#path == null) {
      const path = _IdParser.toPath(this);
      this.#path = path;
      return path;
    }
    return this.#path;
  }
  /**
   * Retrieves the object referenced by this ID.
   * @throws If the ID is a wildcard ID (use {@link IdParser.getMatches} instead), or if the referenced object doesn't exist.
   */
  get(tree = _IdParser.datasworn) {
    if (tree == null)
      throw new Error(
        `Please set the static (${_IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
      );
    return _IdParser.get(this, tree);
  }
  #matches = null;
  /**
   * Retrieves all objects referenced by this wildcard ID.
   */
  getMatches(tree = _IdParser.datasworn) {
    if (tree == null)
      throw new Error(
        `Please set the static (${_IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
      );
    if (this.#matches != null)
      return this.#matches;
    const matches = _IdParser.getMatches(this, tree);
    this.#matches = matches;
    return matches;
  }
  /**
   *
   * @param id The ID string to be parsed, or options for construction an ID.
   */
  constructor(id) {
    const parsed = typeof id === "string" ? _IdParser.parse(id) : id;
    this.#source = id;
    this.#rulesPackage = parsed.rulesPackage;
    this.#typeElements = parsed.typeElements ?? [];
    this.#collectionKeys = parsed.collectionKeys ?? [];
    this.#key = parsed.key;
  }
  /**
   * Get a Datasworn node by its ID.
   * @throws If the ID is invalid; if a path to the identified object can't be found.
   */
  static get(id, tree = _IdParser.datasworn) {
    const parsedId = id instanceof _IdParser ? id : new _IdParser(id);
    return parsedId.toPath().walk(tree);
  }
  static getMatches(id, tree = _IdParser.datasworn) {
    const parsedId = id instanceof _IdParser ? id : new _IdParser(id);
    if (!parsedId.wildcard)
      return [_IdParser.get(id, tree)];
    if (tree == null)
      throw new Error(
        `Please set the static (${_IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
      );
    return parsedId.toPath().getMatches(tree, (value) => {
      if (typeof value !== "object" || value == null)
        return false;
      if (!("id" in value))
        return false;
      const { id: id2 } = value;
      if (typeof id2 !== "string")
        return false;
      const isMatch = parsedId.matcher(id2);
      return isMatch;
    });
  }
  toString() {
    return this.valueOf();
  }
  toJSON() {
    return this.valueOf();
  }
  /**
   * Parses a Datasworn string ID into substrings and returns an object identifying each substring.
   * @param id The Datasworn ID to parse.
   */
  static parse(id) {
    const [rulesPackage, typeElement, ...collectionKeys] = id.split(
      CONST_default.Sep
    );
    const typeElements = [typeElement];
    if (!TypeGuard_default.RulesPackageId(rulesPackage) && !TypeGuard_default.Wildcard(rulesPackage))
      throw new ParseError(
        id,
        `"${String(rulesPackage)}" is not a valid Datasworn package ID.`
      );
    if (!TypeGuard_default.AnyType(typeElement))
      throw new ParseError(
        id,
        `"${typeElement}" is not a valid Datasworn type.`
      );
    if (TypeGuard_default.CollectionType(typeElement)) {
      const subtype = collectionKeys.shift();
      if (!TypeGuard_default.CollectableType(subtype))
        throw new ParseError(
          id,
          `"${subtype}" not a valid Datasworn collectable type.`
        );
      typeElements.push(subtype);
    }
    const key = collectionKeys.pop();
    let min, max;
    switch (true) {
      case TypeGuard_default.NonRecursiveCollectableType(typeElement):
        min = max = 1;
        break;
      case TypeGuard_default.RecursiveCollectableType(typeElement):
        min = 1;
        max = CONST_default.RECURSIVE_PATH_ELEMENTS_MAX;
        break;
      case TypeGuard_default.RecursiveCollectionSubtype(typeElements):
        min = 0;
        max = CONST_default.RECURSIVE_PATH_ELEMENTS_MAX - 1;
        break;
      default:
        min = max = 0;
    }
    if (collectionKeys.length > max || collectionKeys.length < min)
      throw new ParseError(
        id,
        `Expected ${min === max ? min : `${min}-${max}`} path elements before the key, but got ${collectionKeys.length}`
      );
    const collection = TypeGuard_default.CollectionType(typeElement);
    const recursive = TypeGuard_default.RecursiveCollectableType(typeElement) || TypeGuard_default.RecursiveCollectionSubtype(typeElements);
    const badCollectionKeys = collectionKeys.filter(
      (key2) => !this.#validateCollectionKey(key2, recursive)
    );
    if (badCollectionKeys.length > 0)
      throw new ParseError(
        id,
        `Received invalid ancestor collection keys: ${JSON.stringify(
          badCollectionKeys
        )}`
      );
    if (collection && !recursive && TypeGuard_default.Globstar(key))
      throw new ParseError(
        id,
        `Received a recursive wildcard as a key for a non-recursive collection type`
      );
    else if (!collection && !this.#validateKey(key))
      throw new ParseError(
        id,
        `"${key}" is not a valid Datasworn key`
      );
    return {
      rulesPackage,
      typeElements,
      collectionKeys,
      key
    };
  }
  /** Converts an ID to an array of strings representing the properties needed to reach the identified object. */
  static toPath(id) {
    const parsed = id instanceof _IdParser ? id : new _IdParser(id);
    const dotPathElements = [];
    dotPathElements.push(parsed.rulesPackage);
    dotPathElements.push(parsed.typeRootKey);
    switch (true) {
      case parsed.collection:
        for (const pathElement of parsed.collectionKeys)
          dotPathElements.push(pathElement, CONST_default.CollectionsKey);
        dotPathElements.push(parsed.key);
        break;
      case parsed.collectable:
        {
          const parentCollectionKey = parsed.collectionKeys.pop();
          for (const pathElement of parsed.collectionKeys)
            dotPathElements.push(pathElement, CONST_default.CollectionsKey);
          dotPathElements.push(parentCollectionKey, CONST_default.ContentsKey);
          dotPathElements.push(parsed.key);
        }
        break;
      default:
        dotPathElements.push(parsed.key);
        break;
    }
    return new ObjectGlobPath_default(...dotPathElements);
  }
  static #validateKey(key) {
    return TypeGuard_default.Wildcard(key) || TypeGuard_default.DictKey(key);
  }
  static #validateCollectionKey(key, recursive = false) {
    return recursive ? TypeGuard_default.Globstar(key) || this.#validateKey(key) : this.#validateKey(key);
  }
};
var IdParser_default = IdParser;

// src/pkg-core/tools/Id/Utils.ts
var Utils_exports = {};
export {
  tools_exports as Tools
};
