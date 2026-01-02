"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageModel = void 0;
const mongoose_1 = require("mongoose");
const chatMessage_schema_1 = require("../schemas/chatMessage_schema");
exports.ChatMessageModel = (0, mongoose_1.model)("ChatMessage", chatMessage_schema_1.ChatMessageSchema);
