import { inject, injectable } from "tsyringe";
import { IGetChatMessageUseCase } from "../../../domain/useCaseInterfaces/messages/getChatMessageUsecase_interface";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IChatMessageDTO } from "../../dtos/chat_message_dto";

@injectable()

export class GetChatMessagesUseCase implements IGetChatMessageUseCase {
    constructor(
        @inject("IChatMessageRepository")
        private _chatMessageRepository:IChatMessageRepository
    ){}

    async execute(groupId: string): Promise<IChatMessageDTO[]> {
        if(!groupId){
            throw new CustomError(
                ERROR_MESSAGES.GROUP_ID_REQUIRED,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        return this._chatMessageRepository.getMessageByGroupId(groupId)
    }
}