import { inject, injectable } from "tsyringe";
import { ISaveChatMessageUseCase } from "../../../domain/useCaseInterfaces/messages/saveChatMessage_usecase_interface";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IChatMessageDTO } from "../../dtos/chat_message_dto";

@injectable()

export class SaveChatMessageUseCase implements ISaveChatMessageUseCase{
    constructor(
        @inject("IChatMessageRepository")
        private _chatMessageRepository:IChatMessageRepository
    ){}
    async execute(data: { groupId: string; senderId: string; text: string;replyTo?:{messageId:string;senderId:string;text:string} }): Promise<IChatMessageDTO> {
        const {groupId,senderId,text,replyTo}=data;
        console.log('grouppppIDDD',groupId)

        if(!groupId || !senderId || !text.trim()){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TEXT_MESSAGE,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        return await this._chatMessageRepository.createMessage({
            groupId,
            senderId,
            text,
            replyTo
        })
    }
}