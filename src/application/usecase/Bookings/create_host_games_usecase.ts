import { inject, injectable } from "tsyringe";
import { ICreateHostedGameUseCase } from "../../../domain/useCaseInterfaces/Bookings/create_hosted_game_usecase_interface";
import { IHostedGameEntity } from "../../../domain/models/hosted_game_entity";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import moment from "moment-timezone";
import { ICreateChatGroupUseCase } from "../../../domain/useCaseInterfaces/users/create_chat_group_usecase_interface";
import { IHostedGameDTO } from "../../dtos/hosted_game_dto";

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
    private _hostedGameRepo: IHostedGameRepository,
    @inject("ICreateChatGroupUseCase")
    private _createChatGroupUseCase: ICreateChatGroupUseCase
  ) {}

  async execute(data: {
    hostUserId: string;
    turfId: string;
    courtType: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    pricePerPlayer: number;
    sessionId?:string;
  }): Promise<IHostedGameDTO> {
    if (!data.courtType || !capacityMap[data.courtType]) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_COURT_TYPE,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    let turfId= data.turfId
    let  slotDate= data.slotDate
     let  startTime= data.startTime
     let  endTime= data.endTime
    const existingGame = await this._hostedGameRepo.findBySlot(
      turfId,
      slotDate,
      startTime,
      endTime
    );
    if (existingGame) {
      throw new CustomError(
        "Slot already hosted for this turf and time. Choose another slot.",
        HTTP_STATUS.CONFLICT 
      );
    }
    const capacity = capacityMap[data.courtType];
    const gameStartAt = moment
      .tz(
        `${data.slotDate} ${data.startTime}`,
        "YYYY-MM-DD HH:mm",
        "Asia/Kolkata"
      )
      .utc()
      .toDate();

    const gameData: Omit<IHostedGameEntity, "_id"> = {
      ...data,
      capacity,
      status: "open",
      gameStartAt,
      players: [
        {
          userId: data.hostUserId,
          status: "paid",
          paymentId: data.sessionId ??undefined,
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    const game = await this._hostedGameRepo.createGame(gameData);

    await this._createChatGroupUseCase.execute({
      hostedGameId: game._id!.toString(),
      hostUserId: data.hostUserId,
    });
    return game;
  }
}
