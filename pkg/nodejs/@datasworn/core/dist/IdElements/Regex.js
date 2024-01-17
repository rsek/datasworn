"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Regular expressions used to validate Datasworn ID elements.
 */
var Regex;
(function (Regex) {
    Regex.DictKey = /^[a-z][a-z_]*$/;
    Regex.RulesPackageId = /^[a-z][a-z0-9_]{3,}$/;
})(Regex || (Regex = {}));
exports.default = Regex;
