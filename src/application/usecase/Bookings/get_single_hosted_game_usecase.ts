import { inject, injectable } from "tsyringe";
import { IGetSingleHostedGameUseCase } from "../../../domain/useCaseInterfaces/Bookings/getSingleHostedGameUseCase_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { IHostedGameItem } from "../../../domain/models/get_hosted_game_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetSingleHostedGameUseCase implements IGetSingleHostedGameUseCase{
    constructor(
        @inject("IHostedGameRepository")
        private _hostedGameRepository:IHostedGameRepository
    ){}
    async execute(gameId: string): Promise<IHostedGameItem | null> {
        if(!gameId){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ID,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const game=await this._hostedGameRepository.getHostedGameById(gameId)
        if(!game){
            throw new CustomError(
                ERROR_MESSAGES.NOT_GAME_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return game
    }
}