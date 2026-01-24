"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BookingSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: "Client",
        required: true,
    },
    turfId: {
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
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "none",
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: false,
    },
    adminCommissionProcessed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
