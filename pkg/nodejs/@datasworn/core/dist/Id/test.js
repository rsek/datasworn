"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IdParser_js_1 = require("../IdParser.js");
const recursiveCollectionString = 'sundered_isles/collections/oracles/core';
const recursiveCollectableString = 'sundered_isles/oracles/core/action';
const nonRecursiveCollectionString = 'starforged/collections/moves/combat';
const nonRecursiveCollectableString = 'starforged/moves/combat/strike';
const nonCollectableString = 'delve/site_themes/hallowed';
const recursiveCollectableId = IdParser_js_1.IdParser.from(recursiveCollectableString);
const nonRecursiveCollectionId = IdParser_js_1.IdParser.from(nonRecursiveCollectionString);
const recursiveCollectionId = IdParser_js_1.IdParser.from(recursiveCollectionString);
const nonRecursiveCollectableId = IdParser_js_1.IdParser.from(nonRecursiveCollectableString);
const nonCollectableId = IdParser_js_1.IdParser.from(nonCollectableString);
for (const id of [
    recursiveCollectableId,
    recursiveCollectionId,
    nonRecursiveCollectableId,
    nonRecursiveCollectionId,
    nonCollectableId
])
    console.log(id.toString(), id.toPath().join('.'));
