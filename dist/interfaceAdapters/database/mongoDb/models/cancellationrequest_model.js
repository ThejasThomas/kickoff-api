"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationRequestModel = void 0;
const mongoose_1 = require("mongoose");
const cancellationRequest_schema_1 = require("../schemas/cancellationRequest_schema");
exports.CancellationRequestModel = (0, mongoose_1.model)('CancellationRequests', cancellationRequest_schema_1.CancellationRequestSchema);
