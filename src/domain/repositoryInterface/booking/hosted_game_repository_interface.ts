import { IHostedGameItem } from "../../models/get_hosted_game_entity";
import { GetUpcomingHostedGamesParams } from "../../models/GetUpcomingHostedGameParams";
import { IHostedGameEntity } from "../../models/hosted_game_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IHostedGameRepository extends IBaseRepository<IHostedGameEntity> {
  createGame(data: IHostedGameEntity): Promise<IHostedGameEntity>;
  getById(id: string): Promise<IHostedGameEntity | null>;
  findbyTurfIdAndDate(
    turfId: string,
    slotDate: string
  ): Promise<IHostedGameEntity[]>;
  getUpComingGames(params:GetUpcomingHostedGamesParams): Promise<IHostedGameItem[]>;
  joinGame(gameId: string, userId: string): Promise<boolean>;
  getHostedGameById(id: string): Promise<IHostedGameItem | null>;
  findByTurfAndDateForOwner(
    turfId: string,
    date: string
  ): Promise<IHostedGameEntity[]>;
  findBySlot(
    turfId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<IHostedGameEntity | null>;
}
