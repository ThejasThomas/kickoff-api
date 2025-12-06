import { inject, injectable } from "tsyringe";
import { ICreateHostedGameUseCase } from "../../../domain/useCaseInterfaces/Bookings/create_hosted_game_usecase_interface";
import { IHostedGameEntity } from "../../../domain/models/hosted_game_entity";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

const capacityMap: Record<string, number> = {
  "5x5": 10,
  "6x6": 12,
  "7x7": 14,
  "11x11": 22,
};

@injectable()
export class createHostedGameUseCase implements ICreateHostedGameUseCase {
  constructor(
    @inject("IHostedGameRepository")
    private _hostedGameRepo: IHostedGameRepository
  ) {}

  async execute(data: {
    hostUserId: string;
    turfId: string;
    courtType: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    pricePerPlayer: number;
  }): Promise<IHostedGameEntity> {
    if (!data.courtType || !capacityMap[data.courtType]) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_COURT_TYPE,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const capacity = capacityMap[data.courtType];

    const gameData = {
      ...data,
      capacity,
      status: "open" as const,
      players: [],
    };

    return await this._hostedGameRepo.createGame(gameData);
  }
}
