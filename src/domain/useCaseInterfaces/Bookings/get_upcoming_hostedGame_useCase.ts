import { IHostedGameItem } from "../../models/get_hosted_game_entity";
import { GetUpcomingHostedGamesParams } from "../../models/GetUpcomingHostedGameParams";

export interface IGetUpcomingHostedGamesUseCase{
    execute(params:GetUpcomingHostedGamesParams):Promise<IHostedGameItem[]>
}