import { IChatMessageDTO } from "../../../application/dtos/chat_message_dto";

export interface IGetChatMessageUseCase{
    execute(groupId:string):Promise<IChatMessageDTO[]>
}