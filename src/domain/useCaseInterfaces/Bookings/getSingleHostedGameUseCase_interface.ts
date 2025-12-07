import { IHostedGameItem } from "../../models/get_hosted_game_entity";

export interface IGetSingleHostedGameUseCase {
  execute(gameId: string): Promise<IHostedGameItem | null>;
}
