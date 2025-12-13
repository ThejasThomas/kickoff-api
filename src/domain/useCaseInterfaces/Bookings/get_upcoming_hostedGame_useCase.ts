import { IHostedGameItem } from "../../models/get_hosted_game_entity";
import { GetUpcomingHostedGamesParams } from "../../models/GetUpcomingHostedGameParams";
import { IHostedGameEntity } from "../../models/hosted_game_entity";

export interface IGetUpcomingHostedGamesUseCase{
    execute(params:GetUpcomingHostedGamesParams):Promise<IHostedGameItem[]>
}