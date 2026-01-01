import { IChatMessageEntity } from "../../models/chat_message_entity";

export interface ISaveChatMessageUseCase{
    execute(data:{groupId:string;senderId:string;text:string;replyTo?:{messageId:string;senderId:string;text:string}}):Promise<IChatMessageEntity>
}