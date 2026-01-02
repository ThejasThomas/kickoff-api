"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = exports.WalletTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
const wallet_transaction_entity_1 = require("../../../../domain/models/wallet_transaction_entity");
const wallet_entity_1 = require("../../../../domain/models/wallet_entity");
const wallet_schema_1 = require("./wallet_schema");
exports.WalletTransactionSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(wallet_entity_1.WalletTransactionType),
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
        required: true,
        enum: Object.values(wallet_transaction_entity_1.WalletTransactionStatus),
    },
    transaction_date: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.WalletModel = (0, mongoose_1.model)("Wallet", wallet_schema_1.WalletSchema);
