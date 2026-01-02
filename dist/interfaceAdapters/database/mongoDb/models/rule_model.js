"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleModel = void 0;
const mongoose_1 = require("mongoose");
const rule_schema_1 = require("../schemas/rule_schema");
exports.RuleModel = (0, mongoose_1.model)('Rules', rule_schema_1.RulesSchema);
