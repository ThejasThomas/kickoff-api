"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RatingSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    turfId: {
        type: String,
        required: true,
        index: true
    },
    bookingId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    hasRated: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
