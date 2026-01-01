import { IHostedGameEntity } from "../../models/hosted_game_entity";

export interface ICreateHostedGameUseCase {
  execute(data: {
    hostUserId: string;
    turfId: string;
    courtType: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    pricePerPlayer: number;
  }): Promise<IHostedGameEntity>
}
