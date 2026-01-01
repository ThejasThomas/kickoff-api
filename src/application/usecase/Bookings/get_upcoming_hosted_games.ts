import { inject, injectable } from "tsyringe";
import { IGetUpcomingHostedGamesByUserUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_upcoming_hosted_game_usecase_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { mapHostedGameDTOList } from "../../mappers/hostedGameMappers";
import { HostedGameDTO } from "../../dtos/host_game_dto";

@injectable()

export class GetUpcomingHostedGameByUserUseCase implements IGetUpcomingHostedGamesByUserUseCase{
    constructor(
        @inject("IHostedGameRepository")
        private _hostedGameRepo:IHostedGameRepository
    ){}

    async execute(userId: string, page: number, limit: number, search: string): Promise<{ games: HostedGameDTO[]; totalPages: number; total: number; }> {
        const skip=(page -1)*limit

        const {games,total}=await this._hostedGameRepo.findUpComingByUser(
            userId,
            skip,
            limit,
            search
        )

        const mappedGames =mapHostedGameDTOList(games)

        return {
            games:mappedGames,
            totalPages:Math.ceil(total/limit),
            total
        }

    }
}
