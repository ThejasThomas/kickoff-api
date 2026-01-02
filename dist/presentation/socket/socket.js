"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const config_1 = require("../../shared/config");
const tsyringe_1 = require("tsyringe");
const onlineUsers = new Map();
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: config_1.config.cors.FRONTEND_URL,
            credentials: true,
        },
    });
    const SaveChatMessageUseCase = tsyringe_1.container.resolve("ISaveChatMessageUseCase");
    const DeleteChatMessageUseCase = tsyringe_1.container.resolve("IDeleteChatMessageUseCase");
    io.on("connection", (socket) => {
        console.log(" User connected:", socket.id);
        socket.on("joinGroup", (groupId) => {
            socket.join(groupId);
            const onlineUserIds = Array.from(onlineUsers.keys());
            socket.emit("onlineUsers", onlineUserIds);
            console.log(`User ${socket.id} joined group ${groupId}`);
        });
        socket.on("typing", (data) => {
            socket.to(data.groupId).emit("userTyping", {
                userId: data.userId,
                isTyping: true,
            });
        });
        socket.on("stopTyping", (data) => {
            socket.to(data.groupId).emit("userTyping", {
                userId: data.userId,
                isTyping: false,
            });
        });
        socket.on("registerUser", (userId) => {
            socket.data.userId = userId;
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId).add(socket.id);
            io.emit("userOnline", { userId });
        });
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                const savedMessage = yield SaveChatMessageUseCase.execute(data);
                io.to(data.groupId).emit("newMessage", {
                    id: (_a = savedMessage._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    groupId: savedMessage.groupId,
                    senderId: savedMessage.senderId,
                    text: savedMessage.text,
                    replyTo: (_b = savedMessage.replyTo) !== null && _b !== void 0 ? _b : null,
                    createdAt: savedMessage.createdAt,
                });
            }
            catch (error) {
                console.error("Failed to save message", error);
            }
        }));
        socket.on("deleteMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('hry brosss');
            try {
                yield DeleteChatMessageUseCase.execute(data.messageId, data.userId);
                io.to(data.groupId).emit("messageDeleted", {
                    messageId: data.messageId,
                });
            }
            catch (err) {
                socket.emit("deleteError", {
                    message: "Cannot delete message",
                });
            }
        }));
        socket.on("disconnect", () => {
            const userId = socket.data.userId;
            if (!userId)
                return;
            const userSockets = onlineUsers.get(userId);
            if (!userSockets)
                return;
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
                io.emit("userOffline", { userId });
            }
            console.log("User disconnected:", userId);
        });
    });
    return io;
};
exports.initSocket = initSocket;
