"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostedGameModel = exports.HostedGameSchema = void 0;
const mongoose_1 = require("mongoose");
const PlayerSchema = new mongoose_1.Schema({
    userId: String,
    status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending",
    },
    paymentId: String,
    joinedDate: Date,
}, { _id: false });
exports.HostedGameSchema = new mongoose_1.Schema({
    hostUserId: { type: String, required: true },
    turfId: {
        type: String,
        required: true,
    },
    courtType: {
        type: String,
        required: true,
    },
    slotDate: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    pricePerPlayer: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    gameStartAt: {
        type: Date,
        required: true,
        index: true
    },
    players: {
        type: [PlayerSchema],
        default: []
    },
    status: {
        type: String,
        enum: ["open", "full", "cancelled", "completed", "pending_cancel"],
        default: "open",
    }
}, { timestamps: true });
exports.HostedGameModel = (0, mongoose_1.model)("HosteGame", exports.HostedGameSchema);
