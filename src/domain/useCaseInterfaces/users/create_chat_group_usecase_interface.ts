import { IChatGroupDTO } from "../../../application/dtos/chat_group_dto";

export interface ICreateChatGroupUseCase{
    execute(data:{hostedGameId:string;hostUserId:string}):Promise<IChatGroupDTO>
}