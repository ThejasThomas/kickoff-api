import { model } from "mongoose";
import { ChatMessageSchema, IChatMessageModel } from "../schemas/chatMessage_schema";

export const ChatMessageModel = model<IChatMessageModel>(
    "ChatMessage",
    ChatMessageSchema
)