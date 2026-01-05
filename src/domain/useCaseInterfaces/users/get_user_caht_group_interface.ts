import { IChatGroupMembersDTO } from "../../../application/dtos/chat_members_dto";

export  interface IGetUserChatGroupsUseCase{
    execute(userId:string):Promise<IChatGroupMembersDTO[]>
}