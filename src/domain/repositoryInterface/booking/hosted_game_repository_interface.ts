import { IHostedGameItem } from "../../models/get_hosted_game_entity";
import { IHostedGameEntity } from "../../models/hosted_game_entity";

export interface IHostedGameRepository{
    createGame(data:IHostedGameEntity):Promise<IHostedGameEntity>
    getById(id:string):Promise<IHostedGameEntity | null>
    findbyTurfIdAndDate(turfId:string,slotDate:string):Promise<IHostedGameEntity[]>
    getUpComingGames():Promise<IHostedGameItem[]>
    joinGame(gameId:string,userId:string):Promise<boolean>
    getHostedGameById(id:string):Promise<IHostedGameItem |null>
}