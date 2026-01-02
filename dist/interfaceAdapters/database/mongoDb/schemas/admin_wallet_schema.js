"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWalletModel = void 0;
const mongoose_1 = require("mongoose");
const AdminWalletSchema = new mongoose_1.Schema({
    balance: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });
exports.AdminWalletModel = (0, mongoose_1.model)("AdminWallet", AdminWalletSchema);
