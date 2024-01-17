"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IdParser_js_1 = require("../IdParser.js");
const recursiveCollectionId = 'sundered_isles/collections/oracles/core';
const recursiveCollectableId = 'sundered_isles/oracles/core/action';
const nonRecursiveCollectionId = 'starforged/collections/moves/combat';
const nonRecursiveCollectableId = 'starforged/moves/combat/strike';
const nonCollectableId = 'delve/site_themes/hallowed';
const testParse = [
    IdParser_js_1.IdParser.from(recursiveCollectableId),
    IdParser_js_1.IdParser.from(nonRecursiveCollectionId),
    IdParser_js_1.IdParser.from(recursiveCollectionId),
    IdParser_js_1.IdParser.from(nonRecursiveCollectableId),
    IdParser_js_1.IdParser.from(nonCollectableId)
];
for (const id of testParse)
    console.log(id.toString(), id.toPath().join('.'));
