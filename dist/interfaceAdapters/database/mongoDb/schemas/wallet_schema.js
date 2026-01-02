"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = exports.WalletSchema = void 0;
const mongoose_1 = require("mongoose");
exports.WalletSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
}, { timestamps: true });
exports.WalletModel = (0, mongoose_1.model)("Wallet", exports.WalletSchema);
