import { IChatGroupMembersEntity } from "../../models/chat_group_members_entity";

export  interface IGetUserChatGroupsUseCase{
    execute(userId:string):Promise<IChatGroupMembersEntity[]>
}