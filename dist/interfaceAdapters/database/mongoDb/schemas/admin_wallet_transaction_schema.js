"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWalletTransactionModel = void 0;
const mongoose_1 = require("mongoose");
const AdminWalletTransactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: String,
    },
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
    },
    description: {
        type: String,
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.AdminWalletTransactionModel = (0, mongoose_1.model)("AdminWalletTransaction", AdminWalletTransactionSchema);
