import { IChatMessageEntity } from "../../models/chat_message_entity";

export interface IGetChatMessageUseCase{
    execute(groupId:string):Promise<IChatMessageEntity[]>
}