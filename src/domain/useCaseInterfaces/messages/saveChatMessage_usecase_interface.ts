import { IChatMessageDTO } from "../../../application/dtos/chat_message_dto";

export interface ISaveChatMessageUseCase{
    execute(data:{groupId:string;senderId:string;text:string;replyTo?:{messageId:string;senderId:string;text:string}}):Promise<IChatMessageDTO>
}