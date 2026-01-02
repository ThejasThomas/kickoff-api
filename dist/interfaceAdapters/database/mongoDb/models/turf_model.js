"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurfModel = void 0;
const mongoose_1 = require("mongoose");
const turf_schema_1 = require("../schemas/turf_schema");
exports.TurfModel = (0, mongoose_1.model)('Turf', turf_schema_1.TurfSchema);
