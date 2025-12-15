import { IChatGroupMembersEntity } from "../../models/chat_group_members_entity"
import { IChatMessageEntity } from "../../models/chat_message_entity";

export interface IGetChatPageDataUseCase{
    execute(groupId:string):Promise<{
        group:IChatGroupMembersEntity;
        messages:IChatMessageEntity[]
    }>
}