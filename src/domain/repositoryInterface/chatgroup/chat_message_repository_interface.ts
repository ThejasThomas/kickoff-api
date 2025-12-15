import { IChatMessageEntity } from "../../models/chat_message_entity";

export interface IChatMessageRepository {
  createMessage(message: IChatMessageEntity): Promise<IChatMessageEntity>;
  getMessageByGroupId(groupId: string): Promise<IChatMessageEntity[]>;
}
