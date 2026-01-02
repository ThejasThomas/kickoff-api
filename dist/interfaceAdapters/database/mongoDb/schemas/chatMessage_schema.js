"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ChatMessageSchema = new mongoose_1.Schema({
    groupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "ChatGroup",
        index: true
    },
    senderId: {
        type: String,
        required: true,
        index: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    replyTo: {
        messageId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ChatMessage"
        },
        senderId: {
            type: String
        },
        text: {
            type: String
        }
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
