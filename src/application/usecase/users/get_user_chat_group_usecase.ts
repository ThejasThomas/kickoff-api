import { inject, injectable } from "tsyringe";
import { IChatGroupRepository } from "../../../domain/repositoryInterface/chatgroup/chat_group_repository_interface";
import { IGetUserChatGroupsUseCase } from "../../../domain/useCaseInterfaces/users/get_user_caht_group_interface";
import { IChatGroupMembersEntity } from "../../../domain/models/chat_group_members_entity";

@injectable()
export class GetUserChatGroupUseCase implements IGetUserChatGroupsUseCase{
    constructor(
        @inject("IChatGroupRepository")
        private _chatGroupRepo:IChatGroupRepository
    ){}
    async execute(userId: string): Promise<IChatGroupMembersEntity[]> {
        return this._chatGroupRepo.findGroupsByUserId(userId)
    }
    
}