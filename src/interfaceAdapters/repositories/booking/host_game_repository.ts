import { injectable } from "tsyringe";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { BaseRepository } from "../base_repository";
import { IHostedGameEntity } from "../../../domain/models/hosted_game_entity";
import { HostedGameModel } from "../../database/mongoDb/schemas/hosted_game_schema";

@injectable()
export class HostGameRepository implements IHostedGameRepository{
    async createGame(data: IHostedGameEntity): Promise<IHostedGameEntity> {
        return await HostedGameModel.create(data)
    }
    async getById(id: string): Promise<IHostedGameEntity | null> {
        return await HostedGameModel.findById(id)
    }
}