import { IChatGroupEntity } from "../../models/Chat_group_entity";

export interface ICreateChatGroupUseCase{
    execute(data:{hostedGameId:string;hostUserId:string}):Promise<IChatGroupEntity>
}