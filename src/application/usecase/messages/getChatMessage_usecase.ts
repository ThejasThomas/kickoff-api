import { inject, injectable } from "tsyringe";
import { IGetChatMessageUseCase } from "../../../domain/useCaseInterfaces/messages/getChatMessageUsecase_interface";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { IChatMessageEntity } from "../../../domain/models/chat_message_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()

export class GetChatMessagesUseCase implements IGetChatMessageUseCase {
    constructor(
        @inject("IChatMessageRepository")
        private _chatMessageRepository:IChatMessageRepository
    ){}

    async execute(groupId: string): Promise<IChatMessageEntity[]> {
        if(!groupId){
            throw new CustomError(
                ERROR_MESSAGES.GROUP_ID_REQUIRED,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        return this._chatMessageRepository.getMessageByGroupId(groupId)
    }
}