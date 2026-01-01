import { inject, injectable } from "tsyringe";
import { IDeleteChatMessageUseCase } from "../../../domain/useCaseInterfaces/messages/delete_chat_message_usecase";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { Types } from "mongoose";

@injectable()
export class DeleteChatMessageUseCase implements IDeleteChatMessageUseCase{
    constructor(
        @inject("IChatMessageRepository")
        private _messageRepository:IChatMessageRepository
    ){
        console.log("Repo instance:",
    this._messageRepository.constructor.name)
    }

    async execute(messageId: string, userId: string): Promise<void> {
        console.log('bruhhh')
        console.log("messageId received:", messageId);
console.log("isValid ObjectId:", Types.ObjectId.isValid(messageId));

        const message = await this._messageRepository.findByIdd(messageId);
        console.log('brooi')
        if(!message) throw new CustomError(
            ERROR_MESSAGES.MESSAGE_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        )
        if(message.senderId !==userId){
            throw new CustomError(
                ERROR_MESSAGES.NOT_ALLOWED,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        console.log('hahahh')

        await this._messageRepository.softDeleteById(messageId)
    }
}