import { inject, injectable } from "tsyringe";
import { IGetChatPageDataUseCase } from "../../../domain/useCaseInterfaces/messages/getChatPageData_usecase";
import { IChatGroupRepository } from "../../../domain/repositoryInterface/chatgroup/chat_group_repository_interface";
import { IChatGroupMembersEntity } from "../../../domain/models/chat_group_members_entity";
import { IChatMessageEntity } from "../../../domain/models/chat_message_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";

@injectable()
export class GetChatPageDataUseCase implements IGetChatPageDataUseCase{
    constructor(
        @inject("IChatGroupRepository")
        private _chatGroupRepo:IChatGroupRepository,
        @inject("IChatMessageRepository")
        private _chatMessageRepo:IChatMessageRepository
    ){}

    async execute(groupId: string): Promise<{ group: IChatGroupMembersEntity; messages: IChatMessageEntity[]; }> {
        if(!groupId){
            throw new CustomError(
                ERROR_MESSAGES.GROUP_ID_REQUIRED,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const group =await this._chatGroupRepo.findGroupByIdWithMembers(groupId);

        if(!group){
            throw new CustomError(
                ERROR_MESSAGES.CHAT_GROUP_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const messages= await this._chatMessageRepo.getMessageByGroupId(groupId)

        return {group,messages}
    }
}