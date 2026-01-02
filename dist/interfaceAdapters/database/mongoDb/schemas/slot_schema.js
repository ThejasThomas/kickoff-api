"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SlotSchema = new mongoose_1.Schema({
    turfId: {
        type: String,
        ref: "Turf",
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
exports.SlotSchema.index({ turfId: 1, date: 1, startTime: 1 }, { unique: true });
