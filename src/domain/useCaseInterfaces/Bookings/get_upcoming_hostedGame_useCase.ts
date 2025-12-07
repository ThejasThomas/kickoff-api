import { IHostedGameItem } from "../../models/get_hosted_game_entity";
import { IHostedGameEntity } from "../../models/hosted_game_entity";

export interface IGetUpcomingHostedGamesUseCase{
    execute():Promise<IHostedGameItem[]>
}