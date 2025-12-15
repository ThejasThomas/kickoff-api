import { inject, injectable } from "tsyringe";
import { IJoinHostedGameUseCase } from "../../../domain/useCaseInterfaces/Bookings/join_hostedGame_usecase_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IChatGroupRepository } from "../../../domain/repositoryInterface/chatgroup/chat_group_repository_interface";

@injectable()
export class JoinHostedGameUseCase implements IJoinHostedGameUseCase{
    constructor(
        @inject("IHostedGameRepository")
        private _hostedGameRepository:IHostedGameRepository,
        @inject("IChatGroupRepository")
        private _chatGroupRepository:IChatGroupRepository
    ){}

    async execute(data: { gameId: string; userId: string; }): Promise<{ success: boolean; message: string; }> {
        const {gameId,userId}=data;

        const game =await this._hostedGameRepository.getById(gameId);

        if(!game){
            throw new CustomError(
                ERROR_MESSAGES.NOT_GAME_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        if(game.hostUserId===userId){
            throw new CustomError(
                ERROR_MESSAGES.CANNOT_JOIN_OWN_GAME,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        if(game.status==="full"){
            throw new CustomError(
                ERROR_MESSAGES.GAME_IS_FULL,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const success=await this._hostedGameRepository.joinGame(
            gameId,
            userId
        )
        if(!success){
            throw new CustomError(
                ERROR_MESSAGES.ALREADY_JOINED,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const chatGroup =await this._chatGroupRepository.findByHostedGameId(gameId)

        if(!chatGroup){
            throw new CustomError(
                ERROR_MESSAGES.CHAT_GROUP_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        await this._chatGroupRepository.addMember(
            chatGroup._id!.toString(),
            userId
        )
        return {
            success:true,
            message:"You joined game successfully"
        }
    }
}