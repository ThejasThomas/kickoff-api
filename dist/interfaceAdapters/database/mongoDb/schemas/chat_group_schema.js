"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGroupModel = exports.chatGroupSchema = void 0;
const mongoose_1 = require("mongoose");
exports.chatGroupSchema = new mongoose_1.Schema({
    hostedGameId: {
        type: String,
        required: true,
        ref: "HostedGame",
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    adminId: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true,
        default: []
    }
}, {
    timestamps: true
});
exports.ChatGroupModel = (0, mongoose_1.model)("ChatGroup", exports.chatGroupSchema);
