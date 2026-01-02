"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerWalletModel = void 0;
const mongoose_1 = require("mongoose");
const OwnerWalletSchema = new mongoose_1.Schema({
    ownerId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });
exports.OwnerWalletModel = (0, mongoose_1.model)("OwnerWallet", OwnerWalletSchema);
