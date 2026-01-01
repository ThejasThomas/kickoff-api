import { ITurfRatingResult } from "../../models/rating_entity";

export interface IGetTurfRatingsUseCase {
  execute(
    turfId: string,
    page: number,
    limit: number
  ): Promise<ITurfRatingResult>;
}
