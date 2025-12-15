import { IChatGroupEntity } from "../../models/Chat_group_entity";
import { IChatGroupMembersEntity } from "../../models/chat_group_members_entity";

export interface IChatGroupRepository{
    createGroup(data:IChatGroupEntity):Promise<IChatGroupEntity>;
    addMember(groupId:string,userId:string):Promise<void>;
    updateGroupName(groupId:string,name:string):Promise<void>;
    findByHostedGameId(gameId:string):Promise<IChatGroupEntity | null>
    findGroupsByUserId(userId:string):Promise<IChatGroupMembersEntity[]>
    findGroupByIdWithMembers(groupId:string):Promise<IChatGroupMembersEntity|null>
}