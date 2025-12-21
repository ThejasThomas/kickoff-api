import { Server } from "socket.io";
import http from "http";
import { config } from "../../shared/config";
import { container } from "tsyringe";
import { ISaveChatMessageUseCase } from "../../domain/useCaseInterfaces/messages/saveChatMessage_usecase_interface";

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

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    socket.on("joinGroup", (groupId: string) => {
      socket.join(groupId);
      console.log(`User ${socket.id} joined group ${groupId}`);
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
            createdAt: savedMessage.createdAt,
          });
        } catch (error) {
          console.error("Failed to save message", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });

  return io;
};
