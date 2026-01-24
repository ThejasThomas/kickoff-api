import { IHostedGameDTO } from "../../../application/dtos/hosted_game_dto";

export interface ICreateHostedGameUseCase {
  execute(data: {
    hostUserId: string;
    turfId: string;
    courtType: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    pricePerPlayer: number;
    sessionId?:string
  }): Promise<IHostedGameDTO>
}
