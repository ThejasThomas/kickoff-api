"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurfOwnerModel = void 0;
const mongoose_1 = require("mongoose");
const turfOwner_schema_1 = require("../schemas/turfOwner_schema");
exports.TurfOwnerModel = (0, mongoose_1.model)('TurfOwner', turfOwner_schema_1.turfOwnerSchema);
