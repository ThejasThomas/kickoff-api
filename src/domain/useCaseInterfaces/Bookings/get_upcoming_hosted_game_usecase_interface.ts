import { HostedGameDTO } from "../../../application/dtos/host_game_dto"
import { IHostedGameEntity } from "../../models/hosted_game_entity"

export interface IGetUpcomingHostedGamesByUserUseCase{
    execute(userId:string,page:number,limit:number,search:string):Promise<{
        games:HostedGameDTO[]
        totalPages:number
        total:number
    }>
}