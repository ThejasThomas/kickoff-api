"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ReviewSchema = new mongoose_1.Schema({
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
        index: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    }
}, { timestamps: true });
