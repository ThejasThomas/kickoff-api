"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerWalletTransactionModel = void 0;
const mongoose_1 = require("mongoose");
const ownerWallet_transaction_entity_1 = require("../../../../domain/models/ownerWallet_transaction_entity");
const OwnerWalletTransactionSchema = new mongoose_1.Schema({
    ownerId: {
        type: String,
        required: true,
        index: true,
    },
    turfId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Turf",
        required: true,
        index: true,
    },
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bookings",
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(ownerWallet_transaction_entity_1.OwnerWalletTransactionType),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(ownerWallet_transaction_entity_1.OwnerWalletTransactionStatus),
        required: true,
    },
    transactionDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: true });
exports.OwnerWalletTransactionModel = (0, mongoose_1.model)("OwnerWalletTransaction", OwnerWalletTransactionSchema);
