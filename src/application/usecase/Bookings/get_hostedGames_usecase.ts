import { inject, injectable } from "tsyringe";
import { IGetUpcomingHostedGamesUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_upcoming_hostedGame_useCase";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { IHostedGameEntity } from "../../../domain/models/hosted_game_entity";
import { IHostedGameItem } from "../../../domain/models/get_hosted_game_entity";

@injectable()
export class GetUpcomingHostedGamesUseCase implements IGetUpcomingHostedGamesUseCase{
    constructor(
        @inject("IHostedGameRepository")
        private _hostedGamesRepository:IHostedGameRepository
    ){}

    async execute(): Promise<IHostedGameItem[]> {
        return await this._hostedGamesRepository.getUpComingGames()
    }
}