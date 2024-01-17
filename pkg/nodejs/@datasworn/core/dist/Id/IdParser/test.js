"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Id_js_1 = require("./Id.js");
const recursiveCollectionId = 'sundered_isles/collections/oracles/core';
const recursiveCollectableId = 'sundered_isles/oracles/core/action';
const nonRecursiveCollectionId = 'starforged/collections/moves/combat';
const nonRecursiveCollectableId = 'starforged/moves/combat/strike';
const nonCollectableId = 'delve/site_themes/hallowed';
const testParse = [
    Id_js_1.Id.from(recursiveCollectableId),
    Id_js_1.Id.from(nonRecursiveCollectionId),
    Id_js_1.Id.from(recursiveCollectionId),
    Id_js_1.Id.from(nonRecursiveCollectableId),
    Id_js_1.Id.from(nonCollectableId)
];
for (const id of testParse)
    console.log(id.toString(), id.toPath().join('.'));
