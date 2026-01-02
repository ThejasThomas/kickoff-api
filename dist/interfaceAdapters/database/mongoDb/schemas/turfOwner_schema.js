"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turfOwnerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.turfOwnerSchema = new mongoose_1.Schema({
    userId: { type: String, unique: true },
    ownerName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "turfOwner" },
    status: {
        type: String,
        enum: ["active", "blocked", "pending"],
        default: "pending",
    },
    googleId: { type: String },
    profileImage: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
}, { timestamps: true });
