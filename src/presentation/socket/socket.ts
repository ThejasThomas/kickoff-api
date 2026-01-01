import { Server } from "socket.io";
import http from "http";
import { config } from "../../shared/config";
import { container } from "tsyringe";
import { ISaveChatMessageUseCase } from "../../domain/useCaseInterfaces/messages/saveChatMessage_usecase_interface";
import { IDeleteChatMessageUseCase } from "../../domain/useCaseInterfaces/messages/delete_chat_message_usecase";

const onlineUsers = new Map<string, Set<string>>();

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: config.cors.FRONTEND_URL,
      credentials: true,
    },
  });
  const SaveChatMessageUseCase = container.resolve<ISaveChatMessageUseCase>(
    "ISaveChatMessageUseCase"
  );
  const DeleteChatMessageUseCase = container.resolve<IDeleteChatMessageUseCase>(
    "IDeleteChatMessageUseCase"
  );

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    socket.on("joinGroup", (groupId: string) => {
      socket.join(groupId);
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit("onlineUsers", onlineUserIds);
      console.log(`User ${socket.id} joined group ${groupId}`);
    });
    socket.on("typing", (data: { groupId: string; userId: string }) => {
      socket.to(data.groupId).emit("userTyping", {
        userId: data.userId,
        isTyping: true,
      });
    });

    socket.on("stopTyping", (data: { groupId: string; userId: string }) => {
      socket.to(data.groupId).emit("userTyping", {
        userId: data.userId,
        isTyping: false,
      });
    });
    socket.on("registerUser", (userId: string) => {
      socket.data.userId = userId;

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId)!.add(socket.id);

      io.emit("userOnline", { userId });
    });

    socket.on(
      "sendMessage",
      async (data: { groupId: string; senderId: string; text: string }) => {
        try {
          const savedMessage = await SaveChatMessageUseCase.execute(data);

          io.to(data.groupId).emit("newMessage", {
            id: savedMessage._id?.toString(),
            groupId: savedMessage.groupId,
            senderId: savedMessage.senderId,
            text: savedMessage.text,
            replyTo:savedMessage.replyTo??null,
            createdAt: savedMessage.createdAt,
          });
        } catch (error) {
          console.error("Failed to save message", error);
        }
      }
    );
    socket.on(
      "deleteMessage",
      async (data: { messageId: string; groupId: string; userId: string }) => {
        console.log('hry brosss')
        try {
          await DeleteChatMessageUseCase.execute(data.messageId, data.userId);

          io.to(data.groupId).emit("messageDeleted", {
            messageId: data.messageId,
          });
        } catch (err) {
          socket.emit("deleteError", {
            message: "Cannot delete message",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (!userId) return;

      const userSockets = onlineUsers.get(userId);
      if (!userSockets) return;

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
