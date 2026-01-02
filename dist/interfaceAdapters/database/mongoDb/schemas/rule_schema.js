"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RulesSchema = new mongoose_1.Schema({
    turfId: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
        index: true,
    },
    slotDuration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    weeklyRules: [
        {
            type: Map,
            of: [
                {
                    startTime: {
                        type: String,
                        required: true,
                    },
                    endTime: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    ],
    exceptions: [
        {
            date: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.RulesSchema.index({ turfId: 1 });
