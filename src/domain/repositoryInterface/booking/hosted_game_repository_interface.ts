import { IHostedGameEntity } from "../../models/hosted_game_entity";

export interface IHostedGameRepository{
    createGame(data:IHostedGameEntity):Promise<IHostedGameEntity>
    getById(id:string):Promise<IHostedGameEntity | null>

}