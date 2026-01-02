"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationRequestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CancellationRequestSchema = new mongoose_1.Schema({
    bookingId: { type: String },
    hostedGameId: { type: String },
    userId: { type: String, required: true },
    ownerId: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, { timestamps: true });
// export const CancellationRequestModel = model<ICancellationRequestEntity>(
//   "CancellationRequest",
//   CancellationRequestSchema
// );
